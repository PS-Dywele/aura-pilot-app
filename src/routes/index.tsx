import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lumen AI" },
      { name: "description", content: "Your AI productivity workspace: draft emails, summarize meetings, and plan tasks." },
      { property: "og:title", content: "Dashboard — Lumen AI" },
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
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Three focused AI tools to help you write, summarize, and plan — faster.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group">
            <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between text-base">
                  {f.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Powered by Gemini via Lovable AI.
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
