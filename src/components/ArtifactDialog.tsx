import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Artifact } from "@/data/artifacts";

type Props = {
  artifact: Artifact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ArtifactDialog({ artifact, open, onOpenChange }: Props) {
  if (!artifact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-3xl border-border bg-card text-foreground max-h-[95vh] overflow-y-auto md:overflow-visible">
        <div className="flex flex-col md:flex-row md:items-stretch md:gap-6">
          {/* Tall portrait card image */}
          <div className="w-full md:w-auto md:shrink-0 flex justify-center pt-2 md:pt-0">
            <div className="w-full md:w-auto aspect-[9/16] max-h-[70vh] md:max-h-[80vh] md:h-[80vh] rounded-md overflow-hidden ring-1 ring-primary/20 bg-background">
              <img
                src={artifact.detailImage}
                alt={artifact.title}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Text block */}
          <div className="flex-1 flex flex-col md:justify-center min-w-0">
            <DialogHeader className="pt-2 md:pt-0 space-y-1.5">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Fragment {artifact.id}</p>
              <DialogTitle className="font-display text-4xl md:text-5xl text-foreground">
                {artifact.title}
              </DialogTitle>
              <DialogDescription className="font-display text-lg text-muted-foreground italic">
                {artifact.caption}
              </DialogDescription>
            </DialogHeader>

            <p className="mt-4 text-base leading-relaxed text-foreground/90 text-pretty">
              {artifact.lore}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
