export type NotificationCategory =
  | "production"
  | "shift"
  | "performance"
  | "system";

export type NotificationSeverity = "info" | "success" | "warning";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  createdAt: string;
  relativeTime: string;
  read: boolean;
  teamName?: string;
  shiftName?: string;
  metricBadge?: string;
}
