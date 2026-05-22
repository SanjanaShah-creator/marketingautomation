"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  { id: "1", type: "success", title: "Post published",      body: "Your Instagram post went live",     time: new Date(Date.now() - 3 * 60000) },
  { id: "2", type: "warning", title: "Scheduled reminder",  body: "3 posts scheduled for tomorrow",    time: new Date(Date.now() - 20 * 60000) },
  { id: "3", type: "error",   title: "Publishing failed",   body: "Post couldn't be published",        time: new Date(Date.now() - 2 * 3600000) },
  { id: "4", type: "info",    title: "Team joined",         body: "New member added to your workspace", time: new Date(Date.now() - 5 * 3600000) },
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
  error:   "text-[#f87171]",
  info:    "text-[#60a5fa]",
};

export function Topbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();

  const [searchOpen,   setSearchOpen]   = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [unread] = useState(2);

  const userName  = session?.user?.name  ?? "User";
  const userEmail = session?.user?.email ?? "";

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  const title = Object.entries(PAGE_TITLES).find(
    ([key]) => pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "Dashboard";

  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between border-b px-5 sticky top-0 z-40 backdrop-blur-xl"
      style={{ backgroundColor: "var(--topbar-bg)", borderColor: "var(--border)" }}
    >
      {/* Left — page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{title}</h1>
      </div>

      {/* Center — search trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-all w-56 border"
        style={{ backgroundColor: "var(--border-subtle)", borderColor: "var(--border)", color: "var(--ink-tertiary)" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-tertiary)"; }}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left text-xs">Search everything…</span>
        <div className="flex items-center gap-0.5">
          <kbd className="flex h-4 items-center rounded px-1 text-2xs font-mono" style={{ backgroundColor: "var(--border)" }}>⌘</kbd>
          <kbd className="flex h-4 items-center rounded px-1 text-2xs font-mono" style={{ backgroundColor: "var(--border)" }}>K</kbd>
        </div>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg transition-all"
          style={{ color: "var(--ink-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}
        >
          <Search className="h-4 w-4" />
        </button>

        <Button size="sm" className="hidden sm:flex gap-1.5" leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => router.push("/compose")}>
          New Post
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#177A41] text-white text-[8px] font-bold leading-none">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden border"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Notifications</span>
                      {unread > 0 && <Badge variant="default" className="px-1.5 py-0 text-2xs">{unread} new</Badge>}
                    </div>
                    <button className="text-2xs transition-colors" style={{ color: "var(--ink-tertiary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((n, i) => {
                      const Icon = notifIcon[n.type];
                      return (
                        <div key={n.id}
                          className={cn("flex items-start gap-3 p-4 cursor-pointer transition-colors",
                            i < mockNotifications.length - 1 && "border-b")}
                          style={{ borderColor: "var(--border-subtle)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", notifColors[n.type])} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>{n.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--ink-secondary)" }}>{n.body}</p>
                            <p className="text-2xs mt-1" style={{ color: "var(--ink-tertiary)" }}>{formatRelativeTime(n.time)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                      className="w-full rounded-lg py-2 text-xs font-medium transition-colors"
                      style={{ color: "var(--brand-500)" }}
                      onClick={() => { setNotifOpen(false); router.push("/notifications"); }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
                    >
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
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{ outline: profileOpen ? "2px solid var(--brand-500)" : undefined }}
          >
            <UserAvatar name={userName} image={session?.user?.image ?? undefined} size="sm" />
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
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden border"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <UserAvatar name={userName} image={session?.user?.image ?? undefined} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-primary)" }}>{userName}</p>
                      <p className="text-xs truncate" style={{ color: "var(--ink-tertiary)" }}>{userEmail}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    {[
                      { icon: User,     label: "Your profile", href: "/settings" },
                      { icon: Settings, label: "Settings",      href: "/settings" },
                    ].map(({ icon: Icon, label, href }) => (
                      <button key={label} onClick={() => { setProfileOpen(false); router.push(href); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors group"
                        style={{ color: "var(--ink-secondary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-secondary)"; }}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="p-1.5 border-t" style={{ borderColor: "var(--border)" }}>
                    <button onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--danger)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
                    >
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-20 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border-strong)" }}
            >
              <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <Search className="h-4 w-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  placeholder="Search posts, accounts, settings…"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  style={{ color: "var(--ink-primary)" }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ color: "var(--ink-tertiary)" }}>
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="flex items-center rounded px-1.5 py-0.5 text-xs font-mono"
                  style={{ backgroundColor: "var(--border)", color: "var(--ink-tertiary)" }}>ESC</kbd>
              </div>
              <div className="p-2">
                {["Dashboard", "Compose Post", "Calendar", "Social Accounts", "Settings"].map((item) => (
                  <button key={item} onClick={() => setSearchOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                    style={{ color: "var(--ink-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-secondary)"; }}
                  >
                    <Command className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                    {item}
                  </button>
                ))}
              </div>
              <div className="border-t px-4 py-2 flex items-center gap-4" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-1.5 text-2xs" style={{ color: "var(--ink-tertiary)" }}>
                  <kbd className="flex h-4 items-center rounded px-1 font-mono" style={{ backgroundColor: "var(--border)" }}>↑↓</kbd>
                  Navigate
                </div>
                <div className="flex items-center gap-1.5 text-2xs" style={{ color: "var(--ink-tertiary)" }}>
                  <kbd className="flex h-4 items-center rounded px-1 font-mono" style={{ backgroundColor: "var(--border)" }}>↵</kbd>
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
