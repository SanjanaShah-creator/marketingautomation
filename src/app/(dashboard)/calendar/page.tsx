"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Grid3X3, List, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { cn, truncate, formatRelativeTime } from "@/lib/utils";
import type { SocialPlatform, PostStatus } from "@/types";

// ── Mock data ──────────────────────────────────────────────────────────────

interface CalPost {
  id: string; content: string; platforms: SocialPlatform[];
  status: PostStatus; hour: number; day: number; mediaCount: number;
}

function generatePosts(): CalPost[] {
  return [
    { id: "p1", content: "Announcing our AI-powered content engine! 🚀 Game-changer for social teams.", platforms: ["TWITTER", "LINKEDIN"], status: "PUBLISHED", hour: 9, day: 3, mediaCount: 0 },
    { id: "p2", content: "Behind the scenes: our design team at work. Creating magic every day ✨", platforms: ["INSTAGRAM"], status: "PUBLISHED", hour: 14, day: 5, mediaCount: 3 },
    { id: "p3", content: "New feature: Thread composer with AI formatting. Perfect for thought leadership.", platforms: ["TWITTER"], status: "PUBLISHED", hour: 10, day: 8, mediaCount: 0 },
    { id: "p4", content: "Join us this Friday for a live Q&A on AI in social media marketing!", platforms: ["TWITTER", "LINKEDIN", "FACEBOOK"], status: "SCHEDULED", hour: 11, day: 15, mediaCount: 0 },
    { id: "p5", content: "Customer spotlight: How Acme grew 200% with SocialSync 📈", platforms: ["INSTAGRAM", "LINKEDIN"], status: "SCHEDULED", hour: 9, day: 17, mediaCount: 2 },
    { id: "p6", content: "5 tips for writing captions that stop the scroll. Thread incoming 🧵", platforms: ["TWITTER"], status: "SCHEDULED", hour: 16, day: 19, mediaCount: 0 },
    { id: "p7", content: "Our roadmap for Q3 — big things coming your way. Stay tuned!", platforms: ["TWITTER", "LINKEDIN"], status: "DRAFT", hour: 13, day: 22, mediaCount: 0 },
    { id: "p8", content: "Weekend inspiration: What does your dream workspace look like?", platforms: ["INSTAGRAM", "FACEBOOK"], status: "SCHEDULED", hour: 10, day: 24, mediaCount: 1 },
    { id: "p9", content: "We crossed 10K users! 🎉 Thank you for believing in us from day one.", platforms: ["TWITTER", "INSTAGRAM", "LINKEDIN"], status: "DRAFT", hour: 9, day: 28, mediaCount: 0 },
  ];
}

