import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SubmitAnswerDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");

  // NOTE: Verification + Sheets export wire up in a follow-up task.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card text-foreground">
        <DialogHeader>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Log Entry</p>
          <DialogTitle className="font-display text-4xl text-foreground">Transmit a Finding</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Whisper your answer to the archive. The shelves will respond.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="agent-name" className="text-xs uppercase tracking-widest text-muted-foreground">
              Your Name
            </label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent alias…"
              maxLength={60}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="answer" className="text-xs uppercase tracking-widest text-muted-foreground">
              Your Answer
            </label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="What did you find?"
              maxLength={300}
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>
          <Button type="submit" className="w-full font-display text-lg tracking-wide" size="lg">
            Transmit
          </Button>
          <p className="text-center text-xs text-muted-foreground italic">
            // awaiting input…
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
