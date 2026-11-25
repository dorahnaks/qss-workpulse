import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsManager } from "@/components/features/settings/SettingsManager";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description:
    "Manage your company information, client account profile, password, and alert settings.",
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading settings...
        </div>
      }
    >
      <SettingsManager />
    </Suspense>
  );
}
