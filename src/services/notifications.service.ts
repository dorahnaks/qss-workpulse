import { ApiError, apiRequest, isLiveApiConfigured } from "@/lib/api/client";
import type { NotificationItem } from "@/types/notifications";

const NOTIFICATIONS_STORAGE_KEY = "qss_workpulse_notifications";

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "ntf-101",
    title: "Morning Shift Completed Above Target",
    message:
      "Alpha Packaging and Bravo Sorting completed the morning shift at 102.7% of agreed production target (4,620 / 4,500 units).",
    category: "shift",
    severity: "success",
    createdAt: "2026-11-25T11:05:00Z",
    relativeTime: "12 mins ago",
    read: false,
    teamName: "Alpha Packaging",
    shiftName: "Morning Shift",
    metricBadge: "102.7% Target",
  },
  {
    id: "ntf-102",
    title: "Night Shift Output Variance Flagged",
    message:
      "Echo Palletizing is currently 290 units behind target due to 3 absent operators. Supervisor Samuel Mutua has requested relief coverage.",
    category: "production",
    severity: "warning",
    createdAt: "2026-11-25T09:40:00Z",
    relativeTime: "1 hour ago",
    read: false,
    teamName: "Echo Palletizing",
    shiftName: "Night Shift",
    metricBadge: "-290 Units",
  },
  {
    id: "ntf-103",
    title: "Weekly Team Performance Benchmark Reached",
    message:
      "Your assigned QSS teams averaged 97.0% target achievement across 6 active teams this week — up 2.1% from last week.",
    category: "performance",
    severity: "info",
    createdAt: "2026-11-25T07:30:00Z",
    relativeTime: "3 hours ago",
    read: false,
    metricBadge: "+2.1% WoW",
  },
  {
    id: "ntf-104",
    title: "Afternoon Shift Check-in Confirmed",
    message:
      "48 of 52 scheduled workers checked in on time across Charlie Dispatch and Delta Quality Check.",
    category: "shift",
    severity: "info",
    createdAt: "2026-11-24T14:15:00Z",
    relativeTime: "Yesterday",
    read: true,
    teamName: "Charlie Dispatch",
    shiftName: "Afternoon Shift",
    metricBadge: "92.3% Attendance",
  },
  {
    id: "ntf-105",
    title: "Daily Production Milestone Verified",
    message:
      "Supervisor sign-off completed for yesterday's production log. Total verified output: 11,890 units across all hubs.",
    category: "production",
    severity: "success",
    createdAt: "2026-11-24T11:50:00Z",
    relativeTime: "Yesterday",
    read: true,
    metricBadge: "11,890 Units",
  },
  {
    id: "ntf-106",
    title: "Monthly Performance Digest Ready",
    message:
      "Your monthly client operations summary is ready for review in Reports & Analytics.",
    category: "performance",
    severity: "info",
    createdAt: "2026-11-22T08:00:00Z",
    relativeTime: "3 days ago",
    read: true,
  },
];

function readLocalNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    return JSON.parse(raw) as NotificationItem[];
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function writeLocalNotifications(items: NotificationItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(items)
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

export async function getNotifications(): Promise<NotificationItem[]> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ data: NotificationItem[] }>(
        "/client/notifications"
      );
      return response.data;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }
  return readLocalNotifications();
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (isLiveApiConfigured()) {
    try {
      await apiRequest(`/client/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
      });
      return;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  const updated = readLocalNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  writeLocalNotifications(updated);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  if (isLiveApiConfigured()) {
    try {
      await apiRequest("/client/notifications/read-all", {
        method: "PATCH",
      });
      return;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  const updated = readLocalNotifications().map((item) => ({
    ...item,
    read: true,
  }));
  writeLocalNotifications(updated);
}

export async function dismissNotification(id: string): Promise<void> {
  if (isLiveApiConfigured()) {
    try {
      await apiRequest(`/client/notifications/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  const updated = readLocalNotifications().filter((item) => item.id !== id);
  writeLocalNotifications(updated);
}
