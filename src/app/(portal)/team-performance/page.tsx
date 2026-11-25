import type { Metadata } from "next";
import { TeamPerformanceView } from "@/components/features/team-performance/TeamPerformanceView";

export const metadata: Metadata = {
  title: "Team Performance",
  description:
    "View teams assigned, workers deployed per team, production comparison, and productivity history.",
};

export default function TeamPerformancePage() {
  return <TeamPerformanceView />;
}
