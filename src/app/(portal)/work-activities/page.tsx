import type { Metadata } from "next";
import { WorkActivitiesView } from "@/components/features/work-activities/WorkActivitiesView";

export const metadata: Metadata = {
  title: "Work Activities",
  description:
    "View assigned work activities, track expected vs completed quantities, and monitor work progress.",
};

export default function WorkActivitiesPage() {
  return <WorkActivitiesView />;
}
