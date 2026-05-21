"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, Clock, Users, Sparkles,
  Info, Bell, Check, Trash2, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { NotificationType } from "@/types";

// ── Data ───────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  action?: { label: string; href: string };
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1",  type: "POST_PUBLISHED",      title: "Instagram post published",       body: "Your post got 1,240 impressions in the first hour.",                   read: false, createdAt: new Date(Date.now() - 15 * 60000),       action: { label: "View analytics", href: "/analytics" } },
  { id: "n2",  type: "AI_CREDITS_LOW",       title: "AI credits running low",          body: "You have 8 AI credits remaining. Upgrade for unlimited generation.",     read: false, createdAt: new Date(Date.now() - 40 * 60000),       action: { label: "Upgrade plan", href: "/settings/billing" } },
  { id: "n3",  type: "POST_FAILED",          title: "Twitter post failed",             body: "Could not publish your post — access token expired. Reconnect.",       read: false, createdAt: new Date(Date.now() - 2 * 3600000),      action: { label: "Reconnect account", href: "/accounts" } },
  { id: "n4",  type: "TEAM_JOINED",          title: "Sarah joined your workspace",     body: "Sarah Chen accepted your invite as an Editor.",                         read: true,  createdAt: new Date(Date.now() - 5 * 3600000) },
  { id: "n5",  type: "POST_SCHEDULED",       title: "5 posts scheduled",               body: "Your content queue is set for the next 3 days.",                        read: true,  createdAt: new Date(Date.now() - 24 * 3600000) },
  { id: "n6",  type: "ACCOUNT_DISCONNECTED", title: "LinkedIn account disconnected",   body: "Your LinkedIn session expired. Reconnect to keep posting.",             read: true,  createdAt: new Date(Date.now() - 2 * 24 * 3600000), action: { label: "Reconnect", href: "/accounts" } },
  { id: "n7",  type: "POST_PUBLISHED",       title: "LinkedIn post published",         body: "3 posts went live today across your connected accounts.",               read: true,  createdAt: new Date(Date.now() - 3 * 24 * 3600000) },
  { id: "n8",  type: "SYSTEM",               title: "New feature: AI Thread Composer", body: "Generate fully structured Twitter threads with one click using AI.",    read: true,  createdAt: new Date(Date.now() - 7 * 24 * 3600000), action: { label: "Try it now", href: "/compose" } },
];

const TYPE_META: Record<NotificationType, { icon: React.FC<{className?: string}>; color: string; bg: string }> = {
  POST_PUBLISHED:      { icon: CheckCircle2, color: "text-[#34d399]", bg: "bg-[rgba(16,185,129,0.12)]" },
  POST_FAILED:         { icon: AlertCircle,  color: "text-[#f87171]", bg: "bg-[rgba(239,68,68,0.12)]" },
  POST_SCHEDULED:      { icon: Clock,        color: "text-[#818cf8]", bg: "bg-[rgba(97,114,243,0.12)]" },
  TEAM_INVITE:         { icon: Users,        color: "text-[#60a5fa]", bg: "bg-[rgba(59,130,246,0.12)]" },
  TEAM_JOINED:         { icon: Users,        color: "text-[#60a5fa]", bg: "bg-[rgba(59,130,246,0.12)]" },
  AI_CREDITS_LOW:      { icon: Sparkles,     color: "text-[#a78bfa]", bg: "bg-[rgba(167,139,250,0.12)]" },
  ACCOUNT_DISCONNECTED:{ icon: AlertCircle,  color: "text-[#fbbf24]", bg: "bg-[rgba(245,158,11,0.12)]" },
  SYSTEM:              { icon: Info,         color: "text-[#60a5fa]", bg: "bg-[rgba(59,130,246,0.12)]" },
};

type FilterType = "ALL" | "UNREAD" | NotificationType;

const FILTER_OPTIONS: { id: FilterType; label: string }[] = [
  { id: "ALL",    label: "All" },
  { id: "UNREAD", label: "Unread" },
  { id: "POST_PUBLISHED", label: "Published" },
  { id: "POST_FAILED",    label: "Failed" },
  { id: "TEAM_JOINED",    label: "Team" },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    return n.type === filter;
  });

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#f1f3f9]">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-2xs">{unreadCount} new</Badge>
            )}
          </div>
          <p className="text-xs text-[#4d5675]">Stay updated on your workspace activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="xs" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] w-fit">
        {FILTER_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              filter === id
                ? "bg-[rgba(255,255,255,0.1)] text-[#f1f3f9]"
                : "text-[#4d5675] hover:text-[#8892aa]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-20">
          <Bell className="h-10 w-10 text-[#2e3554] mb-3" />
          <p className="text-sm font-medium text-[#4d5675]">All caught up!</p>
          <p className="text-xs text-[#2e3554] mt-1">No notifications to show</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence>
            {filtered.map((notif) => {
              const meta = TYPE_META[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border p-4 transition-all",
                    !notif.read
                      ? "bg-[rgba(97,114,243,0.04)] border-[rgba(97,114,243,0.12)]"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.09)]"
                  )}
                >
                  {/* Unread dot */}
                  <div className="relative mt-1 shrink-0">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", meta.bg)}>
                      <meta.icon className={cn("h-4.5 w-4.5", meta.color)} />
                    </div>
                    {!notif.read && (
                      <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#6172f3] border-2 border-[#08090e]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium", !notif.read ? "text-[#f1f3f9]" : "text-[#c4cbdc]")}>
                        {notif.title}
                      </p>
                      <span className="text-2xs text-[#4d5675] shrink-0 mt-0.5">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#8892aa] mt-0.5 leading-relaxed">{notif.body}</p>
                    {notif.action && (
                      <a
                        href={notif.action.href}
                        className="mt-2 inline-flex items-center text-xs font-medium text-[#818cf8] hover:text-[#6172f3] transition-colors"
                        onClick={() => markRead(notif.id)}
                      >
                        {notif.action.label} →
                      </a>
                    )}
                  </div>

                  {/* Actions (shown on hover) */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        title="Mark read"
                        className="flex h-6 w-6 items-center justify-center rounded-md text-[#4d5675] hover:text-[#34d399] hover:bg-[rgba(16,185,129,0.08)] transition-all"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete"
                      className="flex h-6 w-6 items-center justify-center rounded-md text-[#4d5675] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={clearAll}
            className="text-xs text-[#4d5675] hover:text-[#f87171] transition-colors"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
