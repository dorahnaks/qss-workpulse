import type { ReportsData } from "@/types/reports";

export async function getReportsData(): Promise<ReportsData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    availableReports: [
      {
        id: "report-daily-1",
        title: "Daily Production Report - January 18, 2024",
        type: "Daily",
        generatedDate: "2024-01-18T17:30:00Z",
        reportPeriod: "January 18, 2024",
        format: "PDF",
        fileSize: "2.4 MB",
      },
      {
        id: "report-daily-2",
        title: "Daily Production Report - January 17, 2024",
        type: "Daily",
        generatedDate: "2024-01-17T17:30:00Z",
        reportPeriod: "January 17, 2024",
        format: "Excel",
        fileSize: "1.8 MB",
      },
      {
        id: "report-weekly-1",
        title: "Weekly Performance Report - Week 3, January 2024",
        type: "Weekly",
        generatedDate: "2024-01-19T09:00:00Z",
        reportPeriod: "January 15-19, 2024",
        format: "PDF",
        fileSize: "5.2 MB",
      },
      {
        id: "report-weekly-2",
        title: "Weekly Performance Report - Week 2, January 2024",
        type: "Weekly",
        generatedDate: "2024-01-12T09:00:00Z",
        reportPeriod: "January 8-12, 2024",
        format: "Excel",
        fileSize: "4.1 MB",
      },
      {
        id: "report-monthly-1",
        title: "Monthly Performance Report - December 2023",
        type: "Monthly",
        generatedDate: "2024-01-02T10:00:00Z",
        reportPeriod: "December 2023",
        format: "PDF",
        fileSize: "12.8 MB",
      },
      {
        id: "report-monthly-2",
        title: "Monthly Performance Report - November 2023",
        type: "Monthly",
        generatedDate: "2023-12-02T10:00:00Z",
        reportPeriod: "November 2023",
        format: "Excel",
        fileSize: "10.5 MB",
      },
    ],
    productionTrends: [
      { period: "Week 1", target: 10000, actual: 9200, achievementRate: 92 },
      { period: "Week 2", target: 10000, actual: 9800, achievementRate: 98 },
      { period: "Week 3", target: 10000, actual: 10500, achievementRate: 105 },
      { period: "Week 4", target: 10000, actual: 9500, achievementRate: 95 },
    ],
    shiftComparison: [
      { shift: "Morning", production: 850, target: 800, percentage: 106 },
      { shift: "Afternoon", production: 700, target: 800, percentage: 88 },
      { shift: "Night", production: 200, target: 400, percentage: 50 },
    ],
    teamPerformance: [
      { teamName: "Team Alpha", output: 450, target: 400, achievementRate: 112.5 },
      { teamName: "Team Bravo", output: 400, target: 400, achievementRate: 100 },
      { teamName: "Team Charlie", output: 350, target: 400, achievementRate: 87.5 },
      { teamName: "Team Delta", output: 350, target: 400, achievementRate: 87.5 },
      { teamName: "Team Echo", output: 200, target: 400, achievementRate: 50 },
    ],
  };
}

export async function downloadReport(reportId: string, format: "PDF" | "Excel"): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Downloading report ${reportId} in ${format} format`);
}
