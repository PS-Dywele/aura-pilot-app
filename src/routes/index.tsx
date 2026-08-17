import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { BrandMark } from "@/components/brand-mark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Catalytic Private Test" },
      { name: "description", content: "Your AI productivity workspace: draft emails, summarize meetings, and plan tasks." },
      { property: "og:title", content: "Dashboard — Catalytic Private Test" },
      { property: "og:description", content: "Your AI productivity workspace: draft emails, summarize meetings, and plan tasks." },
    ],
  }),
  component: Index,
});

const features = [
  {
    to: "/email",
    title: "Smart Email Generator",
    description: "Draft polished emails tuned to your audience and tone.",
    icon: Mail,
  },
  {
    to: "/summarize",
    title: "Meeting Summarizer",
    description: "Turn raw notes into structured summaries with action items.",
    icon: FileText,
  },
  {
    to: "/plan",
    title: "AI Task Planner",
    description: "Prioritize tasks and build a time-blocked plan for your day.",
    icon: ListChecks,
  },
] as const;

function Index() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="animate-rise mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <BrandMark className="h-16 w-16" />
        <div>
          <PageHeader
            eyebrow="Catalytic systems · Private Test"
            title="An enterprise AI workspace"
            description="Three precision instruments to write, summarize, and plan — engineered for calm, high-signal work."
          />
        </div>
      </section>
      <div
        className="animate-rise mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 sm:grid-cols-4"
        style={{ animationDelay: "60ms" }}
      >
        {[
          { k: "Model", v: "Gemini 3" },
          { k: "Latency", v: "< 2s" },
          { k: "Retention", v: "None" },
          { k: "Status", v: "Operational" },
        ].map((s) => (
          <div key={s.k} className="bg-card px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.k}</p>
            <p className="mt-1 text-sm font-medium tracking-tight">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Link
            key={f.to}
            to={f.to}
            className="group animate-rise rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            <Card className="surface-sheen beam-hover h-full border-border/70 shadow-soft transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:shadow-lift">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between gap-2 text-base tracking-tight">
                  {f.title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </CardTitle>
                <CardDescription className="leading-relaxed">{f.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="status-dot" /> Ready
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
