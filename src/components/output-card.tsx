import { useState } from "react";
import { Copy, Check, Loader2, AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/ai-disclaimer";

type Props = {
  title: string;
  content: string | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  emptyHint: string;
  renderMarkdown?: boolean;
};

export function OutputCard({ title, content, loading, error, onRetry, emptyHint, renderMarkdown }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Card className="surface-sheen flex h-full flex-col border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 pb-4">
        <CardTitle className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </CardTitle>
        {content && !loading && (
          <Button variant="outline" size="sm" onClick={copy} className="gap-1.5 transition-colors">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-5">
        {loading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm tracking-tight">Generating…</p>
          </div>
        )}
        {!loading && error && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5">
                <RotateCw className="h-3.5 w-3.5" /> Retry
              </Button>
            )}
          </div>
        )}
        {!loading && !error && !content && (
          <div className="flex h-full min-h-[200px] items-center justify-center px-6 text-center text-sm leading-relaxed text-balance text-muted-foreground/80">
            {emptyHint}
          </div>
        )}
        {!loading && !error && content && (
          <div className="animate-rise">
            {renderMarkdown ? (
              <SimpleMarkdown text={content} />
            ) : (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
                {content}
              </pre>
            )}
            <AiDisclaimer />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Minimal markdown renderer for headings, bullets, bold — no external deps.
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="ml-5 list-disc space-y-1 text-sm">
          {listBuf.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </ul>,
      );
      listBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^##\s+/.test(line)) {
      flushList();
      out.push(
        <h3 key={`h-${out.length}`} className="mt-4 mb-2 text-sm font-semibold tracking-tight first:mt-0">
          {line.replace(/^##\s+/, "")}
        </h3>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^[-*]\s+/, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      out.push(
        <p key={`p-${out.length}`} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inline(line) }} />,
      );
    }
  }
  flushList();
  return <div className="space-y-1">{out}</div>;
}

function inline(s: string): string {
  const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}