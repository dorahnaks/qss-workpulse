"use client";

import { useState } from "react";
import type {
  CreateTaskRequestPayload,
  TaskPriority,
  PreferredShift,
} from "@/types/task-requests";
import { useAuth } from "@/context/AuthContext";

interface CreateTaskRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskRequestPayload) => Promise<void>;
}

const TASK_CATEGORIES = [
  "Inventory Management",
  "Packaging",
  "Quality Assurance",
  "Assembly",
  "Sorting",
  "Loading/Unloading",
  "Data Entry",
  "Cleaning",
  "Other",
];

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

const SHIFTS: PreferredShift[] = [
  "Morning (06:00–14:00)",
  "Afternoon (14:00–22:00)",
  "Night (22:00–06:00)",
  "Flexible",
];

export function CreateTaskRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskRequestModalProps) {
  const { user, company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTaskRequestPayload>({
    title: "",
    category: "",
    description: "",
    priority: "Medium",
    preferredShift: "Flexible",
    estimatedWorkers: 5,
    targetOutput: 1000,
    unitLabel: "units",
    dueDate: "",
    siteLocation: company?.siteLocation ?? "",
    requestedBy: user?.name ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!formData.category) {
      setError("Task category is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Task description is required");
      return;
    }
    if (formData.estimatedWorkers < 1) {
      setError("At least 1 worker is required");
      return;
    }
    if (formData.targetOutput < 1) {
      setError("Target output must be greater than 0");
      return;
    }
    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        priority: "Medium",
        preferredShift: "Flexible",
        estimatedWorkers: 5,
        targetOutput: 1000,
        unitLabel: "units",
        dueDate: "",
        siteLocation: company?.siteLocation ?? "",
        requestedBy: user?.name ?? "",
      });
      onClose();
    } catch (err) {
      setError("Failed to create task request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Create New Task Request
            </h2>
            <p className="text-sm text-slate-500">
              Request a new task to be assigned by QSS supervisor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Task Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#111827] mb-2"
            >
              Task Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              placeholder="e.g., Warehouse Inventory Count"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-[#111827] mb-2"
            >
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
            >
              <option value="">Select a category</option>
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#111827] mb-2"
            >
              Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 resize-none"
              placeholder="Describe the task in detail..."
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Priority and Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="preferredShift"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Preferred Shift
              </label>
              <select
                id="preferredShift"
                name="preferredShift"
                value={formData.preferredShift}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              >
                {SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workers and Target Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="estimatedWorkers"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Estimated Workers <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                id="estimatedWorkers"
                name="estimatedWorkers"
                value={formData.estimatedWorkers}
                onChange={handleChange}
                required
                min={1}
                max={100}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="targetOutput"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Target Output <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                id="targetOutput"
                name="targetOutput"
                value={formData.targetOutput}
                onChange={handleChange}
                required
                min={1}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>
          </div>

          {/* Unit Label */}
          <div>
            <label
              htmlFor="unitLabel"
              className="block text-sm font-semibold text-[#111827] mb-2"
            >
              Unit Label
            </label>
            <input
              type="text"
              id="unitLabel"
              name="unitLabel"
              value={formData.unitLabel}
              onChange={handleChange}
              maxLength={30}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              placeholder="e.g., units, items, boxes"
            />
          </div>

          {/* Due Date and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Due Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="siteLocation"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Site Location
              </label>
              <input
                type="text"
                id="siteLocation"
                name="siteLocation"
                value={formData.siteLocation}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                placeholder="e.g., Main Warehouse"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A8A]/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create Task Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
