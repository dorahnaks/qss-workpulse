"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  updateAccountPassword,
  updateAccountProfile,
  updateCompanyProfile,
} from "@/services/settings.service";
import type {
  CompanyFormValues,
  NotificationPreferences,
  PasswordFormValues,
  ProfileFormValues,
} from "@/types/settings";

type SettingsTab = "profile" | "company" | "security" | "notifications";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Account Profile" },
  { id: "company", label: "Company Details" },
  { id: "security", label: "Security & Password" },
  { id: "notifications", label: "Alert Preferences" },
];

const TIMEZONES = [
  "Africa/Nairobi",
  "UTC",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "Asia/Dubai",
];

export function SettingsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, company, updateUserState, updateCompanyState, logout } =
    useAuth();

  const tabFromUrl = searchParams.get("tab") as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    tabFromUrl && TABS.some((t) => t.id === tabFromUrl)
      ? tabFromUrl
      : "profile"
  );

  const [profileForm, setProfileForm] = useState<ProfileFormValues>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    jobTitle: user?.jobTitle ?? "",
    phone: user?.phone ?? "",
    timezone: user?.timezone ?? "Africa/Nairobi",
  });

  const [companyForm, setCompanyForm] = useState<CompanyFormValues>({
    name: company?.name ?? "",
    industry: company?.industry ?? "",
    siteLocation: company?.siteLocation ?? "",
    contactEmail: company?.contactEmail ?? "",
    contactPhone: company?.contactPhone ?? "",
    address: company?.address ?? "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    productionTargetAlerts: true,
    shiftCompletionUpdates: true,
    teamPerformanceDigests: true,
    lowOutputWarnings: true,
    emailDelivery: true,
    inAppDelivery: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    getNotificationPreferences().then((loaded) => {
      if (active) setPrefs(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  const switchTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    setFeedback(null);
  };

  const handleProfileSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await updateAccountProfile(profileForm);
      updateUserState(updated);
      setFeedback({
        type: "success",
        message: "Account profile updated successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof ApiError
            ? err.message
            : "Could not save profile changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCompanySave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await updateCompanyProfile(companyForm);
      updateCompanyState(updated);
      setFeedback({
        type: "success",
        message: "Company information updated successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof ApiError
            ? err.message
            : "Could not save company information.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const result = await updateAccountPassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFeedback({ type: "success", message: result.message });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof ApiError
            ? err.message
            : "Unable to update password right now.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrefsSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await saveNotificationPreferences(prefs);
      setPrefs(saved);
      setFeedback({
        type: "success",
        message: "Notification preferences saved.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Unable to save notification preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Profile & Settings
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage your client account details, company site information, password
          security, and alert preferences.
        </p>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tab 1: Account Profile */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSave}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
              {user?.avatarInitials ?? "QC"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role} · Last login: {user?.lastLoginAt}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-semibold text-slate-700"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-slate-700"
              >
                Work Email
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-job"
                className="block text-xs font-semibold text-slate-700"
              >
                Job Title
              </label>
              <input
                id="profile-job"
                type="text"
                value={profileForm.jobTitle}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, jobTitle: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block text-xs font-semibold text-slate-700"
              >
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="profile-tz"
                className="block text-xs font-semibold text-slate-700"
              >
                Reporting Timezone
              </label>
              <select
                id="profile-tz"
                value={profileForm.timezone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, timezone: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Company Information */}
      {activeTab === "company" && (
        <form
          onSubmit={handleCompanySave}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Organization Profile
              </h3>
              <p className="text-xs text-slate-500">
                Client account code:{" "}
                <span className="font-mono font-semibold text-slate-700">
                  {company?.accountCode}
                </span>
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Contract: {company?.contractStatus ?? "Active"}
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="company-name"
                className="block text-xs font-semibold text-slate-700"
              >
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyForm.name}
                onChange={(e) =>
                  setCompanyForm((c) => ({ ...c, name: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-industry"
                className="block text-xs font-semibold text-slate-700"
              >
                Industry
              </label>
              <input
                id="company-industry"
                type="text"
                value={companyForm.industry}
                onChange={(e) =>
                  setCompanyForm((c) => ({ ...c, industry: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-site"
                className="block text-xs font-semibold text-slate-700"
              >
                Primary Operations Site
              </label>
              <input
                id="company-site"
                type="text"
                value={companyForm.siteLocation}
                onChange={(e) =>
                  setCompanyForm((c) => ({
                    ...c,
                    siteLocation: e.target.value,
                  }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-email"
                className="block text-xs font-semibold text-slate-700"
              >
                Operations Contact Email
              </label>
              <input
                id="company-email"
                type="email"
                value={companyForm.contactEmail}
                onChange={(e) =>
                  setCompanyForm((c) => ({
                    ...c,
                    contactEmail: e.target.value,
                  }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-phone"
                className="block text-xs font-semibold text-slate-700"
              >
                Operations Phone
              </label>
              <input
                id="company-phone"
                type="tel"
                value={companyForm.contactPhone}
                onChange={(e) =>
                  setCompanyForm((c) => ({
                    ...c,
                    contactPhone: e.target.value,
                  }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-address"
                className="block text-xs font-semibold text-slate-700"
              >
                Physical Address
              </label>
              <input
                id="company-address"
                type="text"
                value={companyForm.address}
                onChange={(e) =>
                  setCompanyForm((c) => ({ ...c, address: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Company Details"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form
            onSubmit={handlePasswordSave}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Change Password
              </h3>
              <p className="text-xs text-slate-500">
                Use a strong password with at least 8 characters to keep your
                portal account secure.
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Active Session
              </h3>
              <p className="text-xs text-slate-500">
                Signed in as {user?.email} ({user?.lastLoginAt})
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              Sign out of this device
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notification Preferences */}
      {activeTab === "notifications" && (
        <form
          onSubmit={handlePrefsSave}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Choose which production, shift, and team performance updates you
              want to receive.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                key: "productionTargetAlerts" as const,
                title: "Production target updates",
                desc: "Alerts when daily or shift production targets are met or exceeded.",
              },
              {
                key: "shiftCompletionUpdates" as const,
                title: "Completed shift summaries",
                desc: "Receive sign-off updates as each morning, afternoon, or night shift ends.",
              },
              {
                key: "teamPerformanceDigests" as const,
                title: "Team performance digests",
                desc: "Weekly summary comparing performance across all assigned teams.",
              },
              {
                key: "lowOutputWarnings" as const,
                title: "Output variance warnings",
                desc: "Immediate notice when a team falls behind agreed production targets.",
              },
              {
                key: "emailDelivery" as const,
                title: "Email notifications",
                desc: `Send copies of critical alerts to ${user?.email ?? "your work email"}.`,
              },
              {
                key: "inAppDelivery" as const,
                title: "In-portal notifications",
                desc: "Show live updates inside the Notifications center and header badge.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 py-3.5 cursor-pointer"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[item.key]}
                  onChange={(e) =>
                    setPrefs((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Alert Preferences"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
