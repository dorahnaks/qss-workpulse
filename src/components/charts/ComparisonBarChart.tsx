import { formatNumber, formatPercent } from "@/lib/utils/format";

export interface ComparisonBarItem {
  id: string;
  label: string;
  sublabel?: string;
  target: number;
  actual: number;
  unit?: string;
}

interface ComparisonBarChartProps {
  title: string;
  subtitle?: string;
  items: ComparisonBarItem[];
  unit?: string;
}

export function ComparisonBarChart({
  title,
  subtitle,
  items,
  unit = "cartons",
}: ComparisonBarChartProps) {
  const maxValue = Math.max(
    1,
    ...items.flatMap((item) => [item.target, item.actual])
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-slate-200" />
            Target
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600" />
            Actual Produced
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const targetPct = Math.min(100, (item.target / maxValue) * 100);
          const actualPct = Math.min(100, (item.actual / maxValue) * 100);
          const achievement =
            item.target > 0 ? (item.actual / item.target) * 100 : 0;

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    {item.label}
                  </span>
                  {item.sublabel ? (
                    <span className="ml-2 text-slate-500">{item.sublabel}</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-700">
                  <span>
                    {formatNumber(item.actual)} / {formatNumber(item.target)}{" "}
                    {item.unit ?? unit}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-800">
                    {formatPercent(achievement, 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-300/80 transition-all duration-300"
                    style={{ width: `${targetPct}%` }}
                  />
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      achievement >= 95
                        ? "bg-emerald-500"
                        : achievement >= 70
                          ? "bg-indigo-600"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${actualPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
