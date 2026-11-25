import type { Metadata } from "next";
import { TaskRequestsView } from "@/components/features/work-activities/TaskRequestsView";

export const metadata: Metadata = {
  title: "Task Requests",
  description:
    "Create and manage work task requests that will be assigned to teams by QSS supervisors.",
};

export default function TaskRequestsPage() {
  return <TaskRequestsView />;
}
