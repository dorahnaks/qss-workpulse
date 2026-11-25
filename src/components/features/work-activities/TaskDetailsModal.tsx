"use client";

import { useState } from "react";
import type { ClientTaskRequest } from "@/types/task-requests";

interface TaskDetailsModalProps {
  task: ClientTaskRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Assigned to Team":
      return "bg-[#1E3A8A] text-white";
    case "In Progress":
      return "bg-[#10B981] text-white";
    default:
      return "bg-[#F59E0B] text-white";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Urgent":
      return "bg-rose-600 text-white";
    case "High":
      return "bg-orange-600 text-white";
    case "Medium":
      return "bg-blue-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}

// Mock work progress data - in production this comes from backend
function generateMockProgress(taskId: string) {
  return [
    {
      date: "2024-01-15",
      shift: "Morning",
      workersPresent: 8,
      unitsCompleted: 400,
      notes: "Good progress, all equipment operational",
      supervisor: "David Mwangi",
    },
    {
      date: "2024-01-15",
      shift: "Afternoon",
      workersPresent: 8,
      unitsCompleted: 350,
      notes: "Slight delay due to material shortage, resolved by 16:00",
      supervisor: "Sarah Ochieng",
    },
    {
      date: "2024-01-16",
      shift: "Morning",
      workersPresent: 7,
      unitsCompleted: 380,
      notes: "One worker on leave, compensated with overtime",
      supervisor: "David Mwangi",
    },
  ];
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
}: TaskDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "team">(
    "overview"
  );

  if (!isOpen || !task) return null;

  const workProgress = task.status !== "Pending Admin Review" 
    ? generateMockProgress(task.id) 
    : [];
  
  const totalCompleted = workProgress.reduce(
    (sum, entry) => sum + entry.unitsCompleted,
    0
  );
  const completionRate = task.targetOutput > 0 
    ? Math.round((totalCompleted / task.targetOutput) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority} Priority
                </span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">
                {task.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Reference: {task.referenceCode}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Close details"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "overview"
                  ? "border-[#1E3A8A] text-[#1E3A8A]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Overview
            </button>
            {task.status !== "Pending Admin Review" && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab("progress")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === "progress"
                      ? "border-[#1E3A8A] text-[#1E3A8A]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Work Progress
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === "team"
                      ? "border-[#1E3A8A] text-[#1E3A8A]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Team Details
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-[#111827] mb-2">
                  Task Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Target Output
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {formatNumber(task.targetOutput)} {task.unitLabel}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Estimated Workers
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.estimatedWorkers} workers
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Due Date
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Preferred Shift
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.preferredShift}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Site Location
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.siteLocation}
                    </p>
                  </div>

                  {task.assignedTeam && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Assigned Team
                      </p>
                      <p className="text-base font-semibold text-[#1E3A8A]">
                        {task.assignedTeam}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Requested By
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.requestedBy}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Created On
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Summary (if in progress) */}
              {task.status !== "Pending Admin Review" && (
                <div className="rounded-xl border-2 border-[#1E3A8A]/20 bg-[#1E3A8A]/5 p-6">
                  <h3 className="text-base font-semibold text-[#111827] mb-4">
                    Progress Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-[#10B981]">
                        {formatNumber(totalCompleted)}
                      </p>
                      <p className="text-xs text-slate-500">{task.unitLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Remaining
                      </p>
                      <p className="text-2xl font-bold text-[#F59E0B]">
                        {formatNumber(task.targetOutput - totalCompleted)}
                      </p>
                      <p className="text-xs text-slate-500">{task.unitLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Completion Rate
                      </p>
                      <p className="text-2xl font-bold text-[#1E3A8A]">
                        {completionRate}%
                      </p>
                      <p className="text-xs text-slate-500">of target</p>
                    </div>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] transition-all"
                      style={{ width: `${Math.min(completionRate, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#111827] mb-4">
                Daily Work Progress
              </h3>

              {workProgress.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No work progress recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workProgress.map((entry, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-[#111827]">
                              {entry.date}
                            </h4>
                            <span className="text-xs font-semibold text-slate-500">
                              {entry.shift} Shift
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Supervisor: {entry.supervisor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#10B981]">
                            {formatNumber(entry.unitsCompleted)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {task.unitLabel}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500">Workers Present</p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {entry.workersPresent}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Output per Worker</p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {Math.round(entry.unitsCompleted / entry.workersPresent)} {task.unitLabel}
                          </p>
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-600 mb-1">
                            Notes:
                          </p>
                          <p className="text-sm text-slate-700">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "team" && task.assignedTeam && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#1E3A8A]/30 bg-[#1E3A8A]/10 p-6">
                <h3 className="text-base font-semibold text-[#111827] mb-4">
                  Assigned Team: {task.assignedTeam}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Team Leader
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      David Mwangi
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Total Workers
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.estimatedWorkers} workers
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Shift Schedule
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.preferredShift}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Work Site
                    </p>
                    <p className="text-base font-semibold text-[#111827]">
                      {task.siteLocation}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-3">
                  Team Members
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: task.estimatedWorkers }, (_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 bg-white p-3 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm">
                        W{i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          Worker {i + 1}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: QSS-{String(1000 + i).padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#1E3A8A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A8A]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
