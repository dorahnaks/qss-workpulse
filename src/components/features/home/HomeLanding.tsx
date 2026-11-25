"use client";

import "@/styles/portal-animations.css";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { AUTH_ROUTES } from "@/config/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

const CAPABILITIES = [
  {
    title: "Real-Time Workforce Visibility",
    description:
      "See exactly how many Q-Sourcing workers are checked in on site across every scheduled shift.",
    icon: "users",
  },
  {
    title: "Targets vs. Actual Delivery",
    description:
      "Compare agreed production targets against verified output by shift, day, week, or month.",
    icon: "chart",
  },
  {
    title: "Direct Task Requests to Admin",
    description:
      "Submit additional work orders with priority, shift preference, and headcount for Q-Sourcing Admin team assignment.",
    icon: "task",
  },
  {
    title: "Instant Shift & Variance Alerts",
    description:
      "Receive timely notifications on completed shifts, milestone achievements, and output variances.",
    icon: "bell",
  },
  {
    title: "Multilingual & Voice Dictation",
    description:
      "Switch seamlessly across English, Kiswahili, French, and Kinyarwanda with built-in voice input.",
    icon: "globe",
  },
  {
    title: "AI Operations Assistant",
    description:
      "Ask instant questions about deployed headcount, underperforming shifts, or pending requests.",
    icon: "spark",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Sign In to Portal",
    description:
      "Access your organization's dedicated workspace with secure client credentials.",
  },
  {
    step: "02",
    title: "Monitor Teams & Request Tasks",
    description:
      "Track live shift performance and submit new work requests directly to Q-Sourcing Admin.",
  },
  {
    step: "03",
    title: "Verify Agreed Delivery",
    description:
      "Review real-time target achievement, alerts, and team output across all active shifts.",
  },
];

function FeatureIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-[#0056A7]";
  switch (type) {
    case "users":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "chart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 3v18h18" />
          <rect x="7" y="10" width="3" height="7" rx="1" />
          <rect x="12" y="6" width="3" height="11" rx="1" />
          <rect x="17" y="12" width="3" height="5" rx="1" />
        </svg>
      );
    case "task":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "bell":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "globe":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
        </svg>
      );
  }
}

