import logo from "@/assets/catalytic-logo.png";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[10px] border border-primary/25 bg-primary/8 p-1 shadow-soft",
        "before:absolute before:inset-0 before:rounded-[10px] before:bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_oklab,var(--color-primary)_28%,transparent),transparent_70%)] before:opacity-70 before:blur-[2px]",
        className,
      )}
    >
      <img
        src={logo}
        alt="Catalytic Private Test logo"
        width={1024}
        height={1024}
        className="animate-orbit-pulse relative h-full w-full object-contain"
      />
    </span>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark className="h-8 w-8" />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">
          Catalytic <span className="text-primary">Private Test</span>
        </span>
        {!compact && (
          <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Autonomous Systems
          </span>
        )}
      </span>
    </span>
  );
}