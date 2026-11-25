import type { TeamPerformanceData } from "@/types/team-performance";

export async function getTeamPerformance(): Promise<TeamPerformanceData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    teams: [
      {
        id: "team-alpha",
        teamName: "Team Alpha",
        supervisor: "Sarah Kimani",
        workersDeployed: 12,
        workersScheduled: 12,
        shift: "Morning",
        targetOutput: 400,
        actualOutput: 450,
        achievementRate: 112.5,
        productivityScore: 95,
        status: "Exceeding",
      },
      {
        id: "team-bravo",
        teamName: "Team Bravo",
        supervisor: "John Omondi",
        workersDeployed: 10,
        workersScheduled: 10,
        shift: "Morning",
        targetOutput: 400,
        actualOutput: 400,
        achievementRate: 100,
        productivityScore: 90,
        status: "On Track",
      },
      {
        id: "team-charlie",
        teamName: "Team Charlie",
        supervisor: "Grace Wanjiru",
        workersDeployed: 8,
        workersScheduled: 10,
        shift: "Afternoon",
        targetOutput: 400,
        actualOutput: 350,
        achievementRate: 87.5,
        productivityScore: 78,
        status: "Needs Attention",
      },
      {
        id: "team-delta",
        teamName: "Team Delta",
        supervisor: "Peter Mwangi",
        workersDeployed: 7,
        workersScheduled: 8,
        shift: "Afternoon",
        targetOutput: 400,
        actualOutput: 350,
        achievementRate: 87.5,
        productivityScore: 82,
        status: "On Track",
      },
      {
        id: "team-echo",
        teamName: "Team Echo",
        supervisor: "Mary Akinyi",
        workersDeployed: 5,
        workersScheduled: 5,
        shift: "Night",
        targetOutput: 400,
        actualOutput: 200,
        achievementRate: 50,
        productivityScore: 60,
        status: "Needs Attention",
      },
    ],
    productivityHistory: [
      {
        teamId: "team-alpha",
        teamName: "Team Alpha",
        history: [
          { date: "Mon", output: 420, target: 400, achievementRate: 105 },
          { date: "Tue", output: 440, target: 400, achievementRate: 110 },
          { date: "Wed", output: 430, target: 400, achievementRate: 107.5 },
          { date: "Thu", output: 450, target: 400, achievementRate: 112.5 },
          { date: "Fri", output: 450, target: 400, achievementRate: 112.5 },
        ],
      },
      {
        teamId: "team-bravo",
        teamName: "Team Bravo",
        history: [
          { date: "Mon", output: 390, target: 400, achievementRate: 97.5 },
          { date: "Tue", output: 410, target: 400, achievementRate: 102.5 },
          { date: "Wed", output: 400, target: 400, achievementRate: 100 },
          { date: "Thu", output: 405, target: 400, achievementRate: 101.25 },
          { date: "Fri", output: 400, target: 400, achievementRate: 100 },
        ],
      },
    ],
  };
}
