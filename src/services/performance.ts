import { apiGet } from "@/lib/api/client";
import { calculateAchievement } from "@/lib/utils/format";
import type {
  DailyActivityRecord,
  DailyPerformanceData,
  DailyTrendPoint,
  ShiftPerformanceData,
  ShiftRecord,
  TeamPerformanceData,
  TeamPerformanceRecord,
} from "@/types/performance";

export const DEFAULT_PERFORMANCE_DATE = "2026-11-25";

function getDateSeedOffset(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i += 1) {
    hash = (hash * 31 + date.charCodeAt(i)) % 17;
  }
  return hash - 8; // -8 .. +8
}

function buildMockDailyPerformance(date: string): DailyPerformanceData {
  const offset = date === DEFAULT_PERFORMANCE_DATE ? 0 : getDateSeedOffset(date);
  const scale = 1 + offset * 0.02;

  const baseActivities: Omit<
    DailyActivityRecord,
    "pendingQuantity" | "achievementRate"
  >[] = [
    {
      id: "act-1",
      activityName: "Export Carton Packing",
      category: "Packaging",
      unit: "cartons",
      teamName: "Team A — Alpha",
      shiftType: "morning",
      supervisorName: "John Okello",
      targetQuantity: 700,
      completedQuantity: Math.min(700, Math.round(640 * scale)),
      status: "in_progress",
      updatedAt: "1:45 PM",
      remarks: "Line 2 conveyor paused 15 mins for label restock; back at full speed.",
    },
    {
      id: "act-2",
      activityName: "Palletizing & Shrink-Wrap",
      category: "Warehousing",
      unit: "cartons",
      teamName: "Team A — Alpha",
      shiftType: "morning",
      supervisorName: "John Okello",
      targetQuantity: 450,
      completedQuantity: 450,
      status: "completed",
      updatedAt: "1:55 PM",
      remarks: "All morning dispatch pallets cleared ahead of truck arrival.",
    },
    {
      id: "act-3",
      activityName: "Order Picking & Sorting",
      category: "Fulfillment",
      unit: "cartons",
      teamName: "Team B — Bravo",
      shiftType: "afternoon",
      supervisorName: "Mary Namukasa",
      targetQuantity: 500,
      completedQuantity: Math.min(500, Math.round(310 * scale)),
      status: "in_progress",
      updatedAt: "5:20 PM",
      remarks: "Afternoon shift ongoing; 190 cartons queued for bay 4.",
    },
    {
      id: "act-4",
      activityName: "Quality Inspection & Sealing",
      category: "Quality Control",
      unit: "cartons",
      teamName: "Team B — Bravo",
      shiftType: "afternoon",
      supervisorName: "Mary Namukasa",
      targetQuantity: 150,
      completedQuantity: Math.min(150, Math.round(100 * scale)),
      status: "in_progress",
      updatedAt: "5:10 PM",
      remarks: "Zero defect rejections recorded so far.",
    },
    {
      id: "act-5",
      activityName: "Overnight Staging & Loading",
      category: "Dispatch",
      unit: "cartons",
      teamName: "Team C — Charlie",
      shiftType: "night",
      supervisorName: "Peter Ssemwogerere",
      targetQuantity: 200,
      completedQuantity: 0,
      status: "pending",
      updatedAt: "Scheduled 10:00 PM",
      remarks: "Awaiting night shift handover.",
    },
  ];

  const activities: DailyActivityRecord[] = baseActivities.map((item) => {
    const completed = Math.max(0, Math.min(item.targetQuantity, item.completedQuantity));
    const pending = Math.max(0, item.targetQuantity - completed);
    const achievementRate = calculateAchievement(completed, item.targetQuantity);
    const status =
      completed >= item.targetQuantity
        ? "completed"
        : completed > 0
          ? "in_progress"
          : "pending";
    return {
      ...item,
      completedQuantity: completed,
      pendingQuantity: pending,
      achievementRate,
      status,
    };
  });

  const dailyTarget = activities.reduce((acc, a) => acc + a.targetQuantity, 0);
  const totalProduced = activities.reduce((acc, a) => acc + a.completedQuantity, 0);
  const remainingWork = Math.max(0, dailyTarget - totalProduced);
  const completedActivities = activities.filter((a) => a.status === "completed").length;

  const trend: DailyTrendPoint[] = [
    { date: "2026-11-19", label: "Thu 19", target: 1900, produced: 1780, achievementRate: 93.7, workersDeployed: 42 },
    { date: "2026-11-20", label: "Fri 20", target: 2000, produced: 1940, achievementRate: 97.0, workersDeployed: 45 },
    { date: "2026-11-21", label: "Sat 21", target: 1600, produced: 1620, achievementRate: 101.3, workersDeployed: 36 },
    { date: "2026-11-22", label: "Sun 22", target: 1400, produced: 1290, achievementRate: 92.1, workersDeployed: 32 },
    { date: "2026-11-23", label: "Mon 23", target: 2000, produced: 1860, achievementRate: 93.0, workersDeployed: 44 },
    { date: "2026-11-24", label: "Tue 24", target: 2000, produced: 1910, achievementRate: 95.5, workersDeployed: 45 },
    {
      date,
      label: "Today",
      target: dailyTarget,
      produced: totalProduced,
      achievementRate: calculateAchievement(totalProduced, dailyTarget),
      workersDeployed: 46,
    },
  ];

  return {
    date,
    clientName: "Nile Beverage & Logistics Ltd.",
    isLiveData: false,
    summary: {
      dailyTarget,
      totalProduced,
      remainingWork,
      achievementRate: calculateAchievement(totalProduced, dailyTarget),
      workersDeployed: 46,
      completedActivities,
      totalActivities: activities.length,
      unit: "cartons",
    },
    activities,
    trend,
  };
}

