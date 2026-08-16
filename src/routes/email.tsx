import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Loader2 } from "lucide-react";
import { runAi } from "@/lib/ai.functions";
import { OutputCard } from "@/components/output-card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Lumen AI" },
      { name: "description", content: "Generate professional email drafts tuned to audience and tone." },
      { property: "og:title", content: "Smart Email Generator — Lumen AI" },
      { property: "og:description", content: "Generate professional email drafts tuned to audience and tone." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [audience, setAudience] = useState("client");
  const [tone, setTone] = useState("Formal");
  const [points, setPoints] = useState("");

  const callAi = useServerFn(runAi);
  const mutation = useMutation({
    mutationFn: () =>
      callAi({ data: { kind: "email", payload: { audience, tone, points } } }),
  });

  const submit = () => {
    if (!points.trim()) return;
    mutation.mutate();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Compose"
        title="Smart Email Generator"
        description="Pick your audience and tone, list your points, and get a polished draft."
      />
      <div className="grid animate-rise gap-6 lg:grid-cols-2" style={{ animationDelay: "80ms" }}>
        <Card className="surface-sheen h-full border-border/70 shadow-soft">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <RadioGroup value={tone} onValueChange={setTone} className="flex flex-wrap gap-4">
                {["Formal", "Informal", "Persuasive"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <RadioGroupItem value={t} id={`tone-${t}`} />
                    <Label htmlFor={`tone-${t}`} className="font-normal">{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder={"• Confirm Friday delivery\n• Ask about Q3 priorities\n• Thank them for the intro call"}
                rows={8}
              />
            </div>
            <Button onClick={submit} disabled={mutation.isPending || !points.trim()} className="w-full gap-2">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate email
            </Button>
          </CardContent>
        </Card>
        <OutputCard
          title="Draft"
          loading={mutation.isPending}
          error={mutation.isError ? (mutation.error as Error).message : null}
          content={mutation.data?.content ?? null}
          onRetry={submit}
          emptyHint="Your AI-generated email will appear here."
        />
      </div>
    </div>
  );
}