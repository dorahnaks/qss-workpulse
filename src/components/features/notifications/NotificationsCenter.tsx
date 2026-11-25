"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { useLanguage } from "@/context/LanguageContext";
import {
  dismissNotification,
  getNotifications,
  markAllNotificationsAsRead,
  restoreDemoNotifications,
  setNotificationReadState,
} from "@/services/notifications.service";
import type {
  NotificationCategory,
  NotificationItem,
} from "@/types/notifications";

type FilterValue = "all" | "unread" | NotificationCategory;

function getCategoryStyle(category: NotificationCategory): string {
  switch (category) {
    case "production":
      return "bg-[#F6BA16]/25 text-[#8A5D00] ring-1 ring-[#F6BA16]/50";
    case "shift":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "performance":
      return "bg-[#0056A7]/10 text-[#0056A7] ring-1 ring-[#0056A7]/20";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

function getSeverityBorder(severity: NotificationItem["severity"]): string {
  switch (severity) {
    case "success":
      return "border-l-emerald-500";
    case "warning":
      return "border-l-[#F6BA16]";
    default:
      return "border-l-[#0056A7]";
  }
}

export function NotificationsCenter() {
  const { t } = useLanguage();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [busyAll, setBusyAll] = useState(false);

  const filterTabs: { value: FilterValue; label: string }[] = [
    { value: "all", label: t.notifications.allUpdates },
    { value: "unread", label: t.notifications.unread },
    { value: "production", label: t.notifications.production },
    { value: "shift", label: t.notifications.shifts },
    { value: "performance", label: t.notifications.performance },
  ];

  const notifyBadgeSync = () => {
    window.dispatchEvent(new Event("qss:notifications-updated"));
  };

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((data) => {
        if (active) setItems(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "unread" && item.read) return false;
      if (
        filter !== "all" &&
        filter !== "unread" &&
        item.category !== filter
      ) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.message.toLowerCase().includes(normalizedQuery) ||
        (item.teamName?.toLowerCase().includes(normalizedQuery) ?? false) ||
        (item.shiftName?.toLowerCase().includes(normalizedQuery) ?? false)
      );
    });
  }, [items, filter, query]);

  const handleToggleRead = async (id: string, nextRead: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: nextRead } : item))
    );
    await setNotificationReadState(id, nextRead);
    notifyBadgeSync();
  };

  const handleMarkAllRead = async () => {
    setBusyAll(true);
    try {
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
      await markAllNotificationsAsRead();
      notifyBadgeSync();
    } finally {
      setBusyAll(false);
    }
  };

  const handleDismiss = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await dismissNotification(id);
    notifyBadgeSync();
  };

  const handleRestoreDemo = async () => {
    const restored = await restoreDemoNotifications();
    setItems(restored);
    setFilter("all");
    setQuery("");
    notifyBadgeSync();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className="absolute inset-y-0 left-0 w-1 bg-[#0056A7]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-semibold text-[#0B2D4D]">
                {t.notifications.title}
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#F6BA16] px-2.5 py-0.5 text-xs font-bold text-[#0B2D4D]">
                  {unreadCount} {t.notifications.unread}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {t.notifications.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              disabled={unreadCount === 0 || busyAll}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.notifications.markAllRead}
            </button>
            <Link
              href="/settings?tab=notifications"
              className="rounded-lg bg-[#0056A7] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004485]"
            >
              {t.notifications.alertPreferences}
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Search with Voice Dictate */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === tab.value
                  ? "bg-[#0056A7] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#0B2D4D]"
              }`}
            >
              {tab.label}
              {tab.value === "unread" && unreadCount > 0
                ? ` (${unreadCount})`
                : ""}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 sm:w-72">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.notifications.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <DictateButton
            ariaLabel="Dictate notification search"
            onResult={(spoken) => setQuery(spoken)}
          />
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-28 rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-[#0B2D4D]">
            {t.notifications.emptyTitle}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {t.notifications.emptySubtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {(filter !== "all" || query) && (
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B2D4D] hover:bg-slate-50"
              >
                {t.notifications.showAll}
              </button>
            )}
            {items.length === 0 && (
              <button
                type="button"
                onClick={() => void handleRestoreDemo()}
                className="rounded-lg bg-[#0056A7] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#004485]"
              >
                {t.notifications.restoreDemo}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border border-slate-200 border-l-4 ${getSeverityBorder(
                item.severity
              )} p-5 transition-colors ${
                item.read ? "bg-white" : "bg-[#0056A7]/[0.03]"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {!item.read && (
                      <span
                        className="h-2 w-2 rounded-full bg-[#F6BA16]"
                        title="Unread"
                      />
                    )}
                    <h3 className="text-sm font-semibold text-[#0B2D4D]">
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${getCategoryStyle(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    {item.metricBadge && (
                      <span className="rounded-md bg-[#F7F8FA] px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">
                        {item.metricBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>{item.relativeTime}</span>
                    {item.teamName && <span>· Team: {item.teamName}</span>}
                    {item.shiftName && <span>· {item.shiftName}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleRead(item.id, !item.read)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      item.read
                        ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "border border-[#0056A7]/30 bg-white text-[#0056A7] hover:bg-[#0056A7]/5"
                    }`}
                  >
                    {item.read
                      ? t.notifications.markUnread
                      : t.notifications.markRead}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDismiss(item.id)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    {t.notifications.dismiss}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
