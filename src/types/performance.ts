export type ShiftType = "morning" | "afternoon" | "night";

export type ShiftStatus = "scheduled" | "active" | "completed";

export type WorkStatus = "completed" | "in_progress" | "pending";

export interface DailyActivityRecord {
  id: string;
  activityName: string;
  category: string;
  unit: string;
  teamName: string;
  shiftType: ShiftType;
  supervisorName: string;
  targetQuantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  achievementRate: number;
  status: WorkStatus;
  updatedAt: string;
  remarks?: string;
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  target: number;
  produced: number;
  achievementRate: number;
  workersDeployed: number;
}

export interface DailyPerformanceSummary {
  dailyTarget: number;
  totalProduced: number;
  remainingWork: number;
  achievementRate: number;
  workersDeployed: number;
  completedActivities: number;
  totalActivities: number;
  unit: string;
}

export interface DailyPerformanceData {
  date: string;
  clientName: string;
  isLiveData: boolean;
  summary: DailyPerformanceSummary;
  activities: DailyActivityRecord[];
  trend: DailyTrendPoint[];
}

export interface ShiftActivityBreakdown {
  name: string;
  target: number;
  completed: number;
  pending: number;
  unit: string;
}

export interface ShiftRecord {
  id: string;
  shiftType: ShiftType;
  label: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  teamId: string;
  teamName: string;
  supervisorName: string;
  workersDeployed: number;
  allocatedTarget: number;
  actualProduced: number;
  pendingWork: number;
  achievementRate: number;
  unit: string;
  submittedAt: string | null;
  remarks: string;
  activities: ShiftActivityBreakdown[];
}

export interface ShiftPerformanceSummary {
  totalTarget: number;
  totalProduced: number;
  totalPending: number;
  overallAchievementRate: number;
  totalWorkersDeployed: number;
  activeShifts: number;
  completedShifts: number;
  scheduledShifts: number;
  topShiftLabel: string;
  unit: string;
}

export interface ShiftPerformanceData {
  date: string;
  clientName: string;
  isLiveData: boolean;
  summary: ShiftPerformanceSummary;
  shifts: ShiftRecord[];
}

export type TeamHealthStatus = "exceeding" | "on_track" | "needs_attention";

export interface TeamPerformanceRecord {
  id: string;
  name: string;
  code: string;
  supervisorName: string;
  primaryShift: ShiftType;
  workersDeployed: number;
  assignedWorkers: number;
  targetQuantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  achievementRate: number;
  outputPerWorker: number;
  unit: string;
  status: TeamHealthStatus;
  topActivities: string[];
  recentTrend: number[];
}

export interface TeamPerformanceSummary {
  activeTeams: number;
  totalWorkersDeployed: number;
  totalTarget: number;
  totalProduced: number;
  averageAchievementRate: number;
  topTeamName: string;
  unit: string;
}

export interface TeamPerformanceData {
  date: string;
  periodLabel: string;
  clientName: string;
  isLiveData: boolean;
  summary: TeamPerformanceSummary;
  teams: TeamPerformanceRecord[];
}
