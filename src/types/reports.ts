export interface ReportMetadata {
  id: string;
  title: string;
  type: "Daily" | "Weekly" | "Monthly";
  generatedDate: string;
  reportPeriod: string;
  format: "PDF" | "Excel";
  fileSize: string;
}

export interface ProductionTrend {
  period: string;
  target: number;
  actual: number;
  achievementRate: number;
}

export interface ShiftComparisonData {
  shift: string;
  production: number;
  target: number;
  percentage: number;
}

export interface TeamPerformanceChart {
  teamName: string;
  output: number;
  target: number;
  achievementRate: number;
}

export interface ReportsData {
  availableReports: ReportMetadata[];
  productionTrends: ProductionTrend[];
  shiftComparison: ShiftComparisonData[];
  teamPerformance: TeamPerformanceChart[];
}
