"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, PenSquare, Users, Settings, Bell,
  ChevronDown, Zap, Plus, BarChart2, Link2, ChevronsLeft, ChevronsRight,
  Sparkles, Hash, Image, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    section: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/compose", label: "Compose", icon: PenSquare, badge: null, isAction: true },
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/analytics", label: "Analytics", icon: BarChart2 },
    ],
  },
  {
    section: "Manage",
    items: [
      { href: "/accounts", label: "Social Accounts", icon: Link2 },
      { href: "/media", label: "Media Library", icon: Image },
      { href: "/hashtags", label: "Hashtags", icon: Hash },
      { href: "/scheduled", label: "Scheduled", icon: Clock, badge: "12" },
    ],
  },
  {
    section: "Workspace",
    items: [
      { href: "/team", label: "Team", icon: Users },
      { href: "/notifications", label: "Notifications", icon: Bell, badge: "3" },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const workspaces = [
  { id: "1", name: "Acme Inc.", emoji: "🚀", plan: "Growth" },
  { id: "2", name: "Personal Brand", emoji: "✨", plan: "Starter" },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (v: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [wsOpen, setWsOpen] = useState(false);
  const [activeWs] = useState(workspaces[0]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-full flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#0d0f17] overflow-hidden"
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between px-3 border-b border-[rgba(255,255,255,0.05)]">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6172f3] to-[#a855f7] shadow-[0_0_12px_rgba(97,114,243,0.4)]">
                <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-[#f1f3f9] whitespace-nowrap tracking-tight">SocialSync</span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6172f3] to-[#a855f7]"
            >
              <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => onCollapse?.(!collapsed)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] transition-all shrink-0"
        >
          {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Workspace selector */}
      <div className="relative px-2 pt-2 pb-1">
        <button
          onClick={() => setWsOpen(!wsOpen)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-all duration-150 border border-transparent",
            wsOpen
              ? "bg-[rgba(255,255,255,0.07)] border-[rgba(255,255,255,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.06)]"
          )}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[rgba(255,255,255,0.08)] text-xs">
            {activeWs.emoji}
          </span>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate text-xs font-semibold text-[#f1f3f9]">{activeWs.name}</div>
                <div className="text-2xs text-[#4d5675]">{activeWs.plan} plan</div>
              </div>
              <ChevronDown className={cn("h-3.5 w-3.5 text-[#4d5675] transition-transform shrink-0", wsOpen && "rotate-180")} />
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
              className="absolute left-2 right-2 top-full z-50 mt-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111420] shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <div className="p-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setWsOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[rgba(255,255,255,0.08)] text-xs">
                      {ws.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#f1f3f9]">{ws.name}</div>
                      <div className="text-2xs text-[#4d5675]">{ws.plan}</div>
                    </div>
                    {ws.id === activeWs.id && <div className="h-1.5 w-1.5 rounded-full bg-[#6172f3] shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-[rgba(255,255,255,0.06)] p-1">
                <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-[#8892aa] hover:text-[#f1f3f9] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Create workspace
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compose button */}
      <div className="px-2 pb-2">
        <Link
          href="/compose"
          className={cn(
            "flex items-center gap-2.5 rounded-xl py-2 px-2.5 text-xs font-semibold text-white",
            "bg-gradient-to-r from-[#6172f3] to-[#a855f7] shadow-[0_2px_8px_rgba(97,114,243,0.35)]",
            "hover:shadow-[0_4px_16px_rgba(97,114,243,0.5)] hover:-translate-y-px transition-all duration-150",
            collapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "New Post"}
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[rgba(255,255,255,0.05)]" />

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <div className="px-2 mb-1">
                <span className="text-2xs font-semibold uppercase tracking-widest text-[#2e3554]">
                  {section.section}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "sidebar-item",
                      active && "active",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0 sidebar-icon", active ? "text-[#6172f3]" : "text-[#4d5675]")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="neutral" className="text-2xs px-1.5 py-0">
                            {item.badge}
                          </Badge>
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
        <div className="mx-2 mb-2 rounded-xl bg-[rgba(97,114,243,0.08)] border border-[rgba(97,114,243,0.15)] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#818cf8]" />
              <span className="text-xs font-medium text-[#818cf8]">AI Credits</span>
            </div>
            <span className="text-2xs text-[#4d5675]">32 / 50</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-[#6172f3] to-[#a855f7]" />
          </div>
          <p className="mt-1.5 text-2xs text-[#4d5675]">Resets in 28 days</p>
        </div>
      )}

      {/* User profile */}
      <div className="border-t border-[rgba(255,255,255,0.05)] p-2">
        <button className={cn(
          "flex w-full items-center gap-2.5 rounded-xl p-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors",
          collapsed && "justify-center"
        )}>
          <UserAvatar name="Alex Johnson" size="sm" className="shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <div className="truncate text-xs font-medium text-[#f1f3f9]">Alex Johnson</div>
              <div className="truncate text-2xs text-[#4d5675]">alex@acme.com</div>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
