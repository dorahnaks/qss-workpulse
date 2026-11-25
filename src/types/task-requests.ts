export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export type TaskAssignmentStatus =
  | "Pending Admin Review"
  | "Assigned to Team"
  | "In Progress";

export type PreferredShift =
  | "Morning (06:00–14:00)"
  | "Afternoon (14:00–22:00)"
  | "Night (22:00–06:00)"
  | "Flexible";

export interface ClientTaskRequest {
  id: string;
  referenceCode: string;
  title: string;
  category: string;
  description: string;
  priority: TaskPriority;
  preferredShift: PreferredShift;
  estimatedWorkers: number;
  targetOutput: number;
  unitLabel: string;
  dueDate: string;
  siteLocation: string;
  status: TaskAssignmentStatus;
  assignedTeam?: string;
  requestedBy: string;
  createdAt: string;
}

export interface CreateTaskRequestPayload {
  title: string;
  category: string;
  description: string;
  priority: TaskPriority;
  preferredShift: PreferredShift;
  estimatedWorkers: number;
  targetOutput: number;
  unitLabel: string;
  dueDate: string;
  siteLocation: string;
  requestedBy: string;
}
