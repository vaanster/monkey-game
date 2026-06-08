import { useEffect, useState } from "react";
import { ArtifactCarousel } from "@/components/ArtifactCarousel";
import { SubmitAnswerDialog } from "@/components/SubmitAnswerDialog";
import { vipArtifacts, VIP_UNLOCK_ID } from "@/data/artifacts";
import { loadProgress } from "@/lib/submitAnswer";
import { Sparkles } from "lucide-react";

export default function App() {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>(() => loadProgress().unlockedArtifacts);

  useEffect(() => {
    const refresh = () => setUnlocked(loadProgress().unlockedArtifacts);
    window.addEventListener("nightshade:progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("nightshade:progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const vipUnlocked = unlocked.includes(VIP_UNLOCK_ID);

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(232,155,60,0.15),transparent_60%)] glow-pulse" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      <div className="pointer-events-none select-none fixed top-8 left-8 font-display text-[8rem] sm:text-[10rem] leading-none text-primary/10 rotate-[-8deg]">
        ?
      </div>
      <div className="pointer-events-none select-none fixed bottom-12 right-12 font-display text-[6rem] leading-none text-secondary/10 rotate-[12deg] hidden sm:block">
        ?
      </div>

      <header className="relative z-10 w-full max-w-4xl mx-auto text-center px-6 pt-10 sm:pt-16">
        <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary font-bold">
          Case File #88-Alpha
        </p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl md:text-8xl text-balance text-foreground leading-[0.95]">
          Archive of Unspoken Echoes
        </h1>
        <div className="mx-auto mt-5 h-px w-32 bg-primary/50" />
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto text-pretty">
          Five curious things and one sealed slot. Inspect them. Solve their riddles. Log what you find.
        </p>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 gap-16 sm:gap-24">
        <ArtifactCarousel />

        {vipUnlocked && (
          <section className="w-full flex flex-col items-center gap-8 animate-reveal">
            <div className="text-center">
              <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary font-bold">
                Restricted Wing
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl text-foreground leading-none">
                VIP
              </h2>
              <div className="mx-auto mt-4 h-px w-24 bg-primary/50" />
            </div>
            <ArtifactCarousel source={vipArtifacts} />
          </section>
        )}
      </main>

      <button
        type="button"
        onClick={() => setSubmitOpen(true)}
        className="group fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8 animate-reveal"
        aria-label="Submit an answer"
      >
        <span className="relative flex items-center justify-center size-24 sm:size-28 rounded-full bg-primary text-primary-foreground font-display text-lg sm:text-xl text-center leading-tight shadow-2xl shadow-primary/40 ring-4 ring-primary/30 ring-offset-4 ring-offset-background transition-transform group-hover:rotate-6 group-hover:scale-105 group-active:scale-95">
          <span className="absolute inset-2 rounded-full border-2 border-dashed border-primary-foreground/30 animate-slow-spin" />
          <span className="relative flex flex-col items-center gap-1">
            <Sparkles className="size-5" />
            Submit
            <br className="hidden" />
            Answer
          </span>
        </span>
      </button>

      <footer className="relative z-10 w-full max-w-5xl mx-auto mt-12 px-6 pb-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-6 text-xs uppercase tracking-widest text-muted-foreground">
        <div className="space-y-2 max-w-xs">
          <p className="font-bold text-foreground/70 font-display text-base normal-case tracking-normal">
            Project Codename: Nightshade
          </p>
          <p className="normal-case tracking-normal text-sm">
            A small archive for restless researchers. Tell no one. Tell everyone.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 items-start sm:items-end">
          <a href="#" className="hover:text-primary transition-colors">The Lore</a>
          <a href="#" className="hover:text-primary transition-colors">Previous Solves</a>
          <a href="#" className="hover:text-primary transition-colors">Status: Stable</a>
        </nav>
      </footer>

      <SubmitAnswerDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </div>
  );
}
