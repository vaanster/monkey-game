import { useEffect, useMemo, useRef, useState } from "react";
import { artifacts as baseArtifacts, type Artifact } from "@/data/artifacts";
import { ArtifactDialog } from "@/components/ArtifactDialog";
import { loadProgress, loadCustomArtifacts } from "@/lib/submitAnswer";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

export function ArtifactCarousel() {
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>(() => loadProgress().unlockedArtifacts);
  const [custom, setCustom] = useState<Artifact[]>(() => loadCustomArtifacts());
  const touchStartX = useRef<number | null>(null);

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

  const artifacts: Artifact[] = useMemo(() => {
    // Custom artifacts (from sheet) override base entries with the same id.
    const customIds = new Set(custom.map((c) => c.id));
    const merged: Artifact[] = [
      ...baseArtifacts.filter((a) => !customIds.has(a.id)),
      ...custom,
    ];
    // Reveal anything in `unlocked`, then drop anything still hidden so it
    // doesn't appear in the carousel at all until unlocked.
    return merged
      .map((a) => (a.hidden && unlocked.includes(a.id) ? { ...a, hidden: false } : a))
      .filter((a) => !a.hidden);
  }, [unlocked, custom]);

  const safeIndex = artifacts.length > 0 ? Math.min(index, artifacts.length - 1) : 0;
  const current: Artifact | undefined = artifacts[safeIndex];
  const isLocked = !current;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + artifacts.length) % artifacts.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openId) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Enter" && !isLocked && current) setOpenId(current.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, isLocked, current?.id]);

  const openCurrent = () => {
    if (!isLocked && current) setOpenId(current.id);
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div
        className="flex items-center justify-center w-full max-w-5xl gap-2 sm:gap-8"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {/* Left arrow */}
        <button
          type="button"
          aria-label="Previous artifact"
          onClick={() => go(-1)}
          className="group shrink-0 p-3 sm:p-4 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
        >
          <ChevronLeft className="size-10 sm:size-14" strokeWidth={2.5} />
        </button>

        {/* Artifact (circular) */}
        <div className="relative group">
          <div className="artifact-bob relative">
            {/* Decorative dashed outer ring */}
            <div className="absolute -inset-4 rounded-full border-2 border-dashed border-muted/40 animate-slow-spin" />
            {/* Solid frame ring */}
            <div className="absolute -inset-1 rounded-full border-4 border-primary/40" />

            <button
              type="button"
              onClick={openCurrent}
              disabled={isLocked}
              aria-label={isLocked ? "Locked slot" : `Inspect ${current!.title}`}
              className="relative size-56 sm:size-80 rounded-full overflow-hidden bg-card ring-4 ring-background shadow-2xl shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-100 disabled:cursor-not-allowed"
            >
              {isLocked ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3 bg-muted/30">
                  <Lock className="size-12" />
                  <span className="font-display text-2xl">Sealed</span>
                </div>
              ) : (
                <>
                  <img
                    src={current.image}
                    alt={current.title}
                    width={768}
                    height={768}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 flex items-center justify-center">
                    <span className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display text-2xl shadow-lg">
                      Inspect
                    </span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          aria-label="Next artifact"
          onClick={() => go(1)}
          className="group shrink-0 p-3 sm:p-4 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
        >
          <ChevronRight className="size-10 sm:size-14" strokeWidth={2.5} />
        </button>
      </div>

      {/* Title + caption */}
      <div className="text-center space-y-1 px-4 min-h-[5rem]">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground">
          {isLocked ? "???" : current.title}
        </h2>
        <p className="text-sm text-muted-foreground italic">
          {isLocked ? "This slot has not yet been opened." : current.caption}
        </p>
      </div>

      {/* Indicators */}
      <div className="flex gap-3">
        {artifacts.map((a, i) => (
          <button
            key={a.id}
            type="button"
            aria-label={`Go to artifact ${i + 1}`}
            onClick={() => setIndex(i)}
            className={
              i === index
                ? "size-3 rounded-full bg-primary ring-4 ring-primary/20 transition-all"
                : "size-2.5 rounded-full bg-muted/40 hover:bg-muted/70 transition-all"
            }
          />
        ))}
      </div>

      <ArtifactDialog
        artifact={openId ? artifacts.find((a) => a.id === openId) ?? null : null}
        open={!!openId}
        onOpenChange={(o) => !o && setOpenId(null)}
      />
    </div>
  );
}
