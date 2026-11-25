"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { getShiftPerformance } from "@/services/shift-performance.service";
import type { ShiftPerformanceData } from "@/types/shift-performance";

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

export function ShiftPerformanceView() {
  const [data, setData] = useState<ShiftPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getShiftPerformance(selectedDate);
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
    ? `Shift performance for ${data.date}. ${data.shifts.length} shifts operating. ${data.comparison.map((s) => `${s.shift} shift: ${formatNumber(s.production)} units produced, ${s.achievementRate.toFixed(1)}% achievement rate.`).join(" ")}`
    : "";

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">Failed to load shift performance data.</p>
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

  const maxProduction = Math.max(...data.comparison.map((s) => s.production));

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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Shift Performance Analysis
            </h2>
            <p className="text-sm text-slate-500">
              Compare production across all shifts
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
          <ReadAloudButton text={summaryText} size="md" ariaLabel="Read shift summary" />
        </div>
      </div>

      {/* Shift Comparison Chart */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h3 className="text-base font-semibold text-[#111827] mb-1">
          Shift Production Comparison
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Visual comparison of output across shifts
        </p>

        <div className="space-y-5">
          {data.comparison.map((shift) => {
            const widthPct = Math.round((shift.production / maxProduction) * 100);
            const achievementPct = shift.achievementRate;

            return (
              <div key={shift.shift}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111827]">
                      {shift.shift}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({shift.workersDeployed} workers)
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">
                    <strong className="text-[#111827]">
                      {formatNumber(shift.production)}
                    </strong>{" "}
                    / {formatNumber(shift.target)} ({achievementPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-8 w-full rounded-lg bg-[#F3F4F6] overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all flex items-center justify-end pr-3 text-xs font-semibold ${
                      achievementPct >= 100
                        ? "bg-[#10B981] text-white"
                        : achievementPct >= 90
                          ? "bg-[#1E3A8A] text-white"
                          : "bg-[#F59E0B] text-white"
                    }`}
                    style={{ width: `${Math.max(widthPct, 10)}%` }}
                  >
                    {achievementPct.toFixed(0)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Details Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {data.shifts.map((shift) => {
          const shiftColor =
            shift.shift === "Morning"
              ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
              : shift.shift === "Afternoon"
                ? "bg-[#1E3A8A]/20 text-[#1E3A8A] border-[#1E3A8A]/30"
                : "bg-[#111827]/20 text-[#111827] border-[#111827]/30";

          return (
            <div
              key={shift.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg px-3 py-1.5 border ${shiftColor} text-xs font-semibold`}>
                  {shift.shift} Shift
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(
                    shift.status
                  )}`}
                >
                  {shift.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-[#111827]">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Supervisor</span>
                  <span className="font-semibold text-[#111827]">
                    {shift.supervisor}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Teams</span>
                  <span className="font-semibold text-[#111827]">
                    {shift.teamsAssigned}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Workers</span>
                  <span className="font-semibold text-[#111827]">
                    {shift.workersDeployed}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Target</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {formatNumber(shift.targetOutput)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Actual</span>
                  <span className="text-lg font-bold text-[#111827]">
                    {formatNumber(shift.actualOutput)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Achievement</span>
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {shift.achievementRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className={`h-full rounded-full transition-all ${
                    shift.achievementRate >= 100
                      ? "bg-[#10B981]"
                      : shift.achievementRate >= 90
                        ? "bg-[#1E3A8A]"
                        : "bg-[#F59E0B]"
                  }`}
                  style={{
                    width: `${Math.min(shift.achievementRate, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
