import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { runAi } from "@/lib/ai.functions";
import { OutputCard } from "@/components/output-card";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lumen AI" },
      { name: "description", content: "Prioritize tasks and build a time-blocked plan with Eisenhower logic." },
      { property: "og:title", content: "AI Task Planner — Lumen AI" },
      { property: "og:description", content: "Prioritize tasks and build a time-blocked plan with Eisenhower logic." },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const [tasks, setTasks] = useState("");
  const [time, setTime] = useState("");
  const callAi = useServerFn(runAi);
  const mutation = useMutation({
    mutationFn: () => callAi({ data: { kind: "plan", payload: { tasks, time } } }),
  });
  const submit = () => {
    if (!tasks.trim()) return;
    mutation.mutate();
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Task Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List your tasks — get a prioritized, time-blocked schedule.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={12}
                placeholder={"Finalize Q3 OKRs\nReview design mocks\nCall supplier about shipment\nGym"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time available (optional)</Label>
              <Input
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6 hours today, or 9am–5pm"
              />
            </div>
            <Button onClick={submit} disabled={mutation.isPending || !tasks.trim()} className="w-full gap-2">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Build plan
            </Button>
          </CardContent>
        </Card>
        <OutputCard
          title="Your plan"
          loading={mutation.isPending}
          error={mutation.isError ? (mutation.error as Error).message : null}
          content={mutation.data?.content ?? null}
          onRetry={submit}
          emptyHint="Your prioritized, time-blocked plan will appear here."
          renderMarkdown
        />
      </div>
    </div>
  );
}