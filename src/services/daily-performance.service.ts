import type { DailyPerformanceSummary } from "@/types/daily-performance";

export async function getDailyPerformance(date?: string): Promise<DailyPerformanceSummary> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    date: date ?? new Date().toISOString().split("T")[0],
    totalTarget: 2000,
    totalActual: 1750,
    achievementRate: 87.5,
    totalPending: 250,
    completedActivities: 12,
    totalActivities: 15,
    records: [
      {
        id: "shift-morning",
        date: date ?? new Date().toISOString().split("T")[0],
        shift: "Morning",
        targetOutput: 800,
        actualOutput: 850,
        achievementRate: 106.25,
        pendingWork: 0,
        completedActivities: 5,
        totalActivities: 5,
        status: "Exceeding",
      },
      {
        id: "shift-afternoon",
        date: date ?? new Date().toISOString().split("T")[0],
        shift: "Afternoon",
        targetOutput: 800,
        actualOutput: 700,
        achievementRate: 87.5,
        pendingWork: 100,
        completedActivities: 4,
        totalActivities: 5,
        status: "Below Target",
      },
      {
        id: "shift-night",
        date: date ?? new Date().toISOString().split("T")[0],
        shift: "Night",
        targetOutput: 400,
        actualOutput: 200,
        achievementRate: 50,
        pendingWork: 150,
        completedActivities: 3,
        totalActivities: 5,
        status: "Below Target",
      },
    ],
  };
}
