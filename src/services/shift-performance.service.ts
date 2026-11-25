import type { ShiftPerformanceData } from "@/types/shift-performance";

export async function getShiftPerformance(date?: string): Promise<ShiftPerformanceData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const targetDate = date ?? new Date().toISOString().split("T")[0];

  return {
    date: targetDate,
    shifts: [
      {
        id: "morning-shift",
        shift: "Morning",
        date: targetDate,
        startTime: "06:00",
        endTime: "14:00",
        supervisor: "Sarah Kimani",
        teamsAssigned: 3,
        workersDeployed: 25,
        targetOutput: 800,
        actualOutput: 850,
        achievementRate: 106.25,
        status: "Exceeding",
      },
      {
        id: "afternoon-shift",
        shift: "Afternoon",
        date: targetDate,
        startTime: "14:00",
        endTime: "22:00",
        supervisor: "John Omondi",
        teamsAssigned: 2,
        workersDeployed: 15,
        targetOutput: 800,
        actualOutput: 700,
        achievementRate: 87.5,
        status: "On Track",
      },
      {
        id: "night-shift",
        shift: "Night",
        date: targetDate,
        startTime: "22:00",
        endTime: "06:00",
        supervisor: "Grace Wanjiru",
        teamsAssigned: 1,
        workersDeployed: 5,
        targetOutput: 400,
        actualOutput: 200,
        achievementRate: 50,
        status: "Below Target",
      },
    ],
    comparison: [
      {
        shift: "Morning",
        production: 850,
        target: 800,
        achievementRate: 106.25,
        workersDeployed: 25,
      },
      {
        shift: "Afternoon",
        production: 700,
        target: 800,
        achievementRate: 87.5,
        workersDeployed: 15,
      },
      {
        shift: "Night",
        production: 200,
        target: 400,
        achievementRate: 50,
        workersDeployed: 5,
      },
    ],
  };
}
