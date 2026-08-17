export function AiDisclaimer() {
  return (
    <p className="mt-4 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
      AI-generated content may contain errors. Always review before use.
    </p>
  );
}

export function AppFooter() {
  return (
    <footer className="hairline-bottom mt-auto border-t border-border/60 px-6 py-6 text-center text-xs leading-relaxed text-muted-foreground">
      <span className="font-medium tracking-tight text-foreground/80">Catalytic Private Test</span>
      <span className="mx-2 opacity-40">·</span>
      Responsible AI — this workspace assists, it does not replace professional judgement. No user
      data is stored or shared.
    </footer>
  );
}