export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface TeamPerformance {
  id: string;
  teamName: string;
  supervisor: string;
  workersDeployed: number;
  workersScheduled: number;
  shift: "Morning" | "Afternoon" | "Night";
  targetOutput: number;
  actualOutput: number;
  achievementRate: number;
  productivityScore: number;
  status: "Exceeding" | "On Track" | "Needs Attention";
}

export interface TeamProductivityHistory {
  teamId: string;
  teamName: string;
  history: {
    date: string;
    output: number;
    target: number;
    achievementRate: number;
  }[];
}

export interface TeamPerformanceData {
  teams: TeamPerformance[];
  productivityHistory: TeamProductivityHistory[];
}
