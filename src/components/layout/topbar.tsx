"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, Search, Plus, Command, X,
  CheckCircle2, Clock, AlertCircle, Info,
  Settings, LogOut, User, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/compose": "Compose",
  "/calendar": "Calendar",
  "/analytics": "Analytics",
  "/accounts": "Social Accounts",
  "/media": "Media Library",
  "/hashtags": "Hashtag Groups",
  "/scheduled": "Scheduled Posts",
  "/team": "Team",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

const mockNotifications = [
  { id: "1", type: "success", title: "Post published", body: "Your Instagram post went live", time: new Date(Date.now() - 3 * 60000) },
  { id: "2", type: "warning", title: "Scheduled reminder", body: "3 posts scheduled for tomorrow", time: new Date(Date.now() - 20 * 60000) },
  { id: "3", type: "error", title: "Publishing failed", body: "Twitter post couldn't be published", time: new Date(Date.now() - 2 * 3600000) },
  { id: "4", type: "info", title: "Team joined", body: "Sarah added to your workspace", time: new Date(Date.now() - 5 * 3600000) },
];

const notifIcon: Record<string, React.FC<{ className?: string }>> = {
  success: CheckCircle2,
  warning: Clock,
  error: AlertCircle,
  info: Info,
};

const notifColors: Record<string, string> = {
  success: "text-[#34d399]",
  warning: "text-[#fbbf24]",
  error: "text-[#f87171]",
  info: "text-[#60a5fa]",
};

export function Topbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [searchOpen, setSearchOpen]   = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unread] = useState(2);

  async function handleSignOut() {
    // NextAuth v5 sign-out — POST to the signout endpoint
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  }

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.05)] bg-[#0d0f17]/80 backdrop-blur-xl px-5 sticky top-0 z-40">
      {/* Left — page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-[#f1f3f9]">{title}</h1>
      </div>

      {/* Center — search trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] px-3 py-1.5 text-sm text-[#4d5675] hover:border-[rgba(255,255,255,0.12)] hover:text-[#8892aa] transition-all w-56"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left text-xs">Search everything…</span>
        <div className="flex items-center gap-0.5">
          <kbd className="flex h-4 items-center rounded bg-[rgba(255,255,255,0.08)] px-1 text-2xs font-mono">⌘</kbd>
          <kbd className="flex h-4 items-center rounded bg-[rgba(255,255,255,0.08)] px-1 text-2xs font-mono">K</kbd>
        </div>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Search icon (mobile) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] transition-all"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* New Post */}
        <Button size="sm" className="hidden sm:flex gap-1.5" leftIcon={<Plus className="h-3.5 w-3.5" />}>
          New Post
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] transition-all"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#6172f3] text-white text-[8px] font-bold leading-none">
                {unread}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111420] shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#f1f3f9]">Notifications</span>
                      {unread > 0 && <Badge variant="default" className="px-1.5 py-0 text-2xs">{unread} new</Badge>}
                    </div>
                    <button className="text-2xs text-[#4d5675] hover:text-[#8892aa] transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((n, i) => {
                      const Icon = notifIcon[n.type];
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            "flex items-start gap-3 p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer",
                            i < mockNotifications.length - 1 && "border-b border-[rgba(255,255,255,0.04)]",
                            i < unread && "bg-[rgba(97,114,243,0.04)]"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", notifColors[n.type])} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#f1f3f9]">{n.title}</p>
                            <p className="text-xs text-[#8892aa] mt-0.5">{n.body}</p>
                            <p className="text-2xs text-[#4d5675] mt-1">{formatRelativeTime(n.time)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t border-[rgba(255,255,255,0.06)]">
                    <button className="w-full rounded-lg py-2 text-xs text-[#818cf8] hover:bg-[rgba(97,114,243,0.08)] transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar + profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:ring-2 hover:ring-[rgba(97,114,243,0.4)] transition-all"
          >
            <UserAvatar name="Alex Johnson" size="sm" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111420] shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.06)]">
                    <UserAvatar name="Alex Johnson" size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#f1f3f9] truncate">Alex Johnson</p>
                      <p className="text-xs text-[#4d5675] truncate">alex@company.com</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    {[
                      { icon: User,     label: "Your profile",  href: "/settings" },
                      { icon: Settings, label: "Settings",       href: "/settings" },
                    ].map(({ icon: Icon, label, href }) => (
                      <button key={label} onClick={() => { setProfileOpen(false); router.push(href); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#8892aa] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f1f3f9] transition-colors group">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>

                  {/* Workspace badge */}
                  <div className="mx-3 mb-2 rounded-xl bg-[rgba(97,114,243,0.08)] border border-[rgba(97,114,243,0.15)] px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-[#f1f3f9]">Acme Inc.</p>
                        <p className="text-2xs text-[#4d5675]">Growth plan · 50 AI credits left</p>
                      </div>
                      <span className="rounded-full bg-[rgba(97,114,243,0.2)] px-2 py-0.5 text-2xs font-medium text-[#8b9cf4]">Growth</span>
                    </div>
                  </div>

                  {/* Sign out */}
                  <div className="p-1.5 border-t border-[rgba(255,255,255,0.06)]">
                    <button onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors">
                      <LogOut className="h-4 w-4 shrink-0" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-20 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#111420] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.06)]">
                <Search className="h-4 w-4 text-[#4d5675] shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, accounts, settings…"
                  className="flex-1 bg-transparent text-sm text-[#f1f3f9] placeholder:text-[#4d5675] focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#4d5675] hover:text-[#8892aa] transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="flex items-center rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-xs text-[#4d5675] font-mono">ESC</kbd>
              </div>
              <div className="p-2">
                {["Dashboard", "Compose Post", "Calendar", "Social Accounts", "Team Settings"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#8892aa] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f1f3f9] transition-colors"
                  >
                    <Command className="h-3.5 w-3.5 text-[#4d5675] shrink-0" />
                    {item}
                  </button>
                ))}
              </div>
              <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-2 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-2xs text-[#4d5675]">
                  <kbd className="flex h-4 items-center rounded bg-[rgba(255,255,255,0.08)] px-1 font-mono">↑↓</kbd>
                  Navigate
                </div>
                <div className="flex items-center gap-1.5 text-2xs text-[#4d5675]">
                  <kbd className="flex h-4 items-center rounded bg-[rgba(255,255,255,0.08)] px-1 font-mono">↵</kbd>
                  Open
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
