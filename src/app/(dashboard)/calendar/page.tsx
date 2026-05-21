"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Grid3X3, List, Clock,
  Filter, X, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { cn, truncate, formatRelativeTime } from "@/lib/utils";
import type { SocialPlatform, PostStatus } from "@/types";

// ── Mock data ──────────────────────────────────────────────────────────────

interface CalPost {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  status: PostStatus;
  hour: number;
  day: number;
  mediaCount: number;
}

function generatePosts(year: number, month: number): CalPost[] {
  const posts: CalPost[] = [
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
  return posts;
}

const STATUS_META: Record<PostStatus, { label: string; className: string; dot: string }> = {
  PUBLISHED:  { label: "Published",  className: "bg-[rgba(16,185,129,0.15)] text-[#34d399]",  dot: "bg-[#34d399]" },
  SCHEDULED:  { label: "Scheduled",  className: "bg-[rgba(97,114,243,0.15)] text-[#818cf8]",  dot: "bg-[#6172f3]" },
  DRAFT:      { label: "Draft",      className: "bg-[rgba(255,255,255,0.06)] text-[#8892aa]",  dot: "bg-[#8892aa]" },
  PUBLISHING: { label: "Publishing", className: "bg-[rgba(245,158,11,0.15)] text-[#fbbf24]",  dot: "bg-[#f59e0b]" },
  FAILED:     { label: "Failed",     className: "bg-[rgba(239,68,68,0.15)] text-[#f87171]",   dot: "bg-[#ef4444]" },
  ARCHIVED:   { label: "Archived",   className: "bg-[rgba(255,255,255,0.06)] text-[#4d5675]",  dot: "bg-[#4d5675]" },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function PostChip({ post, onClick }: { post: CalPost; onClick: (p: CalPost) => void }) {
  const meta = STATUS_META[post.status];
  return (
    <button
      onClick={() => onClick(post)}
      className={cn(
        "group w-full rounded-lg px-2 py-1.5 text-left transition-all hover:brightness-125",
        meta.className
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="flex gap-0.5">
          {post.platforms.slice(0, 2).map((p) => (
            <PlatformIcon key={p} platform={p} size={10} />
          ))}
          {post.platforms.length > 2 && (
            <span className="text-2xs opacity-60">+{post.platforms.length - 2}</span>
          )}
        </span>
        <span className="text-2xs opacity-60">{post.hour}:00</span>
      </div>
      <p className="text-2xs leading-tight truncate">{post.content}</p>
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
      className="w-72 flex flex-col shrink-0"
    >
      <div className="card-base flex-1 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border", meta.className, "border-current/20")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
            {meta.label}
          </span>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-[#4d5675] hover:text-[#f1f3f9] hover:bg-[rgba(255,255,255,0.06)] transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-[#c4cbdc] leading-relaxed">{post.content}</p>

        {/* Platforms */}
        <div>
          <p className="text-2xs font-medium text-[#4d5675] mb-2">Platforms</p>
          <div className="flex flex-wrap gap-1.5">
            {post.platforms.map((p) => (
              <div key={p} className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] px-2 py-1">
                <PlatformIcon platform={p} size={12} />
                <span className="text-2xs text-[#8892aa]">{p.charAt(0) + p.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-xs text-[#8892aa]">
          <Clock className="h-3.5 w-3.5 text-[#4d5675]" />
          Scheduled: Day {post.day} at {post.hour}:00
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)] mt-auto">
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

  const posts = useMemo(() => generatePosts(year, month), [year, month]);

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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] p-1">
              <button onClick={prevMonth} className="h-7 w-7 flex items-center justify-center rounded-lg text-[#4d5675] hover:text-[#f1f3f9] hover:bg-[rgba(255,255,255,0.08)] transition-all">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-semibold text-[#f1f3f9]">
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth} className="h-7 w-7 flex items-center justify-center rounded-lg text-[#4d5675] hover:text-[#f1f3f9] hover:bg-[rgba(255,255,255,0.08)] transition-all">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
              className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-[#8892aa] hover:text-[#f1f3f9] hover:border-[rgba(255,255,255,0.14)] transition-all"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Status filter */}
            <div className="flex items-center gap-1">
              {(["ALL", "SCHEDULED", "PUBLISHED", "DRAFT"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                    filterStatus === s
                      ? "bg-[rgba(97,114,243,0.15)] text-[#818cf8] border border-[rgba(97,114,243,0.25)]"
                      : "text-[#4d5675] hover:text-[#8892aa]"
                  )}
                >
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] p-1">
              <button
                onClick={() => setView("month")}
                className={cn("h-7 w-7 flex items-center justify-center rounded-lg transition-all", view === "month" ? "bg-[rgba(255,255,255,0.1)] text-[#f1f3f9]" : "text-[#4d5675] hover:text-[#8892aa]")}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("h-7 w-7 flex items-center justify-center rounded-lg transition-all", view === "list" ? "bg-[rgba(255,255,255,0.1)] text-[#f1f3f9]" : "text-[#4d5675] hover:text-[#8892aa]")}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Post</Button>
          </div>
        </div>

        {/* Calendar grid */}
        {view === "month" && (
          <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[rgba(255,255,255,0.05)]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2.5 text-center text-2xs font-semibold uppercase tracking-widest text-[#4d5675]">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="flex-1 grid grid-cols-7 overflow-y-auto" style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalCells }, (_, i) => {
                const day = i - firstDay + 1;
                const isCurrentMonth = day >= 1 && day <= daysInMonth;
                const dayPosts = isCurrentMonth ? getPostsForDay(day) : [];
                const isCurrentDay = isCurrentMonth && isToday(day);

                return (
                  <div
                    key={i}
                    className={cn(
                      "border-b border-r border-[rgba(255,255,255,0.04)] p-1.5 min-h-[90px] transition-colors",
                      !isCurrentMonth && "opacity-25",
                      isCurrentDay && "bg-[rgba(97,114,243,0.05)]"
                    )}
                  >
                    <div className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isCurrentDay
                        ? "bg-[#6172f3] text-white shadow-[0_0_12px_rgba(97,114,243,0.5)]"
                        : "text-[#4d5675] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#8892aa]"
                    )}>
                      {isCurrentMonth ? day : ""}
                    </div>
                    <div className="space-y-0.5">
                      {dayPosts.slice(0, 3).map((post) => (
                        <PostChip key={post.id} post={post} onClick={setSelectedPost} />
                      ))}
                      {dayPosts.length > 3 && (
                        <button className="text-2xs text-[#4d5675] hover:text-[#8892aa] pl-1 transition-colors">
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
                    className="w-full flex items-start gap-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 hover:border-[rgba(97,114,243,0.2)] hover:bg-[rgba(97,114,243,0.04)] transition-all text-left"
                  >
                    <div className="shrink-0 text-center min-w-[48px]">
                      <div className="text-lg font-bold text-[#f1f3f9] leading-none">{post.day}</div>
                      <div className="text-2xs text-[#4d5675]">{MONTHS[month].slice(0, 3)}</div>
                      <div className="text-2xs text-[#818cf8] mt-0.5">{post.hour}:00</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#c4cbdc] leading-relaxed line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-1">
                          {post.platforms.map((p) => <PlatformIcon key={p} platform={p} size={13} />)}
                        </div>
                      </div>
                    </div>
                    <span className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
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
