"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadAloudButton } from "@/components/ui/ReadAloudButton";
import { CreateTaskRequestModal } from "./CreateTaskRequestModal";
import { TaskDetailsModal } from "./TaskDetailsModal";
import {
  getTaskRequests,
  createTaskRequest,
  deleteTaskRequest,
} from "@/services/task-requests.service";
import type {
  ClientTaskRequest,
  CreateTaskRequestPayload,
} from "@/types/task-requests";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Assigned to Team":
      return "bg-[#1E3A8A]/10 text-[#1E3A8A] ring-1 ring-[#1E3A8A]/20";
    case "In Progress":
      return "bg-[#10B981]/10 text-[#10B981] ring-1 ring-[#10B981]/20";
    default:
      return "bg-[#F59E0B]/20 text-[#92400E] ring-1 ring-[#F59E0B]/50";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Urgent":
      return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
    case "High":
      return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
    case "Medium":
      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

export function TaskRequestsView() {
  const [tasks, setTasks] = useState<ClientTaskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ClientTaskRequest | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTaskRequests();
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (payload: CreateTaskRequestPayload) => {
    const newTask = await createTaskRequest(payload);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task request?")) {
      return;
    }

    setDeleting(id);
    try {
      const success = await deleteTaskRequest(id);
      if (success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert("Cannot delete tasks that are already assigned or in progress.");
      }
    } catch {
      alert("Failed to delete task request.");
    } finally {
      setDeleting(null);
    }
  };

  const handleViewDetails = (task: ClientTaskRequest) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const summaryText = `Task requests overview. ${tasks.length} total requests. ${tasks.filter((t) => t.status === "Pending Admin Review").length} pending review. ${tasks.filter((t) => t.status === "Assigned to Team").length} assigned to teams. ${tasks.filter((t) => t.status === "In Progress").length} in progress.`;

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-white border border-[#E5E7EB]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white border border-[#E5E7EB]"
            />
          ))}
        </div>
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
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Task Requests
            </h2>
            <p className="text-sm text-slate-500">
              Create and manage work task requests
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReadAloudButton
            text={summaryText}
            size="md"
            ariaLabel="Read task requests summary"
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A8A]/90 transition-colors flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Task Request
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-[#111827]">
                {tasks.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-slate-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#92400E] uppercase tracking-wide">
                Pending Review
              </p>
              <p className="mt-2 text-3xl font-bold text-[#92400E]">
                {tasks.filter((t) => t.status === "Pending Admin Review").length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[#F59E0B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1E3A8A]/30 bg-[#1E3A8A]/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wide">
                Assigned
              </p>
              <p className="mt-2 text-3xl font-bold text-[#1E3A8A]">
                {tasks.filter((t) => t.status === "Assigned to Team").length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-[#1E3A8A]/20 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[#1E3A8A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wide">
                In Progress
              </p>
              <p className="mt-2 text-3xl font-bold text-[#10B981]">
                {tasks.filter((t) => t.status === "In Progress").length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[#10B981]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Task Requests Yet
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Create your first task request to get started
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A8A]/90 transition-colors"
          >
            Create Task Request
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {task.referenceCode}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#111827] line-clamp-2">
                    {task.title}
                  </h3>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-[#111827]">
                    {task.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Workers Needed</span>
                  <span className="font-semibold text-[#111827]">
                    {task.estimatedWorkers}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target Output</span>
                  <span className="font-semibold text-[#111827]">
                    {formatNumber(task.targetOutput)} {task.unitLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Due Date</span>
                  <span className="font-semibold text-[#111827]">
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Shift</span>
                  <span className="font-semibold text-[#111827]">
                    {task.preferredShift.split(" ")[0]}
                  </span>
                </div>
                {task.assignedTeam && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Assigned Team</span>
                    <span className="font-semibold text-[#1E3A8A]">
                      {task.assignedTeam}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                {task.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  Requested {formatDate(task.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(task)}
                    className="text-xs font-semibold text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors"
                  >
                    View Details
                  </button>
                  {task.status === "Pending Admin Review" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deleting === task.id}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      {deleting === task.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
