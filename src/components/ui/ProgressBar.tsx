import { cn } from "@/lib/utils/format";

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "auto";
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  tone = "auto",
  size = "md",
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const resolvedTone =
    tone === "auto"
      ? pct >= 90
        ? "emerald"
        : pct >= 60
          ? "indigo"
          : pct > 0
            ? "amber"
            : "rose"
      : tone;

  const barColor =
    resolvedTone === "emerald"
      ? "bg-emerald-500"
      : resolvedTone === "indigo"
        ? "bg-indigo-600"
        : resolvedTone === "amber"
          ? "bg-amber-500"
          : "bg-slate-300";

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-slate-100",
        size === "sm" ? "h-1.5" : "h-2.5",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", barColor)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
