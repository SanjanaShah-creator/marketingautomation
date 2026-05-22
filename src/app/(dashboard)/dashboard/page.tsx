"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Clock, Plus, ArrowRight,
  TrendingUp, Eye, Heart,
  CheckCircle2, AlertCircle, Calendar, Sparkles, ChevronRight, RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { formatRelativeTime, formatNumber, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SocialPlatform } from "@/types";

// ── Mock data ──────────────────────────────────────────────────────────────

const engagementData = [
  { day: "Mon", impressions: 4200, engagements: 380, reach: 3100 },
  { day: "Tue", impressions: 5800, engagements: 520, reach: 4200 },
  { day: "Wed", impressions: 4900, engagements: 440, reach: 3600 },
  { day: "Thu", impressions: 7200, engagements: 680, reach: 5400 },
  { day: "Fri", impressions: 6800, engagements: 590, reach: 5000 },
  { day: "Sat", impressions: 9100, engagements: 820, reach: 7200 },
  { day: "Sun", impressions: 8300, engagements: 750, reach: 6400 },
];

const scheduledPosts = [
  {
    id: "1", content: "Excited to share our latest feature drop! 🚀 The AI content engine is now 3x faster with smarter suggestions.",
    platforms: ["INSTAGRAM", "LINKEDIN"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 2 * 3600000), status: "SCHEDULED", mediaCount: 0,
  },
  {
    id: "2", content: "Behind the scenes: how our team built the most intuitive social media scheduler in 6 weeks.",
    platforms: ["INSTAGRAM"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 5 * 3600000), status: "SCHEDULED", mediaCount: 3,
  },
  {
    id: "3", content: "Join us for our live session on AI & Marketing this Friday at 3pm ET.",
    platforms: ["INSTAGRAM", "LINKEDIN"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 26 * 3600000), status: "DRAFT", mediaCount: 0,
  },
];

const recentActivity = [
  { icon: CheckCircle2, color: "var(--success)", text: "Instagram post published — 1.2K impressions",  time: new Date(Date.now() - 30 * 60000) },
  { icon: Sparkles,    color: "var(--brand-500)", text: "AI generated 5 caption variations",           time: new Date(Date.now() - 2 * 3600000) },
  { icon: Users,       color: "var(--info)",      text: "Sarah joined your workspace",                  time: new Date(Date.now() - 4 * 3600000) },
  { icon: AlertCircle, color: "var(--danger)",    text: "Instagram post failed — reconnect account",    time: new Date(Date.now() - 6 * 3600000) },
];

const connectedAccounts = [
  { platform: "INSTAGRAM" as SocialPlatform, handle: "@socialsync.app", followers: 12300 },
  { platform: "LINKEDIN"  as SocialPlatform, handle: "SocialSync",       followers: 2940  },
  { platform: "FACEBOOK"  as SocialPlatform, handle: "SocialSync",       followers: 5100  },
];

const contentIdeas = [
  { id: "1", platform: "INSTAGRAM" as SocialPlatform, label: "Instagram", color: "#e1306c", tag: "Reels idea",          idea: "Create a short Reel showing before/after results. Reels get 3× more reach than static posts right now." },
  { id: "2", platform: "LINKEDIN"  as SocialPlatform, label: "LinkedIn",  color: "#0a66c2", tag: "Thought leadership",  idea: "Share a data-backed insight about AI in marketing — your audience loves stats with a strong opening hook." },
  { id: "3", platform: "INSTAGRAM" as SocialPlatform, label: "Instagram", color: "#e1306c", tag: "Behind the scenes",   idea: "Post a behind-the-scenes look at how your team works. Authentic content is outperforming polished ads by 3×." },
];

// ── Chart tooltip ─────────────────────────────────────────────────────────

