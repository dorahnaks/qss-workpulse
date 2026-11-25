"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { getWorkActivities } from "@/services/work-activities.service";
import type { WorkActivitiesData, WorkActivity } from "@/types/work-activities";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: WorkActivity["status"]): string {
  switch (status) {
    case "Completed":
      return "bg-[#10B981]/10 text-[#10B981] ring-1 ring-[#10B981]/20";
    case "In Progress":
      return "bg-[#1E3A8A]/10 text-[#1E3A8A] ring-1 ring-[#1E3A8A]/20";
    case "Pending":
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
    default:
      return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }
}

function getPriorityColor(priority: WorkActivity["priority"]): string {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    case "Medium":
      return "bg-[#F59E0B]/20 text-[#92400E] ring-1 ring-[#F59E0B]/50";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

export function WorkActivitiesView() {
  const [data, setData] = useState<WorkActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | WorkActivity["status"]
  >("All");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWorkActivities();
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

  const filteredActivities = useMemo(() => {
    if (!data) return [];
    const query = searchQuery.trim().toLowerCase();
    return data.activities.filter((activity) => {
      if (statusFilter !== "All" && activity.status !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        activity.activityName.toLowerCase().includes(query) ||
        activity.assignedTeam.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, statusFilter]);

  const summaryText = data
    ? `Work activities summary. Total activities: ${data.summary.totalActivities}. Completed: ${data.summary.completed}. In progress: ${data.summary.inProgress}. Pending: ${data.summary.pending}. Overdue: ${data.summary.overdue}.`
    : "";

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white border border-[#E5E7EB]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p className="font-semibold">Failed to load work activities data.</p>
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
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Work Activities & Progress
            </h2>
            <p className="text-sm text-slate-500">
              Track assigned work and completion status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-2 py-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-44 bg-transparent px-1.5 py-1 text-xs text-[#111827] placeholder:text-slate-400 focus:outline-none sm:w-52"
            />
            <DictateButton
              ariaLabel="Dictate activity search"
              onResult={(spoken) => setSearchQuery(spoken)}
            />
          </div>
          <ReadAloudButton
            text={summaryText}
            size="md"
            ariaLabel="Read activities summary"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {data.summary.totalActivities}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-[#10B981]">Completed</p>
          <p className="mt-3 text-3xl font-semibold text-[#10B981]">
            {data.summary.completed}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-[#1E3A8A]">In Progress</p>
          <p className="mt-3 text-3xl font-semibold text-[#1E3A8A]">
            {data.summary.inProgress}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-[#111827]">
            {data.summary.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs font-semibold text-rose-600">Overdue</p>
          <p className="mt-3 text-3xl font-semibold text-rose-600">
            {data.summary.overdue}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Completed", "In Progress", "Pending", "Overdue"] as const).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-[#F3F4F6] text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Activities Table */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <p>No activities match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="mt-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 font-semibold text-[#1E3A8A] hover:bg-[#F3F4F6] transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#E5E7EB] text-left text-xs">
              <thead className="bg-[#F3F4F6] text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Activity</th>
                  <th className="px-6 py-3 font-semibold">Team</th>
                  <th className="px-6 py-3 font-semibold">Priority</th>
                  <th className="px-6 py-3 font-semibold">Expected</th>
                  <th className="px-6 py-3 font-semibold">Completed</th>
                  <th className="px-6 py-3 font-semibold">Pending</th>
                  <th className="px-6 py-3 font-semibold">Progress</th>
                  <th className="px-6 py-3 font-semibold">Due Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white">
                {filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-[#F3F4F6]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#111827]">
                        {activity.activityName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {activity.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {activity.assignedTeam}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityColor(
                          activity.priority
                        )}`}
                      >
                        {activity.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatNumber(activity.expectedQuantity)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#111827]">
                      {formatNumber(activity.completedQuantity)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatNumber(activity.pendingQuantity)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#F3F4F6]">
                          <div
                            className={`h-full rounded-full ${
                              activity.completionRate >= 100
                                ? "bg-[#10B981]"
                                : activity.completionRate >= 70
                                  ? "bg-[#1E3A8A]"
                                  : "bg-[#F59E0B]"
                            }`}
                            style={{
                              width: `${Math.min(activity.completionRate, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">
                          {activity.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(activity.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
