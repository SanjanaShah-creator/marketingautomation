"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, PenSquare, Users, Settings, Bell,
  ChevronDown, Zap, Plus, BarChart2, Link2, ChevronsLeft, ChevronsRight,
  Sparkles, Hash, Image, Clock, Trash2, AlertTriangle, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    section: "Main",
    items: [
      { href: "/dashboard",  label: "Dashboard",      icon: LayoutDashboard },
      { href: "/compose",    label: "Compose",         icon: PenSquare },
      { href: "/calendar",   label: "Calendar",        icon: Calendar },
      { href: "/analytics",  label: "Analytics",       icon: BarChart2 },
    ],
  },
  {
    section: "Manage",
    items: [
      { href: "/accounts",   label: "Social Accounts", icon: Link2 },
      { href: "/media",      label: "Media Library",   icon: Image },
      { href: "/hashtags",   label: "Hashtags",        icon: Hash },
      { href: "/scheduled",  label: "Scheduled",       icon: Clock, badge: "12" },
    ],
  },
  {
    section: "Workspace",
    items: [
      { href: "/team",          label: "Team",          icon: Users },
      { href: "/notifications", label: "Notifications", icon: Bell,     badge: "3" },
      { href: "/settings",      label: "Settings",      icon: Settings },
    ],
  },
];