interface TooltipPayloadItem { name: string; value: number; color: string }
interface TooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-lg px-3 py-2.5 text-sm border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border-strong)" }}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--ink-primary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize" style={{ color: "var(--ink-tertiary)" }}>{p.name}:</span>
          <span className="font-medium" style={{ color: "var(--ink-primary)" }}>{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [chartMetric, setChartMetric] = useState<"impressions" | "engagements" | "reach">("impressions");
  const [ideasRefreshing, setIdeasRefreshing] = useState(false);

  async function refreshIdeas() {
    setIdeasRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIdeasRefreshing(false);
  }

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border p-6"
        style={{
          background: "linear-gradient(135deg, var(--surface-300), var(--surface-150) 50%, var(--surface-50))",
          borderColor: "rgba(23,122,65,0.2)",
        }}
      >
        <div className="absolute right-0 top-0 h-full w-1/3"
          style={{ background: "radial-gradient(ellipse at top right, rgba(23,122,65,0.12) 0%, transparent 70%)" }} />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--brand-500)" }}>Good morning ☀️</p>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>
                Welcome back, Alex
              </h2>
              <p className="mt-1.5 text-sm max-w-sm" style={{ color: "var(--ink-secondary)" }}>
                You have{" "}
                <span className="font-semibold" style={{ color: "var(--ink-primary)" }}>12 posts scheduled</span>{" "}
                this week. Reach is up{" "}
                <span className="font-semibold" style={{ color: "var(--success)" }}>+24%</span> vs last week.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="secondary" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
                AI Suggest
              </Button>
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Post
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Scheduled",       value: "12", icon: Calendar,     color: "var(--brand-500)" },
              { label: "Published today", value: "3",  icon: CheckCircle2, color: "var(--success)" },
              { label: "AI credits left", value: "32", icon: Sparkles,     color: "var(--brand-500)" },
              { label: "Team members",    value: "5",  icon: Users,        color: "var(--info)" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{s.value}</span>
                <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reach"  value={34600} delta={24} icon={Eye}       iconColor="#177A41" iconBg="rgba(23,122,65,0.1)"  sparkline={[2800,3100,3600,4200,5000,7200,6400]} />
        <StatCard label="Engagements" value={4180}  delta={11} icon={Heart}     iconColor="#e1306c" iconBg="rgba(225,48,108,0.1)" sparkline={[320,380,440,520,590,820,750]} />
        <StatCard label="Scheduled"   value={12}            icon={Clock}     iconColor="#0a66c2" iconBg="rgba(10,102,194,0.1)"  sparkline={[5,8,6,10,9,14,12]} />
        <StatCard label="Published"   value={148}   delta={8}  icon={TrendingUp} iconColor="#166534" iconBg="rgba(22,101,52,0.1)"  sparkline={[18,22,20,25,23,28,26]} />
      </div>

      {/* Content ideas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Content ideas for today</h3>
            <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>AI-generated based on your brand · SocialSync</p>
          </div>
          <button onClick={refreshIdeas} disabled={ideasRefreshing}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ color: "var(--brand-500)" }}>
            <RefreshCw className={cn("h-3.5 w-3.5", ideasRefreshing && "animate-spin")} />
            {ideasRefreshing ? "Refreshing…" : "New ideas"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {contentIdeas.map((idea) => (
            <motion.div key={idea.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="card-base p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={idea.platform} size={14} showBg />
                <span className="text-sm font-medium" style={{ color: idea.color }}>{idea.label}</span>
                <span className="ml-auto rounded-full px-2 py-0.5 text-xs"
                  style={{ backgroundColor: "var(--surface-100)", color: "var(--ink-tertiary)" }}>
                  {idea.tag}
                </span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--ink-secondary)" }}>{idea.idea}</p>
              <Link href="/compose">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-medium transition-all"
                  style={{ borderColor: "rgba(23,122,65,0.25)", backgroundColor: "rgba(23,122,65,0.06)", color: "var(--brand-500)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(23,122,65,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(23,122,65,0.06)"; }}>
                  <Sparkles className="h-3.5 w-3.5" /> Compose post
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main grid: chart + accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Performance overview</h3>
              <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Last 7 days across all platforms</p>
            </div>
            <div className="flex gap-1">
              {(["impressions", "engagements", "reach"] as const).map((m) => (
                <button key={m} onClick={() => setChartMetric(m)}
                  className="rounded-lg px-2.5 py-1 text-sm font-medium capitalize transition-all border"
                  style={chartMetric === m ? {
                    backgroundColor: "rgba(23,122,65,0.1)",
                    color: "var(--brand-500)",
                    borderColor: "rgba(23,122,65,0.25)",
                  } : {
                    color: "var(--ink-tertiary)",
                    borderColor: "transparent",
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={engagementData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#177A41" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#177A41" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#476B52", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#476B52", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey={chartMetric} stroke="#177A41" strokeWidth={2}
                fill="url(#brandGrad)" dot={false}
                activeDot={{ r: 4, fill: "#177A41", stroke: "#FFFFFF", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Social accounts</h3>
            <Link href="/accounts" className="text-sm font-medium transition-colors flex items-center gap-1"
              style={{ color: "var(--brand-500)" }}>
              Manage <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {connectedAccounts.map((acc) => (
              <div key={acc.platform} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}>
                <PlatformIcon platform={acc.platform} size={16} showBg />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--ink-primary)" }}>{acc.handle}</p>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{formatNumber(acc.followers)} followers</p>
                </div>
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--success)" }} />
              </div>
            ))}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm transition-all"
              style={{ borderColor: "var(--border-strong)", color: "var(--ink-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-500)"; e.currentTarget.style.color = "var(--brand-500)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
              <Plus className="h-3.5 w-3.5" /> Connect account
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled posts + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Upcoming posts</h3>
              <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Next 48 hours</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/calendar" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Calendar
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/compose" className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {scheduledPosts.map((post, i) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex gap-3 rounded-xl border p-3.5 transition-all cursor-pointer"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-50)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(23,122,65,0.3)"; e.currentTarget.style.backgroundColor = "rgba(23,122,65,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}>
                <div className="flex flex-col items-center gap-0.5 pt-0.5 min-w-[44px]">
                  <span className="text-xs font-bold" style={{ color: "var(--brand-500)" }}>
                    {post.scheduledAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                    {post.scheduledAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--ink-secondary)" }}>
                    {truncate(post.content, 120)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {post.platforms.map((p) => <PlatformIcon key={p} platform={p} size={12} />)}
                    </div>
                    {post.mediaCount > 0 && <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>+{post.mediaCount} media</span>}
                    <span className={cn("ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                      post.status === "SCHEDULED" ? "badge-brand" : "badge-neutral")}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/scheduled" className="mt-3 flex items-center justify-center gap-1.5 py-2 text-sm transition-colors"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-500)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
            View all 12 scheduled posts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="card-base p-5">
          <h3 className="text-base font-semibold mb-4" style={{ color: "var(--ink-primary)" }}>Recent activity</h3>
          <div className="relative space-y-4">
            <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ backgroundColor: "var(--border)" }} />
            {recentActivity.map((item, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full mt-0.5"
                  style={{ backgroundColor: "var(--card)" }}>
                  <item.icon className="h-3 w-3" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{formatRelativeTime(item.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl border p-5"
        style={{ backgroundColor: "var(--brand-50)", borderColor: "rgba(23,122,65,0.2)" }}
      >
        <div className="absolute right-0 top-0 h-full w-1/3"
          style={{ background: "radial-gradient(ellipse at top right, rgba(23,122,65,0.1) 0%, transparent 70%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #177A41, #0F5E31)" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Generate content with AI</p>
              <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>Create a week&apos;s worth of posts in seconds. 32 credits remaining.</p>
            </div>
          </div>
          <Button variant="brand" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />} className="shrink-0">
            Generate now
          </Button>
        </div>
      </motion.div>

    </div>
  );
}
