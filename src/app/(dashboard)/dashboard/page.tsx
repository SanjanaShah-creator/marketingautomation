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
    platforms: ["TWITTER", "LINKEDIN"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 2 * 3600000),
    status: "SCHEDULED",
    mediaCount: 0,
  },
  {
    id: "2", content: "Behind the scenes: how our team built the most intuitive social media scheduler in 6 weeks.",
    platforms: ["INSTAGRAM"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 5 * 3600000),
    status: "SCHEDULED",
    mediaCount: 3,
  },
  {
    id: "3", content: "Join us for our weekly Twitter Space on AI & Marketing this Friday at 3pm ET.",
    platforms: ["TWITTER"] as SocialPlatform[],
    scheduledAt: new Date(Date.now() + 26 * 3600000),
    status: "DRAFT",
    mediaCount: 0,
  },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-[#34d399]", text: "Instagram post published — 1.2K impressions", time: new Date(Date.now() - 30 * 60000) },
  { icon: Sparkles, color: "text-[#818cf8]", text: "AI generated 5 caption variations", time: new Date(Date.now() - 2 * 3600000) },
  { icon: Users, color: "text-[#60a5fa]", text: "Sarah joined your workspace", time: new Date(Date.now() - 4 * 3600000) },
  { icon: AlertCircle, color: "text-[#f87171]", text: "Twitter post failed — reconnect account", time: new Date(Date.now() - 6 * 3600000) },
];

const connectedAccounts = [
  { platform: "TWITTER" as SocialPlatform, handle: "@socialsync", followers: 4821 },
  { platform: "INSTAGRAM" as SocialPlatform, handle: "@socialsync.app", followers: 12300 },
  { platform: "LINKEDIN" as SocialPlatform, handle: "SocialSync", followers: 2940 },
];

// ── Custom tooltip ─────────────────────────────────────────────────────────

