import type { Metadata } from "next";
import { DailyPerformanceView } from "@/components/features/daily-performance/DailyPerformanceView";

export const metadata: Metadata = {
  title: "Daily Performance",
  description:
    "View daily production records, compare expected vs actual output, and track target achievement.",
};

export default function DailyPerformancePage() {
  return <DailyPerformanceView />;
}
