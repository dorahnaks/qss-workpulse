import type {
  ClientTaskRequest,
  CreateTaskRequestPayload,
} from "@/types/task-requests";

/**
 * Mock service for client task requests.
 * In production, replace with actual API calls to Laravel backend.
 */

// Mock data storage (simulates backend)
let mockTaskRequests: ClientTaskRequest[] = [
  {
    id: "TR-001",
    referenceCode: "WP-2024-001",
    title: "Warehouse Inventory Count",
    category: "Inventory Management",
    description: "Complete physical count of all items in warehouse sections A-D",
    priority: "High",
    preferredShift: "Morning (06:00–14:00)",
    estimatedWorkers: 8,
    targetOutput: 5000,
    unitLabel: "items counted",
    dueDate: "2024-01-20",
    siteLocation: "Main Warehouse - Nairobi",
    status: "Assigned to Team",
    assignedTeam: "Team A",
    requestedBy: "John Kamau",
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "TR-002",
    referenceCode: "WP-2024-002",
    title: "Product Packaging - New Line",
    category: "Packaging",
    description: "Package new product line for retail distribution",
    priority: "Urgent",
    preferredShift: "Afternoon (14:00–22:00)",
    estimatedWorkers: 12,
    targetOutput: 3000,
    unitLabel: "units packaged",
    dueDate: "2024-01-18",
    siteLocation: "Production Floor 2",
    status: "In Progress",
    assignedTeam: "Team B",
    requestedBy: "Mary Wanjiku",
    createdAt: "2024-01-14T10:15:00Z",
  },
  {
    id: "TR-003",
    referenceCode: "WP-2024-003",
    title: "Quality Control Inspection",
    category: "Quality Assurance",
    description: "Inspect finished goods before dispatch",
    priority: "Medium",
    preferredShift: "Flexible",
    estimatedWorkers: 5,
    targetOutput: 2000,
    unitLabel: "items inspected",
    dueDate: "2024-01-22",
    siteLocation: "QA Department",
    status: "Pending Admin Review",
    requestedBy: "Peter Omondi",
    createdAt: "2024-01-16T14:00:00Z",
  },
];

/**
 * Get all task requests for the authenticated client
 */
export async function getTaskRequests(): Promise<ClientTaskRequest[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production: const response = await fetch('/api/task-requests', { headers: { Authorization: `Bearer ${token}` }});
  return [...mockTaskRequests].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Create a new task request
 */
export async function createTaskRequest(
  payload: CreateTaskRequestPayload
): Promise<ClientTaskRequest> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate mock data
  const newTask: ClientTaskRequest = {
    id: `TR-${String(mockTaskRequests.length + 1).padStart(3, "0")}`,
    referenceCode: `WP-${new Date().getFullYear()}-${String(mockTaskRequests.length + 1).padStart(3, "0")}`,
    ...payload,
    status: "Pending Admin Review",
    createdAt: new Date().toISOString(),
  };

  // Add to mock storage
  mockTaskRequests.unshift(newTask);

  // In production:
  // const response = await fetch('/api/task-requests', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  //   body: JSON.stringify(payload)
  // });
  // return response.json();

  return newTask;
}

/**
 * Get task request by ID
 */
export async function getTaskRequestById(
  id: string
): Promise<ClientTaskRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const task = mockTaskRequests.find((t) => t.id === id);
  return task ?? null;
}

/**
 * Delete a task request (only if not yet assigned)
 */
export async function deleteTaskRequest(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const task = mockTaskRequests.find((t) => t.id === id);
  if (!task || task.status !== "Pending Admin Review") {
    return false; // Can only delete pending tasks
  }

  mockTaskRequests = mockTaskRequests.filter((t) => t.id !== id);
  return true;
}
