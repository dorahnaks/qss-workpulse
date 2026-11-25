"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  dismissNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notifications.service";
import type {
  NotificationCategory,
  NotificationItem,
} from "@/types/notifications";

type FilterValue = "all" | "unread" | NotificationCategory;

const FILTER_TABS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All Updates" },
  { value: "unread", label: "Unread" },
  { value: "production", label: "Production" },
  { value: "shift", label: "Shifts" },
  { value: "performance", label: "Performance" },
];

function getCategoryStyle(category: NotificationCategory): string {
  switch (category) {
    case "production":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "shift":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "performance":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

function getSeverityBorder(severity: NotificationItem["severity"]): string {
  switch (severity) {
    case "success":
      return "border-l-emerald-500";
    case "warning":
      return "border-l-amber-500";
    default:
      return "border-l-indigo-500";
  }
}

export function NotificationsCenter() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [busyAll, setBusyAll] = useState(false);

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

  const handleMarkRead = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    await markNotificationAsRead(id);
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-slate-900">
              Notifications & Alerts
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Stay updated on production milestones, completed shifts, and team
            performance variances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={unreadCount === 0 || busyAll}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all as read
          </button>
          <Link
            href="/settings?tab=notifications"
            className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Alert Preferences
          </Link>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === tab.value
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {tab.value === "unread" && unreadCount > 0
                ? ` (${unreadCount})`
                : ""}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, shifts, alerts..."
            className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
          <p className="text-sm font-semibold text-slate-900">
            No notifications match this filter
          </p>
          <p className="mt-1 text-xs text-slate-500">
            You&apos;re all caught up on production, shift, and team performance
            updates.
          </p>
          {filter !== "all" && (
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
              className="mt-4 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Show all updates
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border border-slate-200 border-l-4 ${getSeverityBorder(
                item.severity
              )} p-5 transition-colors ${
                item.read ? "bg-white" : "bg-indigo-50/35"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {!item.read && (
                      <span
                        className="h-2 w-2 rounded-full bg-indigo-600"
                        title="Unread"
                      />
                    )}
                    <h3 className="text-sm font-semibold text-slate-900">
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
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
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
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => void handleMarkRead(item.id)}
                      className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleDismiss(item.id)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  >
                    Dismiss
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
