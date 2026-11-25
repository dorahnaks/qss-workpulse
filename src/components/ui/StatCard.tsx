import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  badge?: ReactNode;
  accent?: "default" | "indigo" | "emerald" | "amber";
  className?: string;
}

const ACCENT_BORDER: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "border-slate-200",
  indigo: "border-indigo-200/80",
  emerald: "border-emerald-200/80",
  amber: "border-amber-200/80",
};

export function StatCard({
  label,
  value,
  helper,
  badge,
  accent = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-2xs",
        ACCENT_BORDER[accent],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {badge}
      </div>
      <p className="mt-2.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      {helper ? (
        <p className="mt-1.5 text-xs text-slate-600">{helper}</p>
      ) : null}
    </div>
  );
}
