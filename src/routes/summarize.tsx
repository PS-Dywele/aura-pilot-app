import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { runAi } from "@/lib/ai.functions";
import { OutputCard } from "@/components/output-card";

export const Route = createFileRoute("/summarize")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Lumen AI" },
      { name: "description", content: "Turn raw meeting notes into structured summaries with action items." },
      { property: "og:title", content: "Meeting Summarizer — Lumen AI" },
      { property: "og:description", content: "Turn raw meeting notes into structured summaries with action items." },
    ],
  }),
  component: SummarizePage,
});

function SummarizePage() {
  const [notes, setNotes] = useState("");
  const callAi = useServerFn(runAi);
  const mutation = useMutation({
    mutationFn: () => callAi({ data: { kind: "summarize", payload: { notes } } }),
  });
  const submit = () => {
    if (!notes.trim()) return;
    mutation.mutate();
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Meeting Notes Summarizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste raw notes — get key points, decisions, action items, and dates.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Raw notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Paste your meeting notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                placeholder="Attendees discussed Q3 roadmap. Maya will own the API migration, due Aug 15..."
              />
            </div>
            <Button onClick={submit} disabled={mutation.isPending || !notes.trim()} className="w-full gap-2">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Summarize
            </Button>
          </CardContent>
        </Card>
        <OutputCard
          title="Summary"
          loading={mutation.isPending}
          error={mutation.isError ? (mutation.error as Error).message : null}
          content={mutation.data?.content ?? null}
          onRetry={submit}
          emptyHint="Your structured summary will appear here."
          renderMarkdown
        />
      </div>
    </div>
  );
}