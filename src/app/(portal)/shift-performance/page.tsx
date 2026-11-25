import type { Metadata } from "next";
import { ShiftPerformanceView } from "@/components/features/shift-performance/ShiftPerformanceView";

export const metadata: Metadata = {
  title: "Shift Performance",
  description:
    "View morning, afternoon, and night shift performance, schedules, and production comparison.",
};

export default function ShiftPerformancePage() {
  return <ShiftPerformanceView />;
}
