"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardOverview } from "@/services/dashboard.service";
import { getNotifications } from "@/services/notifications.service";
import type { DashboardRange, DashboardSummary } from "@/types/dashboard";
import type { NotificationItem } from "@/types/notifications";

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Exceeding":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "On Track":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";
    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }
}

export function DashboardOverview() {
  const { user, company } = useAuth();
  const [range, setRange] = useState<DashboardRange>("today");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (selectedRange: DashboardRange) => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, notificationsData] = await Promise.all([
        getDashboardOverview(selectedRange),
        getNotifications(),
      ]);
      setSummary(dashboardData);
      setRecentUpdates(notificationsData.slice(0, 4));
    } catch {
      setError("Failed to load dashboard overview. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getDashboardOverview(range), getNotifications()])
      .then(([dashboardData, notificationsData]) => {
        if (!active) return;
        setSummary(dashboardData);
        setRecentUpdates(notificationsData.slice(0, 4));
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load dashboard overview. Please refresh.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [range]);

  const handleRangeChange = (nextRange: DashboardRange) => {
    setLoading(true);
    setRange(nextRange);
  };

  const firstName = user?.name.split(" ")[0] ?? "Client";

  if (loading && !summary) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 rounded-2xl bg-white border border-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-white border border-slate-200"
            />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-white border border-slate-200" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">{error ?? "No dashboard data available."}</p>
        <button
          type="button"
          onClick={() => void fetchDashboard(range)}
          className="mt-3 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const attendancePct = Math.round(
    (summary.deployedWorkers / Math.max(summary.scheduledWorkers, 1)) * 100
  );
  const maxSeriesValue = Math.max(
    ...summary.outputSeries.flatMap((point) => [point.target, point.actual]),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Greeting & Period Selector */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {company?.name ?? "QSS Client Operations"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Live overview of deployed workers, active teams, production targets,
            and actual output · {summary.lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRangeChange(option.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === option.value
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void fetchDashboard(range)}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Deployed Workers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Deployed Workers
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {attendancePct}% attendance
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {summary.deployedWorkers}
            <span className="ml-1 text-sm font-normal text-slate-400">
              / {summary.scheduledWorkers}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Active on site across scheduled shifts
          </p>
        </div>

        {/* Active Teams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Active Teams</p>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
              {summary.activeShiftsCount} shifts
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {summary.activeTeamsCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Supervised QSS teams delivering work
          </p>
        </div>

        {/* Production Target vs Actual Output */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Actual vs. Target Output
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {formatNumber(summary.pendingOutput)} pending
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {formatNumber(summary.actualOutput)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Target: {formatNumber(summary.productionTarget)} units
          </p>
        </div>

        {/* Target Achievement Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Target Achievement
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {summary.achievementDelta}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {summary.achievementRate.toFixed(1)}%
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${Math.min(summary.achievementRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Output Comparison Chart + Recent Updates */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Production Targets vs Actual Output Bars */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Production Target vs. Actual Output
              </h3>
              <p className="text-xs text-slate-500">
                Comparison across {range === "today" ? "shifts" : range === "week" ? "days" : "weeks"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-slate-300" />
                Target
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600" />
                Actual
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {summary.outputSeries.map((point) => {
              const targetWidth = Math.round(
                (point.target / maxSeriesValue) * 100
              );
              const actualWidth = Math.round(
                (point.actual / maxSeriesValue) * 100
              );
              const pct = Math.round(
                (point.actual / Math.max(point.target, 1)) * 100
              );

              return (
                <div key={point.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {point.label}
                    </span>
                    <span className="text-slate-600">
                      <strong className="text-slate-900">
                        {formatNumber(point.actual)}
                      </strong>{" "}
                      / {formatNumber(point.target)} units ({pct}%)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-300 transition-all"
                        style={{ width: `${targetWidth}%` }}
                      />
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          pct >= 100
                            ? "bg-emerald-500"
                            : pct >= 90
                              ? "bg-indigo-600"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${actualWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Production & Shift Notifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Recent Updates
                </h3>
                <p className="text-xs text-slate-500">
                  Latest shift and production alerts
                </p>
              </div>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {recentUpdates.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                      )}
                      <p className="text-xs font-semibold text-slate-900">
                        {item.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {item.relativeTime}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Active Teams Output Table */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Active Teams Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Deployed headcount, agreed target, and actual output per team
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing {summary.teams.length} active teams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Team & Supervisor</th>
                <th className="px-6 py-3 font-semibold">Shift</th>
                <th className="px-6 py-3 font-semibold">Workers</th>
                <th className="px-6 py-3 font-semibold">Target</th>
                <th className="px-6 py-3 font-semibold">Actual</th>
                <th className="px-6 py-3 font-semibold">Pending</th>
                <th className="px-6 py-3 font-semibold">Achievement</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {summary.teams.map((team) => {
                const pct = Math.round(
                  (team.actualUnits / Math.max(team.targetUnits, 1)) * 100
                );
                return (
                  <tr key={team.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900">{team.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Sup: {team.supervisor}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{team.shift}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-800">
                      {team.deployedWorkers} / {team.scheduledWorkers}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {formatNumber(team.targetUnits)}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {formatNumber(team.actualUnits)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {formatNumber(team.pendingUnits)}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 100
                                ? "bg-emerald-500"
                                : pct >= 90
                                  ? "bg-indigo-600"
                                  : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-700">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(
                          team.status
                        )}`}
                      >
                        {team.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
