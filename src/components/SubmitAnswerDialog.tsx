import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitAnswer } from "@/lib/submitAnswer";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function SubmitAnswerDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !answer.trim()) return;
    setStatus({ kind: "loading" });
    try {
      const res = await submitAnswer({ name, answer });
      if (res.success) {
        setStatus({ kind: "success", message: res.message || "The archive accepts your finding." });
        setAnswer("");
        // Notify the carousel that new artifacts may be unlocked.
        window.dispatchEvent(new CustomEvent("nightshade:progress-updated"));
      } else {
        setStatus({ kind: "error", message: res.message || "Not quite. Try again." });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: "Transmission failed. Check your connection and try again.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setStatus({ kind: "idle" });
      }}
    >
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
              required
              disabled={status.kind === "loading"}
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
              required
              disabled={status.kind === "loading"}
              className="bg-background border-border resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full font-display text-lg tracking-wide"
            size="lg"
            disabled={status.kind === "loading"}
          >
            {status.kind === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Transmitting…
              </span>
            ) : (
              "Transmit"
            )}
          </Button>

          {status.kind === "success" && (
            <div className="flex items-start gap-2 rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-foreground">
              <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
              <p>{status.message}</p>
            </div>
          )}
          {status.kind === "error" && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-foreground">
              <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
              <p>{status.message}</p>
            </div>
          )}
          {status.kind === "idle" && (
            <p className="text-center text-xs text-muted-foreground italic">// awaiting input…</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
