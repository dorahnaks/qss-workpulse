"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { getDailyPerformance } from "@/services/daily-performance.service";
import type { DailyPerformanceSummary } from "@/types/daily-performance";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Exceeding":
      return "bg-[#10B981]/10 text-[#10B981] ring-1 ring-[#10B981]/20";
    case "On Track":
      return "bg-[#1E3A8A]/10 text-[#1E3A8A] ring-1 ring-[#1E3A8A]/20";
    default:
      return "bg-[#F59E0B]/20 text-[#92400E] ring-1 ring-[#F59E0B]/50";
  }
}

export function DailyPerformanceView() {
  const [data, setData] = useState<DailyPerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDailyPerformance(selectedDate);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const summaryText = data
    ? `Daily performance summary for ${data.date}. Total target: ${formatNumber(data.totalTarget)} units. Actual output: ${formatNumber(data.totalActual)} units. Achievement rate: ${data.achievementRate.toFixed(1)}%. Pending work: ${formatNumber(data.totalPending)} units. Completed activities: ${data.completedActivities} out of ${data.totalActivities}.`
    : "";

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">Failed to load daily performance data.</p>
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

  return (
    <div className="space-y-6">
      {/* Header with Date Picker */}
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
              <path d="M3 3v18h18" />
              <path d="m7 14 4-4 3 3 5-6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Daily Performance Overview
            </h2>
            <p className="text-sm text-slate-500">
              Track expected vs actual output
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-3 py-2 text-sm text-[#111827] transition-colors hover:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
          />
          <ReadAloudButton text={summaryText} size="md" ariaLabel="Read daily summary" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Target Output</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {formatNumber(data.totalTarget)}
          </p>
          <p className="mt-2 text-xs text-slate-500">units expected today</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Actual Output</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {formatNumber(data.totalActual)}
          </p>
          <p className="mt-2 text-xs text-slate-500">units produced today</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Achievement Rate</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {data.achievementRate.toFixed(1)}%
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
            <div
              className={`h-full rounded-full transition-all ${
                data.achievementRate >= 100
                  ? "bg-[#10B981]"
                  : data.achievementRate >= 90
                    ? "bg-[#1E3A8A]"
                    : "bg-[#F59E0B]"
              }`}
              style={{ width: `${Math.min(data.achievementRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Pending Work</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {formatNumber(data.totalPending)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {data.completedActivities}/{data.totalActivities} activities done
          </p>
        </div>
      </div>

      {/* Shift Breakdown */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h3 className="text-base font-semibold text-[#111827]">
            Performance by Shift
          </h3>
          <p className="text-xs text-slate-500">
            Breakdown of output across morning, afternoon, and night shifts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB] text-left text-xs">
            <thead className="bg-[#F3F4F6] text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Shift</th>
                <th className="px-6 py-3 font-semibold">Target</th>
                <th className="px-6 py-3 font-semibold">Actual</th>
                <th className="px-6 py-3 font-semibold">Pending</th>
                <th className="px-6 py-3 font-semibold">Achievement</th>
                <th className="px-6 py-3 font-semibold">Activities</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] bg-white">
              {data.records.map((record) => {
                const pct = record.achievementRate;
                return (
                  <tr key={record.id} className="hover:bg-[#F3F4F6]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            record.shift === "Morning"
                              ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                              : record.shift === "Afternoon"
                                ? "bg-[#1E3A8A]/20 text-[#1E3A8A]"
                                : "bg-[#111827]/20 text-[#111827]"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                        </div>
                        <span className="font-semibold text-[#111827]">
                          {record.shift}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatNumber(record.targetOutput)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#111827]">
                      {formatNumber(record.actualOutput)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatNumber(record.pendingWork)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#F3F4F6]">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 100
                                ? "bg-[#10B981]"
                                : pct >= 90
                                  ? "bg-[#1E3A8A]"
                                  : "bg-[#F59E0B]"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.completedActivities}/{record.totalActivities}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