function HomeLandingContent() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#212121]">
      {/* Brand Gold Accent Strip */}
      <div className="h-1 w-full bg-[#F6BA16]" />

      {/* Sticky Glassmorphic Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0056A7] text-sm font-bold text-white shadow-2xs">
              Q
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#F6BA16]" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[#0B2D4D]">
                Q-Sourcing{" "}
                <span className="font-medium text-[#0056A7]">WorkPulse</span>
              </p>
              <p className="text-[11px] text-slate-500">{t.brandSubtitle}</p>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-xs font-semibold text-slate-600 md:flex"
          >
            <a
              href="#features"
              className="transition-colors hover:text-[#0056A7]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#0056A7]"
            >
              How It Works
            </a>
            <a
              href="#support"
              className="transition-colors hover:text-[#0056A7]"
            >
              Support
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0056A7] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#004485]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F6BA16] text-[10px] font-bold text-[#0B2D4D]">
                  {user?.avatarInitials ?? "Q"}
                </span>
                <span>{t.common.openPortal}</span>
              </Link>
            ) : (
              <Link
                href={AUTH_ROUTES.login}
                className="rounded-lg bg-[#0056A7] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#004485]"
              >
                {t.common.signInToPortal}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-14 pt-12 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="qss-animate-fade-up lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0056A7]/20 bg-white px-3.5 py-1 text-xs font-semibold text-[#0056A7] shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#F6BA16]" />
                {t.home.badge}
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#0B2D4D] sm:text-4xl lg:text-[42px]">
                {t.home.headline}
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                {t.home.subheadline}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={isAuthenticated ? "/dashboard" : AUTH_ROUTES.login}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0056A7] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#004485]"
                >
                  <span>
                    {isAuthenticated
                      ? t.common.openPortal
                      : t.common.signInToPortal}
                  </span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <a
                  href="#features"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0B2D4D] transition-all hover:border-[#0056A7]/40 hover:bg-slate-50"
                >
                  {t.home.secondaryCta}
                </a>
              </div>

              {/* Regional Trust Bar */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-[#0B2D4D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  24/7 Shift Monitoring
                </span>
                <span>·</span>
                <span>Uganda · Kenya · Tanzania · Rwanda</span>
                <span>·</span>
                <span>Verified Supervisor Sign-Offs</span>
              </div>
            </div>

            {/* Right Live Operations Preview Card */}
            <div className="qss-animate-fade-up qss-stagger-2 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-[#0B2D4D]">
                      Live Operations Snapshot
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Daily Shift Delivery Overview
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                {/* Mini Metrics Row */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F7F8FA] p-3.5">
                    <p className="text-[11px] font-medium text-slate-500">
                      Target Achievement
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0056A7]">
                      96.6%
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-emerald-600">
                      +2.4% vs yesterday
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F7F8FA] p-3.5">
                    <p className="text-[11px] font-medium text-slate-500">
                      Staff Deployed
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0B2D4D]">
                      118
                      <span className="text-xs font-normal text-slate-400">
                        {" "}
                        / 124
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      6 active teams
                    </p>
                  </div>
                </div>

                {/* Mini Shift Bars */}
                <div className="mt-5 space-y-3">
                  {[
                    {
                      name: "Morning Shift",
                      pct: 103,
                      units: "1,910 / 1,850 cartons",
                      color: "bg-emerald-500",
                    },
                    {
                      name: "Afternoon Shift",
                      pct: 96,
                      units: "1,585 / 1,650 cartons",
                      color: "bg-[#0056A7]",
                    },
                    {
                      name: "Night Shift",
                      pct: 88,
                      units: "1,140 / 1,300 cartons",
                      color: "bg-[#F6BA16]",
                    },
                  ].map((shift) => (
                    <div key={shift.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#0B2D4D]">
                          {shift.name}
                        </span>
                        <span className="text-slate-500">{shift.units}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${shift.color} transition-all duration-700`}
                          style={{ width: `${Math.min(shift.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Footer */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-[#0B2D4D] px-4 py-3 text-xs text-white">
                  <span>Need extra hands on a bay?</span>
                  <Link
                    href={isAuthenticated ? "/dashboard" : AUTH_ROUTES.login}
                    className="font-semibold text-[#F6BA16] hover:underline"
                  >
                    Request Task &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section
          id="features"
          className="border-y border-slate-200 bg-white py-16"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0056A7]">
                Client Capabilities
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B2D4D]">
                {t.home.modulesTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {t.home.modulesSubtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`qss-card-lift qss-animate-fade-up rounded-2xl border border-slate-200 bg-[#F7F8FA]/60 p-6 hover:border-[#0056A7]/40 hover:bg-white hover:shadow-xs qss-stagger-${(index % 4) + 1}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0056A7]/10">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#0B2D4D]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0056A7]">
              Simple Workflow
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B2D4D]">
              {t.home.architectureTitle}
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="qss-card-lift rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6BA16] text-xs font-bold text-[#0B2D4D]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-[#0B2D4D]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section id="support" className="mx-auto max-w-6xl px-6 pb-16">
          <div className="relative overflow-hidden rounded-2xl bg-[#0B2D4D] p-8 text-white sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#F6BA16]" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Ready to monitor your Q-Sourcing teams?
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Sign in to view today&apos;s shift output, submit additional
                  task requests, or manage your organization settings.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link
                  href={isAuthenticated ? "/dashboard" : AUTH_ROUTES.login}
                  className="rounded-xl bg-[#F6BA16] px-5 py-3 text-sm font-bold text-[#0B2D4D] transition-colors hover:bg-[#E09900]"
                >
                  {isAuthenticated
                    ? t.common.openPortal
                    : t.common.signInToPortal}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Standard Corporate Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row">
          <p className="font-semibold text-[#0B2D4D]">
            Q-Sourcing Servtec · WorkPulse
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={AUTH_ROUTES.login}
              className="hover:text-[#0056A7] transition-colors"
            >
              {t.common.signInToPortal}
            </Link>
            <Link
              href={AUTH_ROUTES.forgotPassword}
              className="hover:text-[#0056A7] transition-colors"
            >
              {t.home.resetPasswordLink}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function HomeLanding() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HomeLandingContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