const STATUS_META: Record<PostStatus, { label: string; bg: string; color: string; border: string; dot: string }> = {
  PUBLISHED:  { label: "Published",  bg: "rgba(22,101,52,0.1)",   color: "var(--success)",   border: "rgba(22,101,52,0.2)",   dot: "var(--success)" },
  SCHEDULED:  { label: "Scheduled",  bg: "rgba(23,122,65,0.1)",   color: "var(--brand-500)", border: "rgba(23,122,65,0.25)",  dot: "var(--brand-500)" },
  DRAFT:      { label: "Draft",      bg: "var(--surface-100)",    color: "var(--ink-secondary)", border: "var(--border)",     dot: "var(--ink-muted)" },
  PUBLISHING: { label: "Publishing", bg: "rgba(146,64,14,0.1)",   color: "var(--warning)",   border: "rgba(146,64,14,0.2)",   dot: "var(--warning)" },
  FAILED:     { label: "Failed",     bg: "rgba(155,28,28,0.1)",   color: "var(--danger)",    border: "rgba(155,28,28,0.2)",   dot: "var(--danger)" },
  ARCHIVED:   { label: "Archived",   bg: "var(--surface-100)",    color: "var(--ink-tertiary)", border: "var(--border)",     dot: "var(--ink-muted)" },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function PostChip({ post, onClick }: { post: CalPost; onClick: (p: CalPost) => void }) {
  const meta = STATUS_META[post.status];
  return (
    <button
      onClick={() => onClick(post)}
      className="group w-full rounded-lg px-2 py-1.5 text-left transition-all"
      style={{ backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.95)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = ""; }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="flex gap-0.5">
          {post.platforms.slice(0, 2).map((p) => (
            <PlatformIcon key={p} platform={p} size={10} />
          ))}
          {post.platforms.length > 2 && (
            <span className="text-2xs opacity-60">+{post.platforms.length - 2}</span>
          )}
        </span>
        <span className="text-2xs opacity-60" style={{ color: meta.color }}>{post.hour}:00</span>
      </div>
      <p className="text-2xs leading-tight truncate" style={{ color: meta.color }}>{post.content}</p>
    </button>
  );
}

function PostDetailPanel({ post, onClose }: { post: CalPost; onClose: () => void }) {
  const meta = STATUS_META[post.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="w-72 flex flex-col shrink-0">
      <div className="card-base flex-1 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
            {meta.label}
          </span>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{post.content}</p>

        {/* Platforms */}
        <div>
          <p className="text-2xs font-medium mb-2" style={{ color: "var(--ink-tertiary)" }}>Platforms</p>
          <div className="flex flex-wrap gap-1.5">
            {post.platforms.map((p) => (
              <div key={p} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border)" }}>
                <PlatformIcon platform={p} size={12} />
                <span className="text-2xs" style={{ color: "var(--ink-secondary)" }}>{p.charAt(0) + p.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-secondary)" }}>
          <Clock className="h-3.5 w-3.5" style={{ color: "var(--ink-muted)" }} />
          Scheduled: Day {post.day} at {post.hour}:00
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
          <Button variant="secondary" size="xs" className="flex-1">Edit</Button>
          {post.status === "DRAFT" && <Button size="xs" className="flex-1">Schedule</Button>}
          {post.status === "SCHEDULED" && <Button variant="destructive" size="xs">Unschedule</Button>}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedPost, setSelectedPost] = useState<CalPost | null>(null);
  const [filterStatus, setFilterStatus] = useState<PostStatus | "ALL">("ALL");

  const posts = useMemo(() => generatePosts(), [year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function getPostsForDay(day: number) {
    return posts.filter((p) => p.day === day && (filterStatus === "ALL" || p.status === filterStatus));
  }

  const isToday = (day: number) => day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  return (
    <div className="flex gap-5 h-[calc(100vh-56px-48px)]">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl p-1"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}>
              <button onClick={prevMonth}
                className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                style={{ color: "var(--ink-tertiary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth}
                className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                style={{ color: "var(--ink-tertiary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
              className="rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface-50)", color: "var(--ink-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}>
              Today
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <div className="flex items-center gap-1">
              {(["ALL", "SCHEDULED", "PUBLISHED", "DRAFT"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: filterStatus === s ? "rgba(23,122,65,0.1)" : "transparent",
                    color: filterStatus === s ? "var(--brand-500)" : "var(--ink-tertiary)",
                    border: filterStatus === s ? "1px solid rgba(23,122,65,0.25)" : "1px solid transparent",
                  }}>
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-xl p-1"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}>
              <button
                onClick={() => setView("month")}
                className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                style={{
                  backgroundColor: view === "month" ? "var(--card)" : "transparent",
                  color: view === "month" ? "var(--ink-primary)" : "var(--ink-tertiary)",
                  boxShadow: view === "month" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                }}>
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                style={{
                  backgroundColor: view === "list" ? "var(--card)" : "transparent",
                  color: view === "list" ? "var(--ink-primary)" : "var(--ink-tertiary)",
                  boxShadow: view === "list" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                }}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Post</Button>
          </div>
        </div>

        {/* Calendar grid */}
        {view === "month" && (
          <div className="flex-1 flex flex-col min-h-0 rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}>
            {/* Day headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--border)" }}>
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2.5 text-center text-2xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--ink-tertiary)" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="flex-1 grid grid-cols-7 overflow-y-auto"
              style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalCells }, (_, i) => {
                const day = i - firstDay + 1;
                const isCurrentMonth = day >= 1 && day <= daysInMonth;
                const dayPosts = isCurrentMonth ? getPostsForDay(day) : [];
                const isCurrentDay = isCurrentMonth && isToday(day);

                return (
                  <div
                    key={i}
                    className="p-1.5 min-h-[90px] transition-colors"
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      borderRight: "1px solid var(--border-subtle)",
                      opacity: !isCurrentMonth ? 0.3 : 1,
                      backgroundColor: isCurrentDay ? "rgba(23,122,65,0.04)" : "transparent",
                    }}>
                    <div
                      className="mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: isCurrentDay ? "var(--brand-500)" : "transparent",
                        color: isCurrentDay ? "#ffffff" : "var(--ink-tertiary)",
                        boxShadow: isCurrentDay ? "0 0 10px rgba(23,122,65,0.4)" : "none",
                      }}>
                      {isCurrentMonth ? day : ""}
                    </div>
                    <div className="space-y-0.5">
                      {dayPosts.slice(0, 3).map((post) => (
                        <PostChip key={post.id} post={post} onClick={setSelectedPost} />
                      ))}
                      {dayPosts.length > 3 && (
                        <button className="text-2xs pl-1 transition-colors"
                          style={{ color: "var(--ink-tertiary)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
                          +{dayPosts.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List view */}
        {view === "list" && (
          <div className="flex-1 space-y-2 overflow-y-auto">
            {posts
              .filter((p) => filterStatus === "ALL" || p.status === filterStatus)
              .sort((a, b) => a.day - b.day || a.hour - b.hour)
              .map((post) => {
                const meta = STATUS_META[post.status];
                return (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="w-full flex items-start gap-4 rounded-xl p-4 transition-all text-left"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(23,122,65,0.2)";
                      e.currentTarget.style.backgroundColor = "rgba(23,122,65,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.backgroundColor = "var(--card)";
                    }}>
                    <div className="shrink-0 text-center min-w-[48px]">
                      <div className="text-lg font-bold leading-none" style={{ color: "var(--ink-primary)" }}>{post.day}</div>
                      <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{MONTHS[month].slice(0, 3)}</div>
                      <div className="text-2xs mt-0.5" style={{ color: "var(--brand-500)" }}>{post.hour}:00</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--ink-secondary)" }}>{post.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-1">
                          {post.platforms.map((p) => <PlatformIcon key={p} platform={p} size={13} />)}
                        </div>
                      </div>
                    </div>
                    <span
                      className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
                      {meta.label}
                    </span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetailPanel post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