const MOCK_WORKSPACES = [
  { id: "1", name: "Acme Inc.",       emoji: "🚀", plan: "Growth" },
  { id: "2", name: "Personal Brand",  emoji: "✨", plan: "Starter" },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (v: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [wsOpen, setWsOpen]       = useState(false);
  const [activeWs, setActiveWs]   = useState(MOCK_WORKSPACES[0]);
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [deleteTarget, setDeleteTarget] = useState<typeof MOCK_WORKSPACES[0] | null>(null);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function handleSwitchWorkspace(ws: typeof MOCK_WORKSPACES[0]) {
    setActiveWs(ws);
    setWsOpen(false);
  }

  function handleCreateWorkspace() {
    setWsOpen(false);
    router.push("/onboarding?new=true");
  }

  function handleDeleteWorkspace(ws: typeof MOCK_WORKSPACES[0]) {
    setDeleteTarget(ws);
    setWsOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const remaining = workspaces.filter((w) => w.id !== deleteTarget.id);
    setWorkspaces(remaining);
    if (activeWs.id === deleteTarget.id && remaining.length > 0) setActiveWs(remaining[0]);
    setDeleteTarget(null);
  }

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex h-full flex-col border-r overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--sidebar-bg)" }}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div key="logo-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm"
                  style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))" }}>
                  <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold whitespace-nowrap tracking-tight" style={{ color: "var(--ink-primary)" }}>SocialSync</span>
              </motion.div>
            ) : (
              <motion.div key="logo-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))" }}>
                <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => onCollapse?.(!collapsed)}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-all shrink-0"
            style={{ color: "var(--ink-tertiary)" }}>
            {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Workspace selector */}
        <div className="relative px-2 pt-2 pb-1">
          <button onClick={() => setWsOpen(!wsOpen)}
            className={cn("flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-all duration-150 border",
              wsOpen ? "border-[var(--border-strong)]" : "border-transparent hover:border-[var(--border)]"
            )}
            style={{ backgroundColor: wsOpen ? "var(--border-subtle)" : undefined }}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs"
              style={{ backgroundColor: "var(--border)" }}>
              {activeWs.emoji}
            </span>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="truncate text-xs font-semibold" style={{ color: "var(--ink-primary)" }}>{activeWs.name}</div>
                  <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{activeWs.plan} plan</div>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform shrink-0", wsOpen && "rotate-180")}
                  style={{ color: "var(--ink-tertiary)" }} />
              </>
            )}
          </button>

          <AnimatePresence>
            {wsOpen && !collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-2 right-2 top-full z-50 mt-1 rounded-xl overflow-hidden shadow-xl"
                style={{ border: "1px solid var(--border-strong)", backgroundColor: "var(--card)" }}>
                <div className="p-1">
                  {workspaces.map((ws) => (
                    <div key={ws.id} className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-subtle)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}>
                      <button className="flex flex-1 items-center gap-2.5 text-left min-w-0"
                        onClick={() => handleSwitchWorkspace(ws)}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs"
                          style={{ backgroundColor: "var(--border)" }}>{ws.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: "var(--ink-primary)" }}>{ws.name}</div>
                          <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{ws.plan}</div>
                        </div>
                        {ws.id === activeWs.id && (
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--brand-500)" }} />
                        )}
                      </button>
                      <button onClick={() => handleDeleteWorkspace(ws)}
                        className="shrink-0 flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--danger)" }}
                        title="Delete workspace">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-1" style={{ borderTop: "1px solid var(--border)" }}>
                  <button onClick={handleCreateWorkspace}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors"
                    style={{ color: "var(--ink-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-primary)"; e.currentTarget.style.backgroundColor = "var(--border-subtle)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; e.currentTarget.style.backgroundColor = ""; }}>
                    <Plus className="h-3.5 w-3.5" />
                    Create new workspace
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Post button */}
        <div className="px-2 pb-2">
          <Link href="/compose"
            className={cn("flex items-center gap-2.5 rounded-xl py-2 px-2.5 text-xs font-semibold text-white transition-all duration-150",
              collapsed && "justify-center px-0")}
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))", boxShadow: "0 2px 8px rgba(107,191,138,0.3)" }}>
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && "New Post"}
          </Link>
        </div>

        <div className="mx-3 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
          {navItems.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="px-2 mb-1">
                  <span className="text-2xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                    {section.section}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={cn("sidebar-item", active && "active", collapsed && "justify-center px-0")}
                      title={collapsed ? item.label : undefined}>
                      <item.icon className={cn("h-4 w-4 shrink-0")}
                        style={{ color: active ? "var(--brand-500)" : "var(--ink-tertiary)" }} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <Badge variant="neutral" className="text-2xs px-1.5 py-0">{item.badge}</Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* AI Credits */}
        {!collapsed && (
          <div className="mx-2 mb-2 rounded-xl p-3" style={{ backgroundColor: "rgba(107,191,138,0.08)", border: "1px solid rgba(107,191,138,0.15)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand-500)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--brand-500)" }}>AI Credits</span>
              </div>
              <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>32 / 50</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
              <div className="h-full w-[64%] rounded-full" style={{ background: "linear-gradient(90deg, var(--brand-500), var(--accent-500))" }} />
            </div>
            <p className="mt-1.5 text-2xs" style={{ color: "var(--ink-tertiary)" }}>Resets in 28 days</p>
          </div>
        )}

        {/* User profile */}
        <div className="p-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className={cn("flex w-full items-center gap-2.5 rounded-xl p-2 transition-colors cursor-pointer",
            collapsed && "justify-center")}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}>
            <UserAvatar name="Alex Johnson" size="sm" className="shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate text-xs font-medium" style={{ color: "var(--ink-primary)" }}>Alex Johnson</div>
                <div className="truncate text-2xs" style={{ color: "var(--ink-tertiary)" }}>alex@acme.com</div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Delete workspace confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/3 z-50 w-full max-w-sm -translate-x-1/2 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
              <button onClick={() => setDeleteTarget(null)}
                className="absolute right-4 top-4 rounded-lg p-1 transition-colors"
                style={{ color: "var(--ink-tertiary)" }}>
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(239,83,80,0.1)" }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: "var(--danger)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Delete workspace?</p>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{deleteTarget.name}</p>
                </div>
              </div>
              <p className="text-sm mb-5" style={{ color: "var(--ink-secondary)" }}>
                This will permanently delete the workspace and all its posts, accounts, and data. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "var(--border-subtle)", color: "var(--ink-secondary)" }}>
                  Cancel
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 rounded-xl py-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "var(--danger)" }}>
                  Delete workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
