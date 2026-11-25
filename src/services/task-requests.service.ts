import { ApiError, apiRequest, isLiveApiConfigured } from "@/lib/api/client";
import { appendLocalNotification } from "@/services/notifications.service";
import type {
  ClientTaskRequest,
  CreateTaskRequestPayload,
} from "@/types/task-requests";

const TASK_REQUESTS_STORAGE_KEY = "qss_workpulse_task_requests";

const DEFAULT_TASK_REQUESTS: ClientTaskRequest[] = [
  {
    id: "tsk-201",
    referenceCode: "WR-2026-041",
    title: "Urgent Export Pallet Shrink-Wrapping (Bay 4)",
    category: "Packaging & Labeling",
    description:
      "Prepare and shrink-wrap 420 export cartons for regional dispatch truck arriving at 18:00.",
    priority: "High",
    preferredShift: "Afternoon (14:00–22:00)",
    estimatedWorkers: 8,
    targetOutput: 420,
    unitLabel: "cartons",
    dueDate: "2026-11-25",
    siteLocation: "Nairobi Industrial Park — Hub B",
    status: "Pending Admin Review",
    requestedBy: "Sarah Jenkins",
    createdAt: "Today, 09:20 AM",
  },
  {
    id: "tsk-202",
    referenceCode: "WR-2026-039",
    title: "Cold-Chain Inbound Container Offloading",
    category: "Loading & Offloading",
    description:
      "Unload two 40ft containers and sort batches into Zone C chilled racks with barcode verification.",
    priority: "Medium",
    preferredShift: "Morning (06:00–14:00)",
    estimatedWorkers: 12,
    targetOutput: 680,
    unitLabel: "crates",
    dueDate: "2026-11-26",
    siteLocation: "Nairobi Industrial Park — Hub B",
    status: "Assigned to Team",
    assignedTeam: "Foxtrot Inbound",
    requestedBy: "Sarah Jenkins",
    createdAt: "Yesterday, 04:10 PM",
  },
];

function readLocalTasks(): ClientTaskRequest[] {
  if (typeof window === "undefined") return DEFAULT_TASK_REQUESTS;
  try {
    const raw = window.localStorage.getItem(TASK_REQUESTS_STORAGE_KEY);
    if (!raw) return DEFAULT_TASK_REQUESTS;
    return JSON.parse(raw) as ClientTaskRequest[];
  } catch {
    return DEFAULT_TASK_REQUESTS;
  }
}

function writeLocalTasks(tasks: ClientTaskRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TASK_REQUESTS_STORAGE_KEY,
      JSON.stringify(tasks)
    );
  } catch {
    // Ignore storage errors
  }
}

function isNetworkFailure(error: unknown): boolean {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && error.status === 0)
  );
}

export async function getClientTaskRequests(): Promise<ClientTaskRequest[]> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ data: ClientTaskRequest[] }>(
        "/client/task-requests"
      );
      return response.data;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }
  return readLocalTasks();
}

export async function createClientTaskRequest(
  payload: CreateTaskRequestPayload
): Promise<ClientTaskRequest> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ data: ClientTaskRequest }>(
        "/client/task-requests",
        {
          method: "POST",
          body: payload,
        }
      );
      return response.data;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  const current = readLocalTasks();
  const nextSeq = String(42 + current.length).padStart(3, "0");
  const newTask: ClientTaskRequest = {
    id: `tsk-${Date.now()}`,
    referenceCode: `WR-2026-${nextSeq}`,
    ...payload,
    status: "Pending Admin Review",
    createdAt: "Just now",
  };

  writeLocalTasks([newTask, ...current]);

  appendLocalNotification({
    id: `ntf-task-${Date.now()}`,
    title: `Task Submitted for Admin Assignment (${newTask.referenceCode})`,
    message: `"${newTask.title}" (${newTask.targetOutput} ${newTask.unitLabel}, est. ${newTask.estimatedWorkers} workers) has been sent to Q-Sourcing Admin for team assignment.`,
    category: "production",
    severity: "info",
    createdAt: new Date().toISOString(),
    relativeTime: "Just now",
    read: false,
    shiftName: newTask.preferredShift,
    metricBadge: newTask.priority,
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("qss:notifications-updated"));
  }

  return newTask;
}

export async function cancelClientTaskRequest(id: string): Promise<void> {
  if (isLiveApiConfigured()) {
    try {
      await apiRequest(`/client/task-requests/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  const remaining = readLocalTasks().filter((task) => task.id !== id);
  writeLocalTasks(remaining);
}
