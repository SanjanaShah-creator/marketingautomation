"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, Clock, Users, Sparkles,
  Info, Bell, Check, Trash2,
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
  POST_PUBLISHED:      { icon: CheckCircle2, color: "var(--success)",  bg: "rgba(22,101,52,0.08)" },
  POST_FAILED:         { icon: AlertCircle,  color: "var(--danger)",   bg: "rgba(155,28,28,0.08)" },
  POST_SCHEDULED:      { icon: Clock,        color: "var(--brand-500)", bg: "rgba(23,122,65,0.08)" },
  TEAM_INVITE:         { icon: Users,        color: "var(--info)",     bg: "rgba(30,58,138,0.08)" },
  TEAM_JOINED:         { icon: Users,        color: "var(--info)",     bg: "rgba(30,58,138,0.08)" },
  AI_CREDITS_LOW:      { icon: Sparkles,     color: "var(--warning)",  bg: "rgba(146,64,14,0.08)" },
  ACCOUNT_DISCONNECTED:{ icon: AlertCircle,  color: "var(--warning)",  bg: "rgba(146,64,14,0.08)" },
  SYSTEM:              { icon: Info,         color: "var(--info)",     bg: "rgba(30,58,138,0.08)" },
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
            <h2 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-2xs">{unreadCount} new</Badge>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Stay updated on your workspace activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="xs" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--surface-100)" }}>
        {FILTER_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: filter === id ? "var(--card)" : "transparent",
              color: filter === id ? "var(--ink-primary)" : "var(--ink-tertiary)",
              boxShadow: filter === id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-50)" }}>
          <Bell className="h-10 w-10 mb-3" style={{ color: "var(--ink-muted)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>All caught up!</p>
          <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>No notifications to show</p>
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
                  className="group flex items-start gap-4 rounded-2xl border p-4 transition-all"
                  style={{
                    backgroundColor: !notif.read ? "rgba(23,122,65,0.04)" : "var(--card)",
                    borderColor: !notif.read ? "rgba(23,122,65,0.15)" : "var(--border)",
                  }}
                >
                  {/* Icon */}
                  <div className="relative mt-1 shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: meta.bg }}>
                      <span style={{ color: meta.color }}><meta.icon className="h-4 w-4" /></span>
                    </div>
                    {!notif.read && (
                      <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
                        style={{ backgroundColor: "var(--brand-500)", borderColor: "var(--card)" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium" style={{ color: notif.read ? "var(--ink-secondary)" : "var(--ink-primary)" }}>
                        {notif.title}
                      </p>
                      <span className="text-xs shrink-0 mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--ink-tertiary)" }}>{notif.body}</p>
                    {notif.action && (
                      <a
                        href={notif.action.href}
                        className="mt-2 inline-flex items-center text-xs font-medium transition-colors"
                        style={{ color: "var(--brand-500)" }}
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
                        className="flex h-6 w-6 items-center justify-center rounded-md transition-all"
                        style={{ color: "var(--ink-tertiary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--success)"; e.currentTarget.style.backgroundColor = "rgba(22,101,52,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.backgroundColor = ""; }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete"
                      className="flex h-6 w-6 items-center justify-center rounded-md transition-all"
                      style={{ color: "var(--ink-tertiary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.backgroundColor = ""; }}
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
            className="text-xs transition-colors"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; }}
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