function buildMockShiftPerformance(date: string): ShiftPerformanceData {
  const offset = date === DEFAULT_PERFORMANCE_DATE ? 0 : getDateSeedOffset(date);
  const scale = 1 + offset * 0.02;

  const morningProduced = Math.min(1150, Math.round(1090 * scale));
  const afternoonProduced = Math.min(650, Math.round(410 * scale));

  const shifts: ShiftRecord[] = [
    {
      id: "shift-morning",
      shiftType: "morning",
      label: "Morning Shift",
      startTime: "6:00 AM",
      endTime: "2:00 PM",
      status: "completed",
      teamId: "team-a",
      teamName: "Team A — Alpha",
      supervisorName: "John Okello",
      workersDeployed: 18,
      allocatedTarget: 1150,
      actualProduced: morningProduced,
      pendingWork: Math.max(0, 1150 - morningProduced),
      achievementRate: calculateAchievement(morningProduced, 1150),
      unit: "cartons",
      submittedAt: "2:08 PM",
      remarks:
        "Palletizing completed 100%. 60 cartons from Line 2 rolled over to Afternoon Shift.",
      activities: [
        {
          name: "Export Carton Packing",
          target: 700,
          completed: Math.max(0, morningProduced - 450),
          pending: Math.max(0, 700 - Math.max(0, morningProduced - 450)),
          unit: "cartons",
        },
        {
          name: "Palletizing & Shrink-Wrap",
          target: 450,
          completed: 450,
          pending: 0,
          unit: "cartons",
        },
      ],
    },
    {
      id: "shift-afternoon",
      shiftType: "afternoon",
      label: "Afternoon Shift",
      startTime: "2:00 PM",
      endTime: "10:00 PM",
      status: "active",
      teamId: "team-b",
      teamName: "Team B — Bravo",
      supervisorName: "Mary Namukasa",
      workersDeployed: 16,
      allocatedTarget: 650,
      actualProduced: afternoonProduced,
      pendingWork: Math.max(0, 650 - afternoonProduced),
      achievementRate: calculateAchievement(afternoonProduced, 650),
      unit: "cartons",
      submittedAt: "Live update · 5:20 PM",
      remarks:
        "Mid-shift tally recorded. Bay 4 picking on pace to finish before 9:30 PM.",
      activities: [
        {
          name: "Order Picking & Sorting",
          target: 500,
          completed: Math.min(500, Math.round(afternoonProduced * 0.75)),
          pending: Math.max(0, 500 - Math.min(500, Math.round(afternoonProduced * 0.75))),
          unit: "cartons",
        },
        {
          name: "Quality Inspection & Sealing",
          target: 150,
          completed: Math.max(0, afternoonProduced - Math.min(500, Math.round(afternoonProduced * 0.75))),
          pending: Math.max(
            0,
            150 - Math.max(0, afternoonProduced - Math.min(500, Math.round(afternoonProduced * 0.75)))
          ),
          unit: "cartons",
        },
      ],
    },
    {
      id: "shift-night",
      shiftType: "night",
      label: "Night Shift",
      startTime: "10:00 PM",
      endTime: "6:00 AM",
      status: "scheduled",
      teamId: "team-c",
      teamName: "Team C — Charlie",
      supervisorName: "Peter Ssemwogerere",
      workersDeployed: 12,
      allocatedTarget: 200,
      actualProduced: 0,
      pendingWork: 200,
      achievementRate: 0,
      unit: "cartons",
      submittedAt: null,
      remarks: "Roster confirmed (12 workers). Handover briefing at 9:45 PM.",
      activities: [
        {
          name: "Overnight Staging & Loading",
          target: 200,
          completed: 0,
          pending: 200,
          unit: "cartons",
        },
      ],
    },
  ];

  const totalTarget = shifts.reduce((acc, s) => acc + s.allocatedTarget, 0);
  const totalProduced = shifts.reduce((acc, s) => acc + s.actualProduced, 0);
  const totalPending = Math.max(0, totalTarget - totalProduced);
  const totalWorkersDeployed = shifts.reduce((acc, s) => acc + s.workersDeployed, 0);

  const topShift = [...shifts].sort((a, b) => b.achievementRate - a.achievementRate)[0];

  return {
    date,
    clientName: "Nile Beverage & Logistics Ltd.",
    isLiveData: false,
    summary: {
      totalTarget,
      totalProduced,
      totalPending,
      overallAchievementRate: calculateAchievement(totalProduced, totalTarget),
      totalWorkersDeployed,
      activeShifts: shifts.filter((s) => s.status === "active").length,
      completedShifts: shifts.filter((s) => s.status === "completed").length,
      scheduledShifts: shifts.filter((s) => s.status === "scheduled").length,
      topShiftLabel: topShift ? `${topShift.label} (${topShift.achievementRate}%)` : "—",
      unit: "cartons",
    },
    shifts,
  };
}

