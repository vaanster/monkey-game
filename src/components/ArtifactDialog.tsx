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
      <DialogContent className="max-w-2xl border-border bg-card text-foreground">
        <DialogHeader>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Fragment {artifact.id}</p>
          <DialogTitle className="font-display text-4xl md:text-5xl text-foreground">
            {artifact.title}
          </DialogTitle>
          <DialogDescription className="font-display text-lg text-muted-foreground italic">
            {artifact.caption}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 items-center pt-2">
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-full border-2 border-dashed border-muted/40" />
            <div className="relative size-48 sm:size-56 rounded-full overflow-hidden bg-background ring-4 ring-primary/30">
              <img
                src={artifact.image}
                alt={artifact.title}
                width={768}
                height={768}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-base leading-relaxed text-foreground/90 text-pretty">
            {artifact.lore}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
