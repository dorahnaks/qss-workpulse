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
} from "@/lib/utils/format";
import { getShiftPerformance } from "@/services/performance";
import type { ShiftPerformanceData, ShiftStatus } from "@/types/performance";

interface ShiftPerformanceViewProps {
  initialData: ShiftPerformanceData;
}

const SHIFT_STATUS_META: Record<
  ShiftStatus,
  { label: string; variant: BadgeVariant }
> = {
  completed: { label: "Completed", variant: "success" },
  active: { label: "Active Now", variant: "info" },
  scheduled: { label: "Scheduled", variant: "neutral" },
};

export function ShiftPerformanceView({
  initialData,
}: ShiftPerformanceViewProps) {
  const [data, setData] = useState<ShiftPerformanceData>(initialData);
  const [selectedDate, setSelectedDate] = useState<string>(initialData.date);
  const [statusFilter, setStatusFilter] = useState<"all" | ShiftStatus>("all");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDateChange(nextDate: string) {
    if (!nextDate) return;
    setSelectedDate(nextDate);
    setIsLoading(true);
    try {
      const updated = await getShiftPerformance(nextDate);
      setData(updated);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredShifts = useMemo(() => {
    if (statusFilter === "all") return data.shifts;
    return data.shifts.filter((shift) => shift.status === statusFilter);
  }, [data.shifts, statusFilter]);

  const { summary } = data;

  return (
    <div className="space-y-8">
      <PortalPageHeader
        eyebrow="Shift Performance"
        title="Shift-by-Shift Production Monitoring"
        description="Monitor output, allocated targets, responsible supervisors, and pending work across Morning, Afternoon, and Night shifts."
        clientName={data.clientName}
        isLiveData={data.isLiveData}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="shift-date-picker">
              Select Date
            </label>
            <input
              id="shift-date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | ShiftStatus)
              }
              aria-label="Filter by shift status"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Shift Statuses</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        }
      />

      {/* KPI Summary */}
      <section
        aria-label="Shift summary metrics"
        className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${
          isLoading ? "opacity-60 transition-opacity" : ""
        }`}
      >
        <StatCard
          label="Total Shift Output"
          value={formatNumber(summary.totalProduced)}
          helper={`of ${formatNumber(summary.totalTarget)} ${summary.unit} allocated · ${formatDateDisplay(data.date)}`}
          accent="indigo"
        />
        <StatCard
          label="Combined Achievement"
          value={formatPercent(summary.overallAchievementRate, 1)}
          helper={`${formatNumber(summary.totalPending)} ${summary.unit} remaining`}
          accent="emerald"
        />
        <StatCard
          label="Workers Across Shifts"
          value={formatNumber(summary.totalWorkersDeployed)}
          helper={`${summary.completedShifts} completed · ${summary.activeShifts} active · ${summary.scheduledShifts} scheduled`}
        />
        <StatCard
          label="Leading Shift"
          value={summary.topShiftLabel}
          helper="Highest target achievement today"
          accent="amber"
        />
      </section>

      {/* Shift Cards */}
      <section className="grid gap-5 lg:grid-cols-3">
        {filteredShifts.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No shifts match the selected status filter.
          </div>
        ) : (
          filteredShifts.map((shift) => {
            const statusMeta = SHIFT_STATUS_META[shift.status];
            return (
              <article
                key={shift.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {shift.label}
                      </h2>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">
                        {shift.startTime} – {shift.endTime}
                      </p>
                    </div>
                    <Badge variant={statusMeta.variant} dot>
                      {statusMeta.label}
                    </Badge>
                  </div>

                  {/* Accountability */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                    <div>
                      <p className="text-slate-500">Assigned Team</p>
                      <p className="mt-0.5 font-semibold text-slate-900">
                        {shift.teamName}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Supervisor</p>
                      <p className="mt-0.5 font-semibold text-slate-900">
                        {shift.supervisorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Workers Deployed</p>
                      <p className="mt-0.5 font-mono font-semibold text-slate-900">
                        {shift.workersDeployed} workers
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Submission</p>
                      <p className="mt-0.5 font-medium text-slate-700">
                        {shift.submittedAt ?? "Pending start"}
                      </p>
                    </div>
                  </div>

                  {/* Target vs Actual */}
                  <div className="mt-5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-medium text-slate-600">
                        Shift Target Progress
                      </span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatPercent(shift.achievementRate, 1)}
                      </span>
                    </div>
                    <ProgressBar
                      value={shift.actualProduced}
                      max={shift.allocatedTarget}
                      className="mt-2"
                    />
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <p className="text-[11px] text-slate-500">Target</p>
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {formatNumber(shift.allocatedTarget)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-indigo-50/70 px-2 py-2">
                        <p className="text-[11px] text-indigo-700">Produced</p>
                        <p className="font-mono text-sm font-semibold text-indigo-900">
                          {formatNumber(shift.actualProduced)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-amber-50/70 px-2 py-2">
                        <p className="text-[11px] text-amber-700">Pending</p>
                        <p className="font-mono text-sm font-semibold text-amber-900">
                          {formatNumber(shift.pendingWork)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shift Activities */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Shift Activities
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {shift.activities.map((act) => (
                        <li
                          key={act.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-700">{act.name}</span>
                          <span className="font-mono text-slate-900">
                            {formatNumber(act.completed)} /{" "}
                            {formatNumber(act.target)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Remarks */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Supervisor Remarks
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {shift.remarks}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Shift Comparison Chart */}
      <ComparisonBarChart
        title="Shift Output Comparison"
        subtitle="Allocated shift targets vs actual production output per shift"
        unit={summary.unit}
        items={data.shifts.map((shift) => ({
          id: shift.id,
          label: shift.label,
          sublabel: `${shift.teamName} · ${shift.supervisorName}`,
          target: shift.allocatedTarget,
          actual: shift.actualProduced,
        }))}
      />
    </div>
  );
}
