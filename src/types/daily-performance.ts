export interface DailyPerformanceRecord {
  id: string;
  date: string;
  shift: "Morning" | "Afternoon" | "Night";
  targetOutput: number;
  actualOutput: number;
  achievementRate: number;
  pendingWork: number;
  completedActivities: number;
  totalActivities: number;
  status: "Exceeding" | "On Track" | "Below Target";
}

export interface DailyPerformanceSummary {
  date: string;
  totalTarget: number;
  totalActual: number;
  achievementRate: number;
  totalPending: number;
  completedActivities: number;
  totalActivities: number;
  records: DailyPerformanceRecord[];
}
