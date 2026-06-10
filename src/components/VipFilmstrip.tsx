import { useEffect, useMemo, useRef, useState } from "react";
import { vipArtifacts as baseVip, type Artifact } from "@/data/artifacts";
import { ArtifactDialog } from "@/components/ArtifactDialog";
import { loadProgress, loadCustomArtifacts } from "@/lib/submitAnswer";

type Props = { source?: Artifact[] };

export function VipFilmstrip({ source = baseVip }: Props = {}) {
  const [unlocked, setUnlocked] = useState<string[]>(() => loadProgress().unlockedArtifacts);
  const [custom, setCustom] = useState<Artifact[]>(() => loadCustomArtifacts());
  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const refresh = () => {
      setUnlocked(loadProgress().unlockedArtifacts);
      setCustom(loadCustomArtifacts());
    };
    window.addEventListener("nightshade:progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("nightshade:progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const relics: Artifact[] = useMemo(() => {
    const sourceIds = new Set(source.map((a) => a.id));
    const isVip = source.some((a) => a.id.startsWith("v"));
    const relevantCustom = custom.filter((c) => {
      if (sourceIds.has(c.id)) return true;
      const customIsVip = c.id.startsWith("v");
      return customIsVip === isVip;
    });
    const customIds = new Set(relevantCustom.map((c) => c.id));
    const merged: Artifact[] = [
      ...source.filter((a) => !customIds.has(a.id)),
      ...relevantCustom,
    ];
    return merged
      .map((a) => (a.hidden && unlocked.includes(a.id) ? { ...a, hidden: false } : a))
      .filter((a) => !a.hidden);
  }, [unlocked, custom, source]);

  // Center the strip on first render once we have relics.
  useEffect(() => {
    if (!initializedRef.current && relics.length > 0) {
      setActiveIndex(Math.floor(relics.length / 2));
      initializedRef.current = true;
    }
    if (relics.length > 0 && activeIndex > relics.length - 1) {
      setActiveIndex(relics.length - 1);
    }
  }, [relics.length, activeIndex]);

  const shift = (delta: number) => {
    if (relics.length === 0) return;
    setActiveIndex((i) => Math.max(0, Math.min(relics.length - 1, i + delta)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openId) return;
      if (e.key === "ArrowLeft") shift(-1);
      if (e.key === "ArrowRight") shift(1);
      if (e.key === "Enter") {
        const active = relics[activeIndex];
        if (active) setOpenId(active.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, activeIndex, relics]);

  if (relics.length === 0) return null;

  const active = relics[activeIndex];

  const styleFor = (i: number) => {
    const d = i - activeIndex;
    const abs = Math.abs(d);
    const sign = d === 0 ? 0 : d / abs;

    let size: string;
    let opacity: number;
    let rotateY: number;
    let translateX: number; // px overlap toward center
    let z: number;

    if (abs === 0) {
      size = "size-48 sm:size-64";
      opacity = 1;
      rotateY = 0;
      translateX = 0;
      z = 40;
    } else if (abs === 1) {
      size = "size-32 sm:size-44";
      opacity = 0.8;
      rotateY = sign * -12;
      translateX = sign * -16;
      z = 30;
    } else if (abs === 2) {
      size = "size-24 sm:size-32";
      opacity = 0.5;
      rotateY = sign * -20;
      translateX = sign * -28;
      z = 20;
    } else {
      size = "size-20";
      opacity = 0.25;
      rotateY = sign * -25;
      translateX = sign * -40;
      z = 10;
    }

    return {
      sizeClass: size,
      style: {
        opacity,
        transform: `translateX(${translateX}px) rotateY(${rotateY}deg)`,
        zIndex: z,
      } as React.CSSProperties,
    };
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div
        className="relative w-full max-w-5xl overflow-hidden"
        style={{ perspective: "1200px" }}
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) shift(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
          {relics.map((r, i) => {
            const { sizeClass, style } = styleFor(i);
            const isActive = i === activeIndex;
            return (
              <button
                key={r.id}
                type="button"
                aria-label={isActive ? `Inspect ${r.title}` : `Focus ${r.title}`}
                onClick={() => (isActive ? setOpenId(r.id) : setActiveIndex(i))}
                className={`relative shrink-0 ${sizeClass} rounded-full overflow-hidden bg-card ring-2 ${
                  isActive
                    ? "ring-primary shadow-2xl shadow-primary/30"
                    : "ring-primary/20"
                } transition-all duration-300 ease-out hover:opacity-100`}
                style={style}
              >
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <div className="absolute inset-0 ring-4 ring-primary/30 rounded-full pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center space-y-1 px-4 min-h-[5rem]">
        <h3 className="font-display text-3xl sm:text-4xl text-foreground">{active.title}</h3>
        <p className="text-sm text-muted-foreground italic">{active.caption}</p>
      </div>

      <ArtifactDialog
        artifact={openId ? relics.find((r) => r.id === openId) ?? null : null}
        open={!!openId}
        onOpenChange={(o) => !o && setOpenId(null)}
      />
    </div>
  );
}
