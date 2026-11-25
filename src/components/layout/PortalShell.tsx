"use client";

import "@/styles/portal-animations.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { WorkPulseChatbot } from "@/components/features/assistant/WorkPulseChatbot";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { PORTAL_NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getNotifications } from "@/services/notifications.service";

function NavIcon({ href, active }: { href: string; active: boolean }) {
  const cls = `h-4 w-4 shrink-0 ${active ? "text-[#0056A7]" : "text-slate-400"}`;

  switch (href) {
    case "/dashboard":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "/daily-performance":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 3 3 5-6" />
        </svg>
      );
    case "/shift-performance":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "/team-performance":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "/work-activities":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "/reports":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h5" />
        </svg>
      );
    case "/notifications":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    const syncUnread = () => {
      getNotifications()
        .then((list) => {
          if (active) {
            setUnreadCount(list.filter((n) => !n.read).length);
          }
        })
        .catch(() => {
          // Ignore badge fetch errors
        });
    };

    syncUnread();
    window.addEventListener("qss:notifications-updated", syncUnread);
    return () => {
      active = false;
      window.removeEventListener("qss:notifications-updated", syncUnread);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#0056A7]" />
          <p className="text-sm font-medium text-slate-600">
            Loading Q-Sourcing WorkPulse...
          </p>
        </div>
      </div>
    );
  }

  const activeNav = PORTAL_NAV_ITEMS.find((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#212121]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#0B2D4D]/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all screen sizes */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-1 w-full bg-[#F6BA16]" />

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056A7] text-xs font-bold text-white">
              Q
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F6BA16]" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[#0B2D4D]">
                Q-Sourcing
              </p>
              <p className="text-[11px] font-medium text-[#0056A7]">
                WorkPulse Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Company Context Badge */}
        {company && (
          <div className="border-b border-slate-100 px-4 py-3">
            <Link
              href="/settings?tab=company"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl border border-slate-200/80 bg-[#F7F8FA] px-3 py-2.5 transition-colors hover:border-[#0056A7]/40"
            >
              <p className="truncate text-xs font-semibold text-[#0B2D4D]">
                {company.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                {company.accountCode}
              </p>
            </Link>
          </div>
        )}

        {/* Navigation Links - Scrollable independently */}
        <nav
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent px-3 py-4"
          aria-label="Portal Navigation"
        >
          <ul className="space-y-1">
            {PORTAL_NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isNotifications = item.href === "/notifications";

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#0056A7]/10 text-[#0056A7]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0B2D4D]"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-[#0056A7]" />
                    )}
                    <span className="flex items-center gap-3 truncate">
                      <NavIcon href={item.href} active={active} />
                      <span className="truncate">
                        {t.nav[item.href] ?? item.label}
                      </span>
                    </span>
                    {isNotifications && unreadCount > 0 && (
                      <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#F6BA16] px-1.5 py-0.5 text-[11px] font-bold text-[#0B2D4D]">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom User Card */}
        <div className="border-t border-slate-200 p-4">
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0056A7] text-xs font-bold text-white">
              {user?.avatarInitials ?? "QC"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#0B2D4D]">
                {user?.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {user?.email}
              </p>
            </div>
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-slate-200 bg-[#F7F8FA] px-2.5 py-1.5 text-center text-xs font-semibold text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-white"
            >
              {t.common.backToSite}
            </Link>
            <button
              type="button"
              disabled={signingOut}
              onClick={() => void handleLogout()}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#0B2D4D] disabled:opacity-60"
            >
              {signingOut ? t.common.signingOut : t.common.signOut}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Add left margin to account for fixed sidebar */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold text-[#0B2D4D]">
                {activeNav
                  ? (t.nav[activeNav.href] ?? activeNav.label)
                  : "Client Portal"}
              </h1>
              {company && (
                <p className="hidden text-xs text-slate-500 sm:block">
                  {company.siteLocation}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-slate-50 md:inline-flex"
            >
              <svg
                className="h-3.5 w-3.5 text-[#0056A7]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
              </svg>
              <span>{t.common.backToSite}</span>
            </Link>
            <LanguageSwitcher compact />
            <Link
              href="/notifications"
              className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:border-[#0056A7]/40 hover:bg-slate-50 hover:text-[#0056A7]"
              aria-label="Notifications"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F6BA16] px-1 text-[10px] font-bold text-[#0B2D4D]">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-slate-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0056A7] text-[11px] font-bold text-white">
                {user?.avatarInitials ?? "QC"}
              </span>
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating WorkPulse AI Assistant */}
      <WorkPulseChatbot />
    </div>
  );
}
