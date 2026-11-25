"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDashboardOverview } from "@/services/dashboard.service";
import { getNotifications } from "@/services/notifications.service";
import type {
  ActiveTeamSnapshot,
  DashboardRange,
  DashboardSummary,
} from "@/types/dashboard";
import type { NotificationItem } from "@/types/notifications";

type TeamStatusFilter = "all" | ActiveTeamSnapshot["status"];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusBadgeClass(status: ActiveTeamSnapshot["status"]): string {
  switch (status) {
    case "Exceeding":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "On Track":
      return "bg-[#0056A7]/10 text-[#0056A7] ring-1 ring-[#0056A7]/20";
    default:
      return "bg-[#F6BA16]/20 text-[#9A6900] ring-1 ring-[#F6BA16]/50";
  }
}

export function DashboardOverview() {
  const { user, company } = useAuth();
  const { t } = useLanguage();

  const [range, setRange] = useState<DashboardRange>("today");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string | null>(
    null
  );
  const [teamQuery, setTeamQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TeamStatusFilter>("all");
  const [error, setError] = useState<string | null>(null);

  const rangeOptions: { value: DashboardRange; label: string }[] = [
    { value: "today", label: t.dashboard.today },
    { value: "week", label: t.dashboard.week },
    { value: "month", label: t.dashboard.month },
  ];

  const fetchDashboard = useCallback(async (selectedRange: DashboardRange) => {
    setRefreshing(true);
    setError(null);
    try {
      const [dashboardData, notificationsData] = await Promise.all([
        getDashboardOverview(selectedRange),
        getNotifications(),
      ]);
      setSummary(dashboardData);
      setRecentUpdates(notificationsData.slice(0, 4));
      setLastRefreshedTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch {
      setError("Failed to load dashboard overview. Please refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    setRefreshing(true);
    setRange(nextRange);
  };

  const filteredTeams = useMemo(() => {
    if (!summary) return [];
    const normalized = teamQuery.trim().toLowerCase();
    return summary.teams.filter((team) => {
      if (statusFilter !== "all" && team.status !== statusFilter) {
        return false;
      }
      if (!normalized) return true;
      return (
        team.name.toLowerCase().includes(normalized) ||
        team.supervisor.toLowerCase().includes(normalized) ||
        team.shift.toLowerCase().includes(normalized)
      );
    });
  }, [summary, teamQuery, statusFilter]);

  const firstName = user?.name.split(" ")[0] ?? "Client";

  if (loading && !summary) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
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
          {t.common.refresh}
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

  const statusLabel = (status: ActiveTeamSnapshot["status"]) => {
    if (status === "Exceeding") return t.dashboard.exceeding;
    if (status === "On Track") return t.dashboard.onTrack;
    return t.dashboard.needsAttention;
  };

  return (
    <div className="space-y-6">
      {/* Greeting & Range Switcher */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className="absolute inset-y-0 left-0 w-1 bg-[#0056A7]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0056A7]">
              {company?.name ?? "Q-Sourcing Client Operations"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0B2D4D]">
              {t.dashboard.welcomeBack}, {firstName}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {t.dashboard.subtitle} ·{" "}
              {lastRefreshedTime
                ? `Synced at ${lastRefreshedTime}`
                : summary.lastUpdated}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-[#F7F8FA] p-1">
              {rangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRangeChange(option.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    range === option.value
                      ? "bg-[#0056A7] text-white shadow-2xs"
                      : "text-slate-600 hover:text-[#0B2D4D]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard(range)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-slate-50 disabled:opacity-60"
            >
              <svg
                className={`h-3.5 w-3.5 text-[#0056A7] ${
                  refreshing ? "animate-spin" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              {refreshing ? t.common.refreshing : t.common.refresh}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Deployed Workers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {t.dashboard.deployedWorkers}
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {attendancePct}% {t.dashboard.attendance}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0B2D4D]">
            {summary.deployedWorkers}
            <span className="ml-1 text-sm font-normal text-slate-400">
              / {summary.scheduledWorkers}
            </span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(attendancePct, 100)}%` }}
            />
          </div>
        </div>

        {/* Active Teams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {t.dashboard.activeTeams}
            </p>
            <span className="rounded-full bg-[#0056A7]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0056A7]">
              {summary.activeShiftsCount} {t.dashboard.shifts}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0B2D4D]">
            {summary.activeTeamsCount}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Q-Sourcing supervised teams active on site
          </p>
        </div>

        {/* Actual vs Target Output */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {t.dashboard.actualVsTarget}
            </p>
            <span className="rounded-full bg-[#F6BA16]/25 px-2 py-0.5 text-[11px] font-bold text-[#8A5D00]">
              {formatNumber(summary.pendingOutput)} {t.dashboard.pending}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0B2D4D]">
            {formatNumber(summary.actualOutput)}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            {t.dashboard.targetLabel}: {formatNumber(summary.productionTarget)}{" "}
            units
          </p>
        </div>

        {/* Target Achievement Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {t.dashboard.targetAchievement}
            </p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {summary.achievementDelta}
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0B2D4D]">
            {summary.achievementRate.toFixed(1)}%
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0056A7] transition-all"
              style={{ width: `${Math.min(summary.achievementRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Output Comparison Chart + Recent Updates */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-[#0B2D4D]">
                {t.dashboard.chartTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {range === "today"
                  ? "Shift-by-shift comparison"
                  : range === "week"
                    ? "Daily comparison"
                    : "Weekly comparison"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-slate-300" />
                {t.dashboard.targetLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#0056A7]" />
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
                    <span className="font-semibold text-[#0B2D4D]">
                      {point.label}
                    </span>
                    <span className="text-slate-600">
                      <strong className="text-[#0B2D4D]">
                        {formatNumber(point.actual)}
                      </strong>{" "}
                      / {formatNumber(point.target)} ({pct}%)
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
                              ? "bg-[#0056A7]"
                              : "bg-[#F6BA16]"
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

        {/* Recent Updates */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0B2D4D]">
                  {t.dashboard.recentUpdates}
                </h3>
                <p className="text-xs text-slate-500">
                  Shift & production updates
                </p>
              </div>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-[#0056A7] hover:text-[#004485]"
              >
                {t.dashboard.viewAll} &rarr;
              </Link>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {recentUpdates.map((item) => (
                <Link
                  key={item.id}
                  href="/notifications"
                  className="block rounded-lg py-3 transition-colors first:pt-0 last:pb-0 hover:bg-slate-50/70"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#F6BA16]" />
                      )}
                      <p className="text-xs font-semibold text-[#0B2D4D]">
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Active Teams Breakdown Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0B2D4D]">
              {t.dashboard.teamsTitle}
            </h3>
            <p className="text-xs text-slate-500">{t.dashboard.teamsSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: "all", label: t.dashboard.allStatuses },
                  { id: "Exceeding", label: t.dashboard.exceeding },
                  { id: "On Track", label: t.dashboard.onTrack },
                  { id: "Needs Attention", label: t.dashboard.needsAttention },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    statusFilter === pill.id
                      ? "bg-[#0056A7] text-white"
                      : "bg-[#F7F8FA] text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search + Voice Dictate */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F7F8FA] px-2 py-1">
              <input
                type="search"
                value={teamQuery}
                onChange={(e) => setTeamQuery(e.target.value)}
                placeholder={t.dashboard.searchTeamsPlaceholder}
                className="w-44 bg-transparent px-1.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:w-52"
              />
              <DictateButton
                ariaLabel="Dictate team search"
                onResult={(spoken) => setTeamQuery(spoken)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTeams.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <p>{t.dashboard.noTeamsMatch}</p>
              <button
                type="button"
                onClick={() => {
                  setTeamQuery("");
                  setStatusFilter("all");
                }}
                className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#0056A7] hover:bg-slate-50"
              >
                {t.common.reset}
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-[#F7F8FA] text-[11px] uppercase tracking-wider text-slate-500">
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
                {filteredTeams.map((team) => {
                  const pct = Math.round(
                    (team.actualUnits / Math.max(team.targetUnits, 1)) * 100
                  );
                  return (
                    <tr key={team.id} className="hover:bg-[#F7F8FA]/80">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-[#0B2D4D]">
                          {team.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Sup: {team.supervisor}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {team.shift}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {team.deployedWorkers} / {team.scheduledWorkers}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {formatNumber(team.targetUnits)}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-[#0B2D4D]">
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
                                    ? "bg-[#0056A7]"
                                    : "bg-[#F6BA16]"
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700">
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
                          {statusLabel(team.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
