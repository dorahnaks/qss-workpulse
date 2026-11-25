"use client";

import "@/styles/portal-animations.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const PORTAL_HIGHLIGHTS = [
  "Live visibility into deployed workers and active teams",
  "Clear target vs. actual output monitoring across shifts",
  "Instant shift completion alerts and account management",
];

export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#F7F8FA]">
      {/* Left Brand Panel (Q-Sourcing Deep Navy + Gold Accent) */}
      <aside className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-[#0B2D4D] p-10 text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#F6BA16]" />

        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0056A7] text-sm font-bold text-white ring-1 ring-white/15">
              Q
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0B2D4D] bg-[#F6BA16]" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">
                Q-Sourcing WorkPulse
              </p>
              <p className="text-xs text-slate-300">Client Operations Portal</p>
            </div>
          </Link>

          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F6BA16]">
              Q-Sourcing Servtec
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white">
              Clear visibility into every shift and team delivering your work.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Monitor deployed headcount, verify agreed production targets, and
              stay ahead of pending tasks from one secure client portal.
            </p>

            <ul className="mt-8 space-y-3.5">
              {PORTAL_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-100"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F6BA16]/20 text-[#F6BA16]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.3a1 1 0 0 1-1.42 0l-3.25-3.27a1 1 0 1 1 1.42-1.41l2.54 2.556 6.54-6.584a1 1 0 0 1 1.414-.006Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-slate-300">
          <p>Q-Sourcing WorkPulse · Secured via Laravel API Authentication</p>
        </div>
      </aside>

      {/* Right Form Panel */}
      <main className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:col-span-7">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#0056A7] text-xs font-bold text-white">
              Q
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F6BA16]" />
            </div>
            <span className="text-sm font-bold text-[#0B2D4D]">
              Q-Sourcing WorkPulse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-[#0056A7]"
            >
              &larr; {t.common.backToHome}
            </Link>
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-10">{children}</div>

        <p className="text-center text-xs text-slate-400">
          Need portal access? Contact your Q-Sourcing Account Manager.
        </p>
      </main>
    </div>
  );
}
