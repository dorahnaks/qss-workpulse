"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
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

const DEFAULT_PREFS: NotificationPreferences = {
  productionTargetAlerts: true,
  shiftCompletionUpdates: true,
  teamPerformanceDigests: true,
  lowOutputWarnings: true,
  emailDelivery: true,
  inAppDelivery: true,
};

const TIMEZONES = [
  "Africa/Nairobi",
  "Africa/Kampala",
  "Africa/Kigali",
  "Africa/Dar_es_Salaam",
  "UTC",
  "Europe/London",
];

export function SettingsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, company, updateUserState, updateCompanyState, logout } =
    useAuth();
  const { t } = useLanguage();

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: t.settings.tabProfile },
    { id: "company", label: t.settings.tabCompany },
    { id: "security", label: t.settings.tabSecurity },
    { id: "notifications", label: t.settings.tabNotifications },
  ];

  const tabFromUrl = searchParams.get("tab") as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    tabFromUrl &&
      ["profile", "company", "security", "notifications"].includes(tabFromUrl)
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
  const [showPasswords, setShowPasswords] = useState(false);

  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
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
    router.replace(`/settings?tab=${tab}`, { scroll: false });
  };

  const resetProfileForm = () => {
    if (!user) return;
    setProfileForm({
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      phone: user.phone,
      timezone: user.timezone,
    });
    setFeedback(null);
  };

  const resetCompanyForm = () => {
    if (!company) return;
    setCompanyForm({
      name: company.name,
      industry: company.industry,
      siteLocation: company.siteLocation,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      address: company.address,
    });
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
      {/* Header & Tabs */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className="absolute inset-y-0 left-0 w-1 bg-[#0056A7]" />
        <h2 className="text-xl font-semibold text-[#0B2D4D]">
          {t.settings.title}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.settings.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0056A7] text-white"
                  : "bg-[#F7F8FA] text-slate-600 hover:bg-slate-200/70 hover:text-[#0B2D4D]"
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
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab 1: Account Profile */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSave}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0056A7] text-base font-bold text-white ring-2 ring-[#F6BA16]/60">
              {user?.avatarInitials ?? "QC"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0B2D4D]">
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-job"
                className="block text-xs font-semibold text-slate-700"
              >
                Job Title
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id="profile-job"
                  type="text"
                  value={profileForm.jobTitle}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, jobTitle: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
                />
                <DictateButton
                  size="md"
                  ariaLabel="Dictate job title"
                  onResult={(spoken) =>
                    setProfileForm((p) => ({ ...p, jobTitle: spoken }))
                  }
                />
              </div>
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={resetProfileForm}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.common.reset}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#0056A7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004485] disabled:opacity-60"
            >
              {saving ? t.common.saving : t.settings.saveProfile}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Company Information */}
      {activeTab === "company" && (
        <form
          onSubmit={handleCompanySave}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0B2D4D]">
                Organization Profile
              </h3>
              <p className="text-xs text-slate-500">
                Client account code:{" "}
                <span className="font-mono font-semibold text-[#0056A7]">
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
              />
            </div>

            <div>
              <label
                htmlFor="company-address"
                className="block text-xs font-semibold text-slate-700"
              >
                Physical Address
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id="company-address"
                  type="text"
                  value={companyForm.address}
                  onChange={(e) =>
                    setCompanyForm((c) => ({ ...c, address: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
                />
                <DictateButton
                  size="md"
                  ariaLabel="Dictate physical address"
                  onResult={(spoken) =>
                    setCompanyForm((c) => ({ ...c, address: spoken }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={resetCompanyForm}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.common.reset}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#0056A7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004485] disabled:opacity-60"
            >
              {saving ? t.common.saving : t.settings.saveCompany}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form
            onSubmit={handlePasswordSave}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#0B2D4D]">
                  Change Password
                </h3>
                <p className="text-xs text-slate-500">
                  Use a strong password with at least 8 characters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => !prev)}
                className="text-xs font-semibold text-[#0056A7] hover:text-[#004485]"
              >
                {showPasswords ? t.auth.hide : t.auth.show}
              </button>
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
                  type={showPasswords ? "text" : "password"}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                  type={showPasswords ? "text" : "password"}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
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
                  type={showPasswords ? "text" : "password"}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#0056A7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004485] disabled:opacity-60"
              >
                {saving ? t.common.saving : t.settings.updatePassword}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#0B2D4D]">
                {t.settings.activeSession}
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
              {t.settings.signOutDevice}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notification Preferences */}
      {activeTab === "notifications" && (
        <form
          onSubmit={handlePrefsSave}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div>
            <h3 className="text-sm font-semibold text-[#0B2D4D]">
              {t.settings.tabNotifications}
            </h3>
            <p className="text-xs text-slate-500">
              Choose which production, shift, and team performance updates you
              receive.
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
            ].map((item) => {
              const enabled = prefs[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#0B2D4D]">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={item.title}
                    onClick={() =>
                      setPrefs((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                      enabled ? "bg-[#0056A7]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform mt-0.5 ${
                        enabled ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setPrefs(DEFAULT_PREFS);
                setFeedback(null);
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.settings.resetDefaults}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#0056A7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004485] disabled:opacity-60"
            >
              {saving ? t.common.saving : t.settings.savePrefs}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
