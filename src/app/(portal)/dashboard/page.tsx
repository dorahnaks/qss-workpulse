import type { Metadata } from "next";
import { DashboardOverview } from "@/components/features/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description:
    "Overview of deployed workers, active teams, production targets, and actual output.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
