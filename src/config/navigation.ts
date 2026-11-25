export interface NavItem {
  label: string;
  href: string;
  description: string;
  routeGroup: "(portal)";
}

export const PORTAL_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description:
      "Overview of deployed workers, active teams, production targets, and actual output.",
    routeGroup: "(portal)",
  },
  {
    label: "Daily Performance",
    href: "/daily-performance",
    description:
      "Track completed work, pending tasks, and daily target achievement.",
    routeGroup: "(portal)",
  },
  {
    label: "Shift Performance",
    href: "/shift-performance",
    description:
      "Monitor production output and efficiency across scheduled shifts.",
    routeGroup: "(portal)",
  },
  {
    label: "Team Performance",
    href: "/team-performance",
    description:
      "Inspect individual team output and compare performance across assigned teams.",
    routeGroup: "(portal)",
  },
  {
    label: "Work Activities",
    href: "/work-activities",
    description:
      "Monitor assigned work activities and real-time completion status.",
    routeGroup: "(portal)",
  },
  {
    label: "Task Requests",
    href: "/task-requests",
    description:
      "Create new task requests to be assigned to teams by QSS supervisors.",
    routeGroup: "(portal)",
  },
  {
    label: "Reports & Analytics",
    href: "/reports",
    description:
      "Review daily, weekly, and monthly performance reports and export downloads.",
    routeGroup: "(portal)",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description:
      "Receive timely alerts on production milestones, completed shifts, and performance.",
    routeGroup: "(portal)",
  },
  {
    label: "Profile & Settings",
    href: "/settings",
    description:
      "Manage company details, client account information, and security preferences.",
    routeGroup: "(portal)",
  },
];

export const AUTH_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;
