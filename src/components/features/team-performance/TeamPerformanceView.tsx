"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { getTeamPerformance } from "@/services/team-performance.service";
import type { TeamPerformanceData } from "@/types/team-performance";

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

export function TeamPerformanceView() {
  const [data, setData] = useState<TeamPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTeamPerformance();
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

  const filteredTeams = useMemo(() => {
    if (!data) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data.teams;
    return data.teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(query) ||
        team.supervisor.toLowerCase().includes(query) ||
        team.shift.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const teamHistory = useMemo(() => {
    if (!selectedTeam || !data) return null;
    return data.productivityHistory.find((h) => h.teamId === selectedTeam);
  }, [selectedTeam, data]);

  const summaryText = data
    ? `Team performance overview. ${data.teams.length} teams deployed. Total workers: ${data.teams.reduce((sum, t) => sum + t.workersDeployed, 0)}. ${filteredTeams.map((t) => `${t.teamName}: ${formatNumber(t.actualOutput)} units, ${t.achievementRate.toFixed(1)}% achievement rate.`).join(" ")}`
    : "";

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">Failed to load team performance data.</p>
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

  const totalWorkers = data.teams.reduce((sum, t) => sum + t.workersDeployed, 0);
  const totalOutput = data.teams.reduce((sum, t) => sum + t.actualOutput, 0);
  const totalTarget = data.teams.reduce((sum, t) => sum + t.targetOutput, 0);
  const avgAchievement =
    data.teams.reduce((sum, t) => sum + t.achievementRate, 0) / data.teams.length;

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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Team Performance Tracking
            </h2>
            <p className="text-sm text-slate-500">
              Compare productivity across all teams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-2 py-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="w-44 bg-transparent px-1.5 py-1 text-xs text-[#111827] placeholder:text-slate-400 focus:outline-none sm:w-52"
            />
            <DictateButton
              ariaLabel="Dictate team search"
              onResult={(spoken) => setSearchQuery(spoken)}
            />
          </div>
          <ReadAloudButton text={summaryText} size="md" ariaLabel="Read team summary" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Teams</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {data.teams.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Workers</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {totalWorkers}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Output</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {formatNumber(totalOutput)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Target: {formatNumber(totalTarget)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Avg Achievement</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {avgAchievement.toFixed(1)}%
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
            <div
              className={`h-full rounded-full transition-all ${
                avgAchievement >= 100
                  ? "bg-[#10B981]"
                  : avgAchievement >= 90
                    ? "bg-[#1E3A8A]"
                    : "bg-[#F59E0B]"
              }`}
              style={{ width: `${Math.min(avgAchievement, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-sm text-slate-500">No teams match your search.</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-[#F3F4F6] transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTeam(team.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#111827]">
                  {team.teamName}
                </h3>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(
                    team.status
                  )}`}
                >
                  {team.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Supervisor</span>
                  <span className="font-semibold text-[#111827]">
                    {team.supervisor}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shift</span>
                  <span className="font-semibold text-[#111827]">{team.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Workers</span>
                  <span className="font-semibold text-[#111827]">
                    {team.workersDeployed} / {team.workersScheduled}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Target</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {formatNumber(team.targetOutput)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Actual</span>
                  <span className="text-lg font-bold text-[#111827]">
                    {formatNumber(team.actualOutput)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Achievement</span>
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {team.achievementRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className={`h-full rounded-full transition-all ${
                    team.achievementRate >= 100
                      ? "bg-[#10B981]"
                      : team.achievementRate >= 90
                        ? "bg-[#1E3A8A]"
                        : "bg-[#F59E0B]"
                  }`}
                  style={{
                    width: `${Math.min(team.achievementRate, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-[#1E3A8A] font-semibold">
                  Click to view history →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Team History Modal/Panel */}
      {selectedTeam && teamHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="max-w-2xl w-full rounded-2xl border border-[#E5E7EB] bg-white p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#111827]">
                {teamHistory.teamName} - Productivity History
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-lg p-2 hover:bg-[#F3F4F6] text-slate-500 hover:text-[#111827] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {teamHistory.history.map((record) => (
                <div
                  key={record.date}
                  className="rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#111827]">
                      {record.date}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        record.achievementRate >= 100
                          ? "text-[#10B981]"
                          : record.achievementRate >= 90
                            ? "text-[#1E3A8A]"
                            : "text-[#F59E0B]"
                      }`}
                    >
                      {record.achievementRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span>
                      Output: <strong>{formatNumber(record.output)}</strong>
                    </span>
                    <span>
                      Target: <strong>{formatNumber(record.target)}</strong>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full ${
                        record.achievementRate >= 100
                          ? "bg-[#10B981]"
                          : record.achievementRate >= 90
                            ? "bg-[#1E3A8A]"
                            : "bg-[#F59E0B]"
                      }`}
                      style={{
                        width: `${Math.min(record.achievementRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
