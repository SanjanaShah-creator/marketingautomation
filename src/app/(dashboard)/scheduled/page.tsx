"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Edit2, Trash2, Calendar, Filter, ChevronRight,
  CheckCircle2, AlertCircle, Pause, Plus, Sparkles, Check,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Platform SVGs ──────────────────────────────────────────────────────────

function TwitterSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>;
}
function InstagramSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
}
function LinkedInSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}

const PLATFORM_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Twitter: TwitterSvg, Instagram: InstagramSvg, LinkedIn: LinkedInSvg,
};
const PLATFORM_COLORS: Record<string, string> = {
  Twitter: "#1da1f2", Instagram: "#e1306c", LinkedIn: "#0a66c2",
};

// ── Types ──────────────────────────────────────────────────────────────────

type Status = "scheduled" | "failed" | "paused";
type Tab = "queue" | "weekplan";

interface ScheduledPost {
  id: string; content: string; platforms: string[];
  scheduledAt: Date; status: Status; imageUrl?: string;
}

interface WeekPost {
  id: string; content: string; platform: string;
  time: string; tags: string[];
}

// ── Mock data ──────────────────────────────────────────────────────────────

const now = new Date();
const d = (h: number) => new Date(now.getTime() + h * 3600000);

const mockPosts: ScheduledPost[] = [
  { id: "1", content: "🚀 Exciting news! We're launching our new AI-powered content suite next week. Early access spots are limited — sign up now to be first in line. #ProductLaunch #SaaS", platforms: ["Twitter", "LinkedIn"], scheduledAt: d(2),   status: "scheduled" },
  { id: "2", content: "Behind the scenes: our team sprint planning session. This is how we ship features fast while keeping quality high. ✨", platforms: ["Instagram"], scheduledAt: d(5),   status: "scheduled", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=320&h=200&fit=crop&auto=format&q=80" },
  { id: "3", content: "📊 New blog post: '10 social media metrics that actually matter in 2025'. Link in bio!", platforms: ["Twitter", "LinkedIn", "Instagram"], scheduledAt: d(18),  status: "failed" },
  { id: "4", content: "Customer spotlight: how @acmecorp grew their engagement by 3× in 60 days using our platform.", platforms: ["LinkedIn"], scheduledAt: d(26),  status: "scheduled" },
  { id: "5", content: "Weekend tip: batch your content creation on Fridays so you can enjoy your weekends ☀️ #WorkSmart", platforms: ["Twitter", "Instagram"], scheduledAt: d(36),  status: "paused" },
  { id: "6", content: "Q: What's the #1 mistake brands make on social media?\n\nA: Posting without a strategy.\n\nHere's the 3-step framework we use with our clients 🧵", platforms: ["Twitter"], scheduledAt: d(50),  status: "scheduled" },
  { id: "7", content: "Monday motivation: 'The best time to plant a tree was 20 years ago. The second best time is now.' Start building your social presence today 🌱", platforms: ["Instagram", "LinkedIn"], scheduledAt: d(72),  status: "scheduled" },
];

// ── Week plan data (Mon–Sun current week) ──────────────────────────────────

function getWeekDays() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const WEEK_SUGGESTIONS: Record<number, WeekPost[]> = {
  0: [ // Monday
    { id: "w0a", platform: "Twitter",   time: "09:00", tags: ["#MondayMotivation", "#Marketing"], content: "Monday mindset: The brands that win on social aren't the ones with the biggest budgets — they're the ones with the most consistent voice. What's yours? 💬 #MondayMotivation" },
    { id: "w0b", platform: "LinkedIn",  time: "17:00", tags: ["#ContentStrategy", "#B2B"],         content: "Starting this week with a question: How much time does your team spend on content creation vs. content strategy? Most brands have it backwards. Here's what we'd change 👇\n\n#ContentStrategy #MarketingLeadership" },
  ],
  1: [ // Tuesday
    { id: "w1a", platform: "Instagram", time: "11:00", tags: ["#ContentTips", "#BrandVoice"],    content: "3 things that actually grow your Instagram in 2025:\n\n1. Consistency > virality\n2. Comments > likes\n3. Saves = algorithm gold\n\nDouble tap if you're saving this 💜 #ContentTips #InstagramGrowth" },
    { id: "w1b", platform: "Twitter",   time: "15:00", tags: ["#SaaS", "#Marketing"],              content: "Hot take: Most 'social media strategies' are just posting schedules.\n\nA real strategy has: audience insight, voice guidelines, content pillars, and feedback loops.\n\nHow many of those does yours have? #MarketingStrategy" },
  ],
  2: [ // Wednesday
    { id: "w2a", platform: "LinkedIn",  time: "10:00", tags: ["#Leadership", "#AI"],               content: "We've been experimenting with AI-generated content for 6 months.\n\nHere's what surprised us most: the best outputs came when we gave the AI our brand guidelines, not just a topic.\n\nContext is everything. #AIMarketing #ContentCreation" },
    { id: "w2b", platform: "Instagram", time: "18:00", tags: ["#BehindTheScenes", "#Startup"],     content: "Midweek check-in ✨\n\nOur team just hit a milestone we've been working toward for 3 months. We can't share the details yet — but we can say we're incredibly proud.\n\nStay tuned 👀 #BuildInPublic" },
  ],
  3: [ // Thursday
    { id: "w3a", platform: "Twitter",   time: "09:00", tags: ["#ThrowbackThursday", "#Journey"],   content: "TBT to when our 'content calendar' was a sticky note on a monitor.\n\nNow it's AI-powered and schedules itself.\n\nGrowth is wild. 🙌 #ThrowbackThursday #FounderLife" },
    { id: "w3b", platform: "LinkedIn",  time: "16:00", tags: ["#DataDriven", "#Analytics"],        content: "Data point of the week: Posts published at 5–7 PM on weekdays get 34% more engagement than morning posts.\n\nWe've been running this experiment for 3 months.\n\nSave this and test it with your own audience 📊 #SocialMediaAnalytics" },
  ],
  4: [ // Friday
    { id: "w4a", platform: "Instagram", time: "12:00", tags: ["#FridayFeeling", "#TGIF"],          content: "It's Friday. You made it. 🎉\n\nQuick reminder: you don't need to post every day to grow. You need to post consistently with intention.\n\nSchedule your posts for next week this weekend. Your future self will thank you. 💜 #FridayFeeling #ContentCreator" },
    { id: "w4b", platform: "Twitter",   time: "17:00", tags: ["#WeekendRead", "#Marketing"],       content: "Weekend reading list for marketers:\n\n📖 'Building a Story Brand' by Donald Miller\n📖 'Contagious' by Jonah Berger\n📖 'This Is Marketing' by Seth Godin\n\nWhat's on your list? 👇 #MarketingBooks" },
  ],
  5: [ // Saturday
    { id: "w5a", platform: "Instagram", time: "10:00", tags: ["#Weekend", "#ContentCreation"],     content: "Saturday content tip ☀️\n\nBatch create your week's content in one sitting. Pick a topic, write 5 variations, schedule them spread out.\n\nYou'll save 4+ hours every week and never run out of ideas.\n\nSave this post 📌 #ContentBatching #SocialMediaTips" },
  ],
  6: [ // Sunday
    { id: "w6a", platform: "LinkedIn",  time: "19:00", tags: ["#SundayReflection", "#Growth"],     content: "Sunday reflection 🌙\n\nThis week I learned:\n→ Perfect is the enemy of published\n→ Your audience wants authenticity, not production value\n→ The best content answers a question your customer is already asking\n\nWhat did you learn this week? Share below 👇 #SundayReflection" },
  ],
};

// ── Status meta ──────────────────────────────────────────────────────────

const STATUS_META: Record<Status, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  scheduled: { label: "Scheduled", color: "text-[#34d399] bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.2)]",  icon: Clock },
  failed:    { label: "Failed",    color: "text-[#f87171] bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.2)]", icon: AlertCircle },
  paused:    { label: "Paused",    color: "text-[#fbbf24] bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.2)]",   icon: Pause },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function groupByDate(posts: ScheduledPost[]) {
  const groups: Record<string, ScheduledPost[]> = {};
  for (const p of posts) {
    const key = p.scheduledAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    (groups[key] ??= []).push(p);
  }
  return groups;
}

function timeLabel(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString();
}
function isTomorrow(date: Date) {
  const t = new Date(); t.setDate(t.getDate() + 1);
  return date.toDateString() === t.toDateString();
}
function smartDateLabel(raw: string, date: Date) {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return raw;
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Page ───────────────────────────────────────────────────────────────────

export default function ScheduledPage() {
  const [tab, setTab]     = useState<Tab>("queue");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [posts, setPosts]   = useState(mockPosts);

  // Week plan state
  const weekDays = getWeekDays();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(
    Object.values(WEEK_SUGGESTIONS).flat().map((p) => p.id)
  ));
  const [times, setTimes] = useState<Record<string, string>>(
    Object.fromEntries(Object.values(WEEK_SUGGESTIONS).flat().map((p) => [p.id, p.time]))
  );
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled]   = useState<Set<string>>(new Set());

  const filtered = posts.filter((p) => filter === "all" || p.status === filter);
  const grouped  = groupByDate([...filtered].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()));

  const counts = {
    all:       posts.length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    failed:    posts.filter((p) => p.status === "failed").length,
    paused:    posts.filter((p) => p.status === "paused").length,
  };

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function scheduleAll() {
    setScheduling(true);
    await new Promise((r) => setTimeout(r, 1800));
    setScheduled(new Set(selectedIds));
    setScheduling(false);
  }

  const allWeekPosts = Object.values(WEEK_SUGGESTIONS).flat();
  const selectedCount = selectedIds.size;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.05)]">
        <div>
          <h1 className="text-lg font-semibold text-[#f1f3f9]">Scheduled Posts</h1>
          <p className="text-xs text-[#4d5675] mt-0.5">
            {counts.scheduled} queued · {counts.failed > 0 ? `${counts.failed} failed` : "all good"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex items-center gap-0.5 rounded-xl bg-[rgba(255,255,255,0.04)] p-1">
            <button onClick={() => setTab("queue")}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                tab === "queue" ? "bg-[rgba(255,255,255,0.08)] text-[#f1f3f9]" : "text-[#4d5675] hover:text-[#8892aa]"
              )}>
              <Clock className="h-3.5 w-3.5" /> Queue
            </button>
            <button onClick={() => setTab("weekplan")}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                tab === "weekplan" ? "bg-[rgba(255,255,255,0.08)] text-[#f1f3f9]" : "text-[#4d5675] hover:text-[#8892aa]"
              )}>
              <CalendarDays className="h-3.5 w-3.5" /> Week Plan
              <span className="rounded-full bg-[rgba(97,114,243,0.2)] px-1.5 text-2xs text-[#8b9cf4]">AI</span>
            </button>
          </div>
          <Button size="sm" leftIcon={<Calendar className="h-3.5 w-3.5" />}>Schedule post</Button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Queue tab ── */}
        {tab === "queue" && (
          <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-1.5 px-6 py-3 border-b border-[rgba(255,255,255,0.04)]">
              {(["all", "scheduled", "failed", "paused"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize",
                    filter === f ? "bg-[rgba(255,255,255,0.08)] text-[#f1f3f9]" : "text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.04)]"
                  )}>
                  {f === "failed" && <AlertCircle className="h-3 w-3 text-[#f87171]" />}
                  {f === "paused" && <Pause className="h-3 w-3 text-[#fbbf24]" />}
                  {f}
                  <span className={cn("rounded-full px-1.5 py-0.5 text-2xs",
                    filter === f ? "bg-[rgba(97,114,243,0.3)] text-[#8b9cf4]" : "bg-[rgba(255,255,255,0.06)] text-[#4d5675]")}>
                    {counts[f]}
                  </span>
                </button>
              ))}
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.07)] px-2.5 py-1.5 text-xs text-[#4d5675] hover:text-[#8892aa] transition-colors">
                <Filter className="h-3 w-3" /> Platform
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {Object.entries(grouped).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.04)] mb-4">
                    <Calendar className="h-6 w-6 text-[#4d5675]" />
                  </div>
                  <p className="text-sm font-medium text-[#8892aa]">No scheduled posts</p>
                  <p className="text-xs text-[#4d5675] mt-1">Schedule a post or use the Week Plan</p>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-6">
                  {Object.entries(grouped).map(([dateLabel, datePosts]) => (
                    <div key={dateLabel}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={cn("text-xs font-semibold", isToday(datePosts[0].scheduledAt) ? "text-[#8b9cf4]" : "text-[#8892aa]")}>
                          {smartDateLabel(dateLabel, datePosts[0].scheduledAt)}
                        </span>
                        <div className="h-px flex-1 bg-[rgba(255,255,255,0.05)]" />
                        <span className="text-xs text-[#4d5675]">{datePosts.length} post{datePosts.length > 1 ? "s" : ""}</span>
                      </div>
                      <div className="space-y-2.5">
                        {datePosts.map((post, i) => {
                          const meta = STATUS_META[post.status];
                          const StatusIcon = meta.icon;
                          return (
                            <motion.div key={post.id}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                              className="group flex gap-3 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4 hover:border-[rgba(255,255,255,0.12)] transition-all">
                              <div className="w-16 shrink-0 pt-0.5">
                                <div className="text-xs font-semibold text-[#f1f3f9] tabular-nums">{timeLabel(post.scheduledAt)}</div>
                                <div className={cn("flex items-center gap-1 mt-1.5 rounded-full border px-1.5 py-0.5 text-2xs font-medium w-fit", meta.color)}>
                                  <StatusIcon className="h-2.5 w-2.5" />
                                  {meta.label}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#f1f3f9] leading-relaxed line-clamp-2">{post.content}</p>
                                {post.imageUrl && (
                                  <img src={post.imageUrl} alt="" className="mt-2.5 h-20 w-32 rounded-xl object-cover border border-[rgba(255,255,255,0.08)]" />
                                )}
                                <div className="flex items-center gap-1.5 mt-2.5">
                                  {post.platforms.map((p) => {
                                    const Icon = PLATFORM_ICONS[p];
                                    return Icon ? (
                                      <span key={p} className="flex h-5 w-5 items-center justify-center rounded-md" style={{ backgroundColor: `${PLATFORM_COLORS[p]}18` }}>
                                        <span style={{ color: PLATFORM_COLORS[p] }}><Icon className="h-3 w-3" /></span>
                                      </span>
                                    ) : null;
                                  })}
                                  <span className="text-2xs text-[#4d5675]">{post.platforms.join(", ")}</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[#4d5675] hover:text-[#f1f3f9] transition-colors">
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setPosts((p) => p.filter((x) => x.id !== post.id))}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#4d5675] hover:text-[#f87171] transition-colors">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[#4d5675] hover:text-[#f1f3f9] transition-colors">
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Week Plan tab ── */}
        {tab === "weekplan" && (
          <motion.div key="weekplan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 min-h-0">
            {/* Week header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#6172f3] to-[#a855f7]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#f1f3f9]">
                    Week of {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                    {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-2xs text-[#4d5675] ml-2">AI-generated brand content</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#4d5675]">{selectedCount} of {allWeekPosts.length} selected</span>
                <Button size="sm" loading={scheduling} onClick={scheduleAll}
                  disabled={selectedCount === 0 || scheduled.size > 0}
                  leftIcon={scheduled.size > 0 ? <Check className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}>
                  {scheduled.size > 0 ? `${scheduled.size} posts scheduled!` : `Schedule ${selectedCount} posts`}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {weekDays.map((day, dayIdx) => {
                const dayPosts = WEEK_SUGGESTIONS[dayIdx] ?? [];
                if (dayPosts.length === 0) return null;
                const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                return (
                  <div key={dayIdx}>
                    {/* Day heading */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("text-xs font-semibold", isToday(day) ? "text-[#8b9cf4]" : "text-[#8892aa]")}>
                          {DAY_NAMES[dayIdx]}
                        </div>
                        <div className="text-2xs text-[#4d5675]">
                          {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        {isToday(day) && (
                          <span className="rounded-full bg-[rgba(97,114,243,0.2)] border border-[rgba(97,114,243,0.3)] px-2 py-0.5 text-2xs font-medium text-[#8b9cf4]">Today</span>
                        )}
                      </div>
                      <div className="h-px flex-1 bg-[rgba(255,255,255,0.05)]" />
                    </div>

                    <div className="space-y-2">
                      {dayPosts.map((post) => {
                        const isSelected = selectedIds.has(post.id);
                        const isScheduledDone = scheduled.has(post.id);
                        const Icon = PLATFORM_ICONS[post.platform];
                        const color = PLATFORM_COLORS[post.platform];
                        return (
                          <div key={post.id}
                            className={cn("flex items-start gap-3 rounded-2xl border p-4 transition-all",
                              isScheduledDone
                                ? "border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.05)]"
                                : isSelected
                                  ? "border-[rgba(97,114,243,0.3)] bg-[rgba(97,114,243,0.06)]"
                                  : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] opacity-60"
                            )}>
                            {/* Checkbox */}
                            <button onClick={() => !isScheduledDone && toggleId(post.id)}
                              disabled={isScheduledDone || isPast}
                              className={cn("shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all mt-0.5",
                                isScheduledDone
                                  ? "border-[#34d399] bg-[#34d399]"
                                  : isSelected
                                    ? "border-[#6172f3] bg-[#6172f3]"
                                    : "border-[rgba(255,255,255,0.2)] hover:border-[rgba(97,114,243,0.5)]"
                              )}>
                              {(isSelected || isScheduledDone) && <Check className="h-3 w-3 text-white" />}
                            </button>

                            {/* Platform badge */}
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
                              style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30`, color }}>
                              {Icon && <Icon className="h-3.5 w-3.5" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[#c4cbdc] leading-relaxed line-clamp-3">{post.content}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.map((t) => (
                                  <span key={t} className="text-2xs text-[#4d5675] bg-[rgba(255,255,255,0.05)] rounded-full px-2 py-0.5">{t}</span>
                                ))}
                              </div>
                            </div>

                            {/* Time picker */}
                            <div className="shrink-0 flex flex-col items-end gap-1.5">
                              <input
                                type="time"
                                value={times[post.id] ?? post.time}
                                onChange={(e) => setTimes((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                disabled={isScheduledDone}
                                className="h-8 w-24 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] px-2 text-xs text-[#f1f3f9] focus:outline-none focus:border-[rgba(97,114,243,0.5)] [color-scheme:dark] disabled:opacity-50"
                              />
                              {isScheduledDone && (
                                <span className="text-2xs text-[#34d399] flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Scheduled
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Bottom CTA */}
              <div className="flex items-center justify-between rounded-2xl border border-[rgba(97,114,243,0.2)] bg-[rgba(97,114,243,0.06)] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#f1f3f9]">{selectedCount} posts ready to schedule</p>
                  <p className="text-xs text-[#4d5675]">Posts will go live at your selected times. You can edit any post before publishing.</p>
                </div>
                <Button size="sm" loading={scheduling} onClick={scheduleAll}
                  disabled={selectedCount === 0 || scheduled.size > 0}>
                  {scheduled.size > 0 ? "✓ All scheduled" : `Schedule ${selectedCount} posts`}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
