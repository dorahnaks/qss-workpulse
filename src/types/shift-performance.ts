export interface ShiftPerformance {
  id: string;
  shift: "Morning" | "Afternoon" | "Night";
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  teamsAssigned: number;
  workersDeployed: number;
  targetOutput: number;
  actualOutput: number;
  achievementRate: number;
  status: "Exceeding" | "On Track" | "Below Target";
}

export interface ShiftComparison {
  shift: string;
  production: number;
  target: number;
  achievementRate: number;
  workersDeployed: number;
}

export interface ShiftPerformanceData {
  date: string;
  shifts: ShiftPerformance[];
  comparison: ShiftComparison[];
}
