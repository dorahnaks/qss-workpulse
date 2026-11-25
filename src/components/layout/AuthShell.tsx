"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const PORTAL_HIGHLIGHTS = [
  "Live visibility into deployed workers and active teams",
  "Daily target vs. actual production tracking across shifts",
  "Instant shift completion alerts and downloadable reports",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50">
      {/* Left Brand Panel */}
      <aside className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-900 p-10 text-white">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white shadow-sm">
              QP
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                QSS WorkPulse
              </p>
              <p className="text-xs text-slate-400">Client Operations Portal</p>
            </div>
          </Link>

          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Real-Time Workforce Delivery
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white">
              Transparent performance monitoring for your assigned QSS teams.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Track shift progress, verify agreed production targets, and stay
              informed on pending work from one secure client portal.
            </p>

            <ul className="mt-8 space-y-3.5">
              {PORTAL_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
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

        <div className="border-t border-slate-800 pt-6 text-xs text-slate-400">
          <p>QSS Client Portal · Secured via Laravel API Authentication</p>
        </div>
      </aside>

      {/* Right Auth Form Panel */}
      <main className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:col-span-7">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              QP
            </div>
            <span className="text-sm font-semibold text-slate-900">
              QSS WorkPulse
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            &larr; Back to Home
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-10">{children}</div>

        <p className="text-center text-xs text-slate-400">
          Need portal access? Contact your QSS Account Manager.
        </p>
      </main>
    </div>
  );
}
