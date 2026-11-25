export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateAchievement(produced: number, target: number): number {
  if (target <= 0) return 0;
  return Math.round((produced / target) * 1000) / 10;
}

export function formatShiftLabel(shift: "morning" | "afternoon" | "night"): string {
  switch (shift) {
    case "morning":
      return "Morning Shift";
    case "afternoon":
      return "Afternoon Shift";
    case "night":
      return "Night Shift";
  }
}

export function formatDateDisplay(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}
