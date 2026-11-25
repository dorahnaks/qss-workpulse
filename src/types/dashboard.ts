export type DashboardRange = "today" | "week" | "month";

export interface OutputSeriesPoint {
  label: string;
  target: number;
  actual: number;
}

export interface ActiveTeamSnapshot {
  id: string;
  name: string;
  supervisor: string;
  shift: string;
  deployedWorkers: number;
  scheduledWorkers: number;
  targetUnits: number;
  actualUnits: number;
  pendingUnits: number;
  status: "Exceeding" | "On Track" | "Needs Attention";
}

export interface DashboardSummary {
  range: DashboardRange;
  lastUpdated: string;
  deployedWorkers: number;
  scheduledWorkers: number;
  activeTeamsCount: number;
  activeShiftsCount: number;
  productionTarget: number;
  actualOutput: number;
  pendingOutput: number;
  achievementRate: number;
  achievementDelta: string;
  outputSeries: OutputSeriesPoint[];
  teams: ActiveTeamSnapshot[];
}
