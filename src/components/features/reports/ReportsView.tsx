"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { getReportsData, downloadReport } from "@/services/reports.service";
import type { ReportsData, ReportMetadata } from "@/types/reports";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function ReportsView() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"All" | "Daily" | "Weekly" | "Monthly">("All");
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReportsData();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredReports = useMemo(() => {
    if (!data) return [];
    if (filterType === "All") return data.availableReports;
    return data.availableReports.filter((report) => report.type === filterType);
  }, [data, filterType]);

  const handleDownload = async (report: ReportMetadata) => {
    setDownloading(report.id);
    try {
      await downloadReport(report.id, report.format);
      alert(`${report.title} downloaded successfully!`);
    } catch {
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const summaryText = data
    ? `Reports and analytics overview. Production trends: ${data.productionTrends.map((t) => `${t.period}: ${t.achievementRate}% achievement`).join(", ")}. Available reports: ${data.availableReports.length}.`
    : "";

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">Failed to load reports data.</p>
        <button
          type="button"
          onClick={() => void fetchData()}
          className="mt-3 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const maxTrendValue = Math.max(
    ...data.productionTrends.flatMap((t) => [t.target, t.actual])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Reports & Analytics
            </h2>
            <p className="text-sm text-slate-500">
              Production trends and downloadable reports
            </p>
          </div>
        </div>
        <ReadAloudButton
          text={summaryText}
          size="md"
          ariaLabel="Read reports summary"
        />
      </div>

      {/* Production Trends */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h3 className="text-base font-semibold text-[#111827] mb-1">
          Production Trends
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Target vs actual output over time
        </p>

        <div className="space-y-5">
          {data.productionTrends.map((trend) => {
            const achievementPct = trend.achievementRate;
            const actualWidthPct = Math.min(achievementPct, 100);

            return (
              <div key={trend.period}>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-semibold text-[#111827]">
                    {trend.period}
                  </span>
                  <span className="text-slate-600">
                    <strong className="text-[#111827]">
                      {formatNumber(trend.actual)}
                    </strong>{" "}
                    / {formatNumber(trend.target)} ({trend.achievementRate}%)
                  </span>
                </div>
                {/* Target bar (light background) with Actual bar overlaid */}
                <div className="relative h-7 w-full rounded-lg bg-slate-200 overflow-hidden">
                  {/* Actual output bar */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-lg transition-all ${
                      achievementPct >= 100
                        ? "bg-[#10B981]"
                        : achievementPct >= 90
                          ? "bg-[#1E3A8A]"
                          : "bg-[#F59E0B]"
                    }`}
                    style={{ width: `${Math.max(actualWidthPct, 3)}%` }}
                  />
                  {/* Percentage label */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-slate-700">
                    {achievementPct}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shift Comparison */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="text-base font-semibold text-[#111827] mb-1">
            Shift Comparison
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Production distribution by shift
          </p>

          <div className="space-y-4">
            {data.shiftComparison.map((shift) => (
              <div key={shift.shift}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#111827]">
                    {shift.shift}
                  </span>
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {shift.percentage}%
                  </span>
                </div>
                <div className="h-6 w-full rounded-lg bg-[#F3F4F6] overflow-hidden">
                  <div
                    className={`h-full rounded-lg flex items-center justify-end pr-2 text-xs font-semibold text-white ${
                      shift.percentage >= 100
                        ? "bg-[#10B981]"
                        : shift.percentage >= 90
                          ? "bg-[#1E3A8A]"
                          : "bg-[#F59E0B]"
                    }`}
                    style={{
                      width: `${Math.max(shift.percentage, 10)}%`,
                    }}
                  >
                    {formatNumber(shift.production)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="text-base font-semibold text-[#111827] mb-1">
            Team Performance
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Achievement rates by team
          </p>

          <div className="space-y-4">
            {data.teamPerformance.map((team) => (
              <div key={team.teamName}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#111827]">
                    {team.teamName}
                  </span>
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {team.achievementRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-6 w-full rounded-lg bg-[#F3F4F6] overflow-hidden">
                  <div
                    className={`h-full rounded-lg flex items-center justify-end pr-2 text-xs font-semibold text-white ${
                      team.achievementRate >= 100
                        ? "bg-[#10B981]"
                        : team.achievementRate >= 90
                          ? "bg-[#1E3A8A]"
                          : "bg-[#F59E0B]"
                    }`}
                    style={{
                      width: `${Math.max(team.achievementRate, 10)}%`,
                    }}
                  >
                    {formatNumber(team.output)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#111827]">
                Available Reports
              </h3>
              <p className="text-xs text-slate-500">
                Download production reports in PDF or Excel
              </p>
            </div>

            <div className="flex gap-2">
              {(["All", "Daily", "Weekly", "Monthly"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filterType === type
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-[#F3F4F6] text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-[#F3F4F6]/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    report.format === "PDF"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-[#10B981]/20 text-[#10B981]"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">
                    {report.title}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{report.fileSize}</span>
                    <span>•</span>
                    <span
                      className={`rounded px-2 py-0.5 font-semibold ${
                        report.type === "Daily"
                          ? "bg-[#F59E0B]/20 text-[#92400E]"
                          : report.type === "Weekly"
                            ? "bg-[#1E3A8A]/10 text-[#1E3A8A]"
                            : "bg-[#10B981]/10 text-[#10B981]"
                      }`}
                    >
                      {report.type}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleDownload(report)}
                disabled={downloading === report.id}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-60"
              >
                {downloading === report.id ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                    Download {report.format}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
