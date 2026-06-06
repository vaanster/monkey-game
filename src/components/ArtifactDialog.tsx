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
      <DialogContent className="max-w-md border-border bg-card text-foreground max-h-[95vh] overflow-y-auto">
        {/* Tall portrait card image */}
        <div className="w-full flex justify-center pt-2">
          <div className="w-full aspect-[9/16] max-h-[70vh] rounded-md overflow-hidden ring-1 ring-primary/20 bg-background">
            <img
              src={artifact.detailImage}
              alt={artifact.title}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Text block */}
        <DialogHeader className="pt-2 space-y-1.5">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Fragment {artifact.id}</p>
          <DialogTitle className="font-display text-4xl md:text-5xl text-foreground">
            {artifact.title}
          </DialogTitle>
          <DialogDescription className="font-display text-lg text-muted-foreground italic">
            {artifact.caption}
          </DialogDescription>
        </DialogHeader>

        <p className="text-base leading-relaxed text-foreground/90 text-pretty">
          {artifact.lore}
        </p>
      </DialogContent>
    </Dialog>
  );
}
