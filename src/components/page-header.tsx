type Props = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="animate-rise mb-8">
      {eyebrow && (
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-primary/80">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}