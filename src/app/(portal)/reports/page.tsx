import type { Metadata } from "next";
import { ReportsView } from "@/components/features/reports/ReportsView";

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description:
    "View daily, weekly, and monthly production reports with analytics and downloadable exports.",
};

export default function ReportsPage() {
  return <ReportsView />;
}
