import type { Metadata } from "next";
import { NotificationsCenter } from "@/components/features/notifications/NotificationsCenter";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Receive updates on production targets, completed shifts, and team performance.",
};

export default function NotificationsPage() {
  return <NotificationsCenter />;
}