function buildMockTeamPerformance(date: string, period: string): TeamPerformanceData {
  const periodMultiplier = period === "weekly" ? 6 : period === "monthly" ? 24 : 1;
  const offset = date === DEFAULT_PERFORMANCE_DATE ? 0 : getDateSeedOffset(date);
  const scale = 1 + offset * 0.015;

  const rawTeams: Array<
    Omit<TeamPerformanceRecord, "pendingQuantity" | "achievementRate" | "outputPerWorker" | "status">
  > = [
    {
      id: "team-a",
      name: "Team A — Alpha",
      code: "TM-A01",
      supervisorName: "John Okello",
      primaryShift: "morning",
      workersDeployed: 18,
      assignedWorkers: 18,
      targetQuantity: 1150 * periodMultiplier,
      completedQuantity: Math.round(1090 * periodMultiplier * scale),
      unit: "cartons",
      topActivities: ["Export Carton Packing", "Palletizing & Shrink-Wrap"],
      recentTrend: [89, 92, 94, 91, 96, 95, 94.8],
    },
    {
      id: "team-b",
      name: "Team B — Bravo",
      code: "TM-B02",
      supervisorName: "Mary Namukasa",
      primaryShift: "afternoon",
      workersDeployed: 16,
      assignedWorkers: 17,
      targetQuantity: 650 * periodMultiplier,
      completedQuantity: Math.round(
        (period === "daily" ? 410 : 615 * periodMultiplier) * scale
      ),
      unit: "cartons",
      topActivities: ["Order Picking & Sorting", "Quality Inspection & Sealing"],
      recentTrend: [84, 88, 91, 87, 93, 95, 63.1],
    },
    {
      id: "team-c",
      name: "Team C — Charlie",
      code: "TM-C03",
      supervisorName: "Peter Ssemwogerere",
      primaryShift: "night",
      workersDeployed: 12,
      assignedWorkers: 12,
      targetQuantity: 200 * periodMultiplier,
      completedQuantity:
        period === "daily" ? 0 : Math.round(192 * periodMultiplier * scale),
      unit: "cartons",
      topActivities: ["Overnight Staging & Loading", "Container Verification"],
      recentTrend: [92, 95, 96, 94, 97, 96, 0],
    },
    {
      id: "team-d",
      name: "Team D — Delta (Flex)",
      code: "TM-D04",
      supervisorName: "Grace Atuhaire",
      primaryShift: "morning",
      workersDeployed: 10,
      assignedWorkers: 10,
      targetQuantity: 400 * periodMultiplier,
      completedQuantity: Math.round(415 * periodMultiplier * scale),
      unit: "cartons",
      topActivities: ["Returns Re-boxing", "Cold-Chain Labeling"],
      recentTrend: [95, 98, 102, 99, 104, 101, 103.8],
    },
  ];

  const teams: TeamPerformanceRecord[] = rawTeams.map((team) => {
    const completed = Math.max(0, team.completedQuantity);
    const pending = Math.max(0, team.targetQuantity - completed);
    const achievementRate = calculateAchievement(completed, team.targetQuantity);
    const outputPerWorker =
      team.workersDeployed > 0
        ? Math.round((completed / team.workersDeployed) * 10) / 10
        : 0;
    const status =
      achievementRate >= 98
        ? "exceeding"
        : achievementRate >= 70
          ? "on_track"
          : "needs_attention";

    return {
      ...team,
      completedQuantity: completed,
      pendingQuantity: pending,
      achievementRate,
      outputPerWorker,
      status,
    };
  });

  const totalTarget = teams.reduce((acc, t) => acc + t.targetQuantity, 0);
  const totalProduced = teams.reduce((acc, t) => acc + t.completedQuantity, 0);
  const totalWorkersDeployed = teams.reduce((acc, t) => acc + t.workersDeployed, 0);
  const topTeam = [...teams].sort((a, b) => b.achievementRate - a.achievementRate)[0];

  const periodLabel =
    period === "weekly"
      ? "Last 7 Days"
      : period === "monthly"
        ? "Current Month"
        : "Daily Snapshot";

  return {
    date,
    periodLabel,
    clientName: "Nile Beverage & Logistics Ltd.",
    isLiveData: false,
    summary: {
      activeTeams: teams.length,
      totalWorkersDeployed,
      totalTarget,
      totalProduced,
      averageAchievementRate: calculateAchievement(totalProduced, totalTarget),
      topTeamName: topTeam ? topTeam.name : "—",
      unit: "cartons",
    },
    teams,
  };
}

export async function getDailyPerformance(
  date: string = DEFAULT_PERFORMANCE_DATE
): Promise<DailyPerformanceData> {
  const remote = await apiGet<DailyPerformanceData>("/client/daily-performance", {
    date,
  });
  if (remote) {
    return { ...remote, isLiveData: true };
  }
  return buildMockDailyPerformance(date);
}

export async function getShiftPerformance(
  date: string = DEFAULT_PERFORMANCE_DATE
): Promise<ShiftPerformanceData> {
  const remote = await apiGet<ShiftPerformanceData>("/client/shift-performance", {
    date,
  });
  if (remote) {
    return { ...remote, isLiveData: true };
  }
  return buildMockShiftPerformance(date);
}

export async function getTeamPerformance(
  date: string = DEFAULT_PERFORMANCE_DATE,
  period: "daily" | "weekly" | "monthly" = "daily"
): Promise<TeamPerformanceData> {
  const remote = await apiGet<TeamPerformanceData>("/client/team-performance", {
    date,
    period,
  });
  if (remote) {
    return { ...remote, isLiveData: true };
  }
  return buildMockTeamPerformance(date, period);
}
