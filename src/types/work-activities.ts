export interface WorkActivity {
  id: string;
  activityName: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  expectedQuantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  completionRate: number;
  status: "Completed" | "In Progress" | "Pending" | "Overdue";
  assignedTeam: string;
  priority: "High" | "Medium" | "Low";
}

export interface ActivityProgress {
  date: string;
  completed: number;
  pending: number;
}

export interface WorkActivitiesData {
  activities: WorkActivity[];
  progressTimeline: ActivityProgress[];
  summary: {
    totalActivities: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
  };
}