interface TooltipPayloadItem { name: string; value: number; color: string }
interface TooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#111420] shadow-2xl px-3 py-2.5 text-xs">
      <p className="font-semibold text-[#f1f3f9] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#8892aa] capitalize">{p.name}:</span>
          <span className="font-medium text-[#f1f3f9]">{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Content ideas ──────────────────────────────────────────────────────────

const contentIdeas = [
  {
    id: "1",
    platform: "TWITTER" as SocialPlatform,
    label: "Twitter",
    idea: "Share a data-backed insight about AI in marketing — your audience loves stats. Keep it under 280 chars with a hook first.",
    tag: "Thought leadership",
    color: "#1da1f2",
  },
  {
    id: "2",
    platform: "INSTAGRAM" as SocialPlatform,
    label: "Instagram",
    idea: "Post a behind-the-scenes look at how your team works. Authentic content is outperforming polished ads by 3× right now.",
    tag: "Behind the scenes",
    color: "#e1306c",
  },
  {
    id: "3",
    platform: "LINKEDIN" as SocialPlatform,
    label: "LinkedIn",
    idea: "Write a short lesson from a recent challenge your brand overcame. Vulnerable + educational posts get the highest saves.",
    tag: "Brand story",
    color: "#0a66c2",
  },
];

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f35] via-[#151929] to-[#0d0f17] border border-[rgba(97,114,243,0.2)] p-6"
      >
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(97,114,243,0.15)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)]" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#818cf8] mb-1">Good morning ☀️</p>
              <h2 className="text-xl font-bold text-[#f1f3f9] tracking-tight">
                Welcome back, Alex
              </h2>
              <p className="mt-1.5 text-sm text-[#8892aa] max-w-sm">
                You have <span className="text-[#f1f3f9] font-semibold">12 posts scheduled</span> this week.
                Your reach is up <span className="text-[#34d399] font-semibold">+24%</span> vs last week.
              </p>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="secondary" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
                AI Suggest
              </Button>
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Post
              </Button>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { label: "Scheduled", value: "12", icon: Calendar, color: "text-[#818cf8]" },
              { label: "Published today", value: "3", icon: CheckCircle2, color: "text-[#34d399]" },
              { label: "AI credits left", value: "32", icon: Sparkles, color: "text-[#a78bfa]" },
              { label: "Team members", value: "5", icon: Users, color: "text-[#60a5fa]" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className={cn("h-3.5 w-3.5", s.color)} />
                <span className="text-sm font-semibold text-[#f1f3f9]">{s.value}</span>
                <span className="text-xs text-[#4d5675]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Reach"
          value={34600}
          delta={24}
          icon={Eye}
          iconColor="#818cf8"
          iconBg="rgba(97,114,243,0.12)"
          sparkline={[2800, 3100, 3600, 4200, 5000, 7200, 6400]}
        />
        <StatCard
          label="Engagements"
          value={4180}
          delta={11}
          icon={Heart}
          iconColor="#f9a8d4"
          iconBg="rgba(249,168,212,0.12)"
          sparkline={[320, 380, 440, 520, 590, 820, 750]}
        />
        <StatCard
          label="Scheduled"
          value={12}
          icon={Clock}
          iconColor="#60a5fa"
          iconBg="rgba(96,165,250,0.12)"
          sparkline={[5, 8, 6, 10, 9, 14, 12]}
        />
        <StatCard
          label="Published"
          value={148}
          delta={8}
          icon={TrendingUp}
          iconColor="#34d399"
          iconBg="rgba(52,211,153,0.12)"
          sparkline={[18, 22, 20, 25, 23, 28, 26]}
        />
      </div>

      {/* Content ideas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f1f3f9]">Content ideas for today</h3>
            <p className="text-xs text-[#4d5675]">AI-generated based on your brand · SocialSync</p>
          </div>
          <button onClick={refreshIdeas} disabled={ideasRefreshing}
            className="flex items-center gap-1.5 text-xs text-[#818cf8] hover:text-[#6172f3] transition-colors disabled:opacity-50">
            <RefreshCw className={cn("h-3 w-3", ideasRefreshing && "animate-spin")} />
            {ideasRefreshing ? "Refreshing…" : "New ideas"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {contentIdeas.map((idea) => (
            <motion.div key={idea.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="group card-base p-4 flex flex-col gap-3 hover:border-[rgba(255,255,255,0.12)] transition-all">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={idea.platform} size={13} showBg />
                <span className="text-2xs font-medium" style={{ color: idea.color }}>{idea.label}</span>
                <span className="ml-auto rounded-full bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-2xs text-[#4d5675]">
                  {idea.tag}
                </span>
              </div>
              <p className="text-xs text-[#8892aa] leading-relaxed flex-1">{idea.idea}</p>
              <Link href="/compose">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[rgba(97,114,243,0.2)] bg-[rgba(97,114,243,0.06)] py-2 text-xs font-medium text-[#818cf8] hover:bg-[rgba(97,114,243,0.12)] hover:border-[rgba(97,114,243,0.35)] transition-all">
                  <Sparkles className="h-3 w-3" /> Compose post
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Engagement chart — 2 cols */}
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[#f1f3f9]">Performance overview</h3>
              <p className="text-xs text-[#4d5675]">Last 7 days across all platforms</p>
            </div>
            <div className="flex gap-1">
              {(["impressions", "engagements", "reach"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all",
                    chartMetric === m
                      ? "bg-[rgba(97,114,243,0.15)] text-[#818cf8] border border-[rgba(97,114,243,0.25)]"
                      : "text-[#4d5675] hover:text-[#8892aa]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={engagementData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6172f3" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6172f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#4d5675", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4d5675", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey={chartMetric}
                stroke="#6172f3"
                strokeWidth={2}
                fill="url(#colorGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#6172f3", stroke: "#111420", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Connected accounts */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#f1f3f9]">Social accounts</h3>
            <Link href="/accounts" className="text-xs text-[#818cf8] hover:text-[#6172f3] transition-colors flex items-center gap-1">
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {connectedAccounts.map((acc) => (
              <div key={acc.platform} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                <PlatformIcon platform={acc.platform} size={16} showBg />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#f1f3f9] truncate">{acc.handle}</p>
                  <p className="text-2xs text-[#4d5675]">{formatNumber(acc.followers)} followers</p>
                </div>
                <div className="flex h-1.5 w-1.5 rounded-full bg-[#10b981] shrink-0" />
              </div>
            ))}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[rgba(255,255,255,0.1)] py-3 text-xs text-[#4d5675] hover:border-[rgba(97,114,243,0.3)] hover:text-[#818cf8] transition-all">
              <Plus className="h-3.5 w-3.5" />
              Connect account
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled posts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scheduled posts */}
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#f1f3f9]">Upcoming posts</h3>
              <p className="text-xs text-[#4d5675]">Next 48 hours</p>
            </div>
            <div className="flex gap-2">
              <Link href="/calendar">
                <Button variant="secondary" size="xs" leftIcon={<Calendar className="h-3 w-3" />}>Calendar</Button>
              </Link>
              <Link href="/compose">
                <Button size="xs" leftIcon={<Plus className="h-3 w-3" />}>New</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {scheduledPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex gap-3 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-3.5 hover:border-[rgba(97,114,243,0.2)] hover:bg-[rgba(97,114,243,0.04)] transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-0.5 pt-0.5 min-w-[40px]">
                  <span className="text-2xs font-bold text-[#6172f3]">
                    {post.scheduledAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span className="text-2xs text-[#4d5675]">
                    {post.scheduledAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#c4cbdc] leading-relaxed line-clamp-2">
                    {truncate(post.content, 120)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {post.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size={12} />
                      ))}
                    </div>
                    {post.mediaCount > 0 && (
                      <span className="text-2xs text-[#4d5675]">+{post.mediaCount} media</span>
                    )}
                    <span className={cn(
                      "ml-auto text-2xs font-medium px-1.5 py-0.5 rounded-full",
                      post.status === "SCHEDULED" ? "badge-brand" : "badge-neutral"
                    )}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/scheduled" className="mt-3 flex items-center justify-center gap-1.5 py-2 text-xs text-[#4d5675] hover:text-[#8892aa] transition-colors">
            View all 12 scheduled posts <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Recent activity */}
        <div className="card-base p-5">
          <h3 className="text-sm font-semibold text-[#f1f3f9] mb-4">Recent activity</h3>
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.06)]" />
            {recentActivity.map((item, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <div className={cn("relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full mt-0.5", "bg-[#0d0f17]")}>
                  <item.icon className={cn("h-3 w-3", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#8892aa] leading-relaxed">{item.text}</p>
                  <p className="text-2xs text-[#4d5675] mt-0.5">{formatRelativeTime(item.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Quick Generate CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-[rgba(168,85,247,0.2)] bg-gradient-to-r from-[rgba(97,114,243,0.08)] to-[rgba(168,85,247,0.08)] p-5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(168,85,247,0.12)_0%,transparent_60%)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6172f3] to-[#a855f7]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f1f3f9]">Generate content with AI</p>
              <p className="text-xs text-[#8892aa]">Create a week&apos;s worth of posts in seconds. 32 credits remaining.</p>
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
