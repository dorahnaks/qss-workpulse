import type { Metadata } from "next";
import { DailyPerformanceView } from "@/components/features/daily-performance/DailyPerformanceView";
import {
  DEFAULT_PERFORMANCE_DATE,
  getDailyPerformance,
} from "@/services/performance";

export const metadata: Metadata = {
  title: "Daily Work Performance",
  description:
    "View completed work, pending tasks, and daily target achievement across assigned QSS teams.",
};

export default async function DailyPerformancePage() {
  const initialData = await getDailyPerformance(DEFAULT_PERFORMANCE_DATE);
  return <DailyPerformanceView initialData={initialData} />;
}
