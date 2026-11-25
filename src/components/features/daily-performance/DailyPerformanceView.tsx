"use client";

import { useMemo, useState } from "react";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PortalPageHeader } from "@/components/ui/PortalPageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import {
  formatDateDisplay,
  formatNumber,
  formatPercent,
  formatShiftLabel,
} from "@/lib/utils/format";
import { getDailyPerformance } from "@/services/performance";
import type {
  DailyPerformanceData,
  ShiftType,
  WorkStatus,
} from "@/types/performance";

interface DailyPerformanceViewProps {
  initialData: DailyPerformanceData;
}

const STATUS_BADGE: Record<
  WorkStatus,
  { label: string; variant: BadgeVariant }
> = {
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In Progress", variant: "info" },
  pending: { label: "Pending", variant: "warning" },
};

export function DailyPerformanceView({
  initialData,
}: DailyPerformanceViewProps) {
  const [data, setData] = useState<DailyPerformanceData>(initialData);
  const [selectedDate, setSelectedDate] = useState<string>(initialData.date);
  const [statusFilter, setStatusFilter] = useState<"all" | WorkStatus>("all");
  const [shiftFilter, setShiftFilter] = useState<"all" | ShiftType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDateChange(nextDate: string) {
    if (!nextDate) return;
    setSelectedDate(nextDate);
    setIsLoading(true);
    try {
      const updated = await getDailyPerformance(nextDate);
      setData(updated);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return data.activities.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (shiftFilter !== "all" && item.shiftType !== shiftFilter) return false;
      if (query) {
        const haystack =
          `${item.activityName} ${item.category} ${item.teamName} ${item.supervisorName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [data.activities, searchQuery, shiftFilter, statusFilter]);

  const { summary } = data;
  const achievementVariant: BadgeVariant =
    summary.achievementRate >= 90
      ? "success"
      : summary.achievementRate >= 65
        ? "info"
        : "warning";

  return (
    <div className="space-y-8">
      <PortalPageHeader
        eyebrow="Daily Work Performance"
        title="Daily Production & Pending Work"
        description="Track completed work, outstanding tasks, and real-time progress against your agreed daily production target."
        clientName={data.clientName}
        isLiveData={data.isLiveData}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="daily-date-picker">
              Select Date
            </label>
            <input
              id="daily-date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleDateChange(initialData.date)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Today
            </button>
          </div>
        }
      />

      {/* KPI Summary */}
      <section
        aria-label="Daily performance summary"
        className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${
          isLoading ? "opacity-60 transition-opacity" : ""
        }`}
      >
        <StatCard
          label="Daily Target"
          value={formatNumber(summary.dailyTarget)}
          helper={`Agreed output (${summary.unit}) · ${formatDateDisplay(data.date)}`}
        />
        <StatCard
          label="Total Produced"
          value={formatNumber(summary.totalProduced)}
          helper={`${summary.completedActivities} of ${summary.totalActivities} activities completed`}
          accent="indigo"
        />
        <StatCard
          label="Target Achievement"
          value={formatPercent(summary.achievementRate, 1)}
          badge={
            <Badge variant={achievementVariant}>
              {summary.achievementRate >= 90
                ? "On Target"
                : summary.achievementRate >= 65
                  ? "In Progress"
                  : "Behind"}
            </Badge>
          }
          helper="Combined across all active shifts"
          accent="emerald"
        />
        <StatCard
          label="Remaining Work"
          value={formatNumber(summary.remainingWork)}
          helper={`${summary.workersDeployed} workers deployed today`}
          accent="amber"
        />
      </section>

      {/* Overall Target Progress Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Daily Target Completion
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              {formatNumber(summary.totalProduced)} {summary.unit} completed out
              of {formatNumber(summary.dailyTarget)} {summary.unit} target (
              {formatNumber(summary.remainingWork)} {summary.unit} remaining)
            </p>
          </div>
          <span className="font-mono text-sm font-semibold text-indigo-700">
            {formatPercent(summary.achievementRate, 1)} achieved
          </span>
        </div>

        <ProgressBar
          value={summary.totalProduced}
          max={summary.dailyTarget}
          className="mt-4"
        />
      </section>

      {/* 7-Day Production Trend */}
      <ComparisonBarChart
        title="7-Day Daily Production Trend"
        subtitle="Daily completed output compared against agreed daily targets"
        unit={summary.unit}
        items={data.trend.map((point) => ({
          id: point.date,
          label: point.label,
          sublabel: `${point.workersDeployed} workers`,
          target: point.target,
          actual: point.produced,
        }))}
      />

      {/* Activity Breakdown Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Completed & Pending Work by Activity
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Detailed breakdown of assigned tasks, responsible teams, and
              supervisor remarks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity, team, supervisor..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none sm:w-56"
            />
            <select
              value={shiftFilter}
              onChange={(e) =>
                setShiftFilter(e.target.value as "all" | ShiftType)
              }
              aria-label="Filter by shift"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning Shift</option>
              <option value="afternoon">Afternoon Shift</option>
              <option value="night">Night Shift</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | WorkStatus)
              }
              aria-label="Filter by status"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Work Activity</th>
                <th className="px-4 py-3.5">Team & Shift</th>
                <th className="px-4 py-3.5 text-right">Target</th>
                <th className="px-4 py-3.5 text-right">Completed</th>
                <th className="px-4 py-3.5 text-right">Pending</th>
                <th className="px-4 py-3.5">Progress</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5">Supervisor Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No work activities match your current filters.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item) => {
                  const statusMeta = STATUS_BADGE[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.activityName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.category} · Updated {item.updatedAt}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">
                          {item.teamName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatShiftLabel(item.shiftType)} ·{" "}
                          {item.supervisorName}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-slate-700">
                        {formatNumber(item.targetQuantity)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs font-semibold text-slate-900">
                        {formatNumber(item.completedQuantity)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-amber-700">
                        {formatNumber(item.pendingQuantity)}
                      </td>
                      <td className="w-36 px-4 py-4">
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={item.completedQuantity}
                            max={item.targetQuantity}
                            size="sm"
                          />
                          <span className="w-10 text-right font-mono text-xs text-slate-700">
                            {formatPercent(item.achievementRate, 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusMeta.variant} dot>
                          {statusMeta.label}
                        </Badge>
                      </td>
                      <td className="max-w-xs px-6 py-4 text-xs text-slate-600">
                        {item.remarks || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
