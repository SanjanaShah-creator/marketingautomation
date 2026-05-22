"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, Heart, Users, TrendingUp, ArrowUpRight, ArrowDownRight,
  BarChart2, Zap, ExternalLink,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { formatNumber } from "@/lib/utils";
import type { SocialPlatform } from "@/types";

// ── Mock data ──────────────────────────────────────────────────────────────

const RANGES = ["7 days", "30 days", "90 days"] as const;
type Range = typeof RANGES[number];

const DATA_BY_RANGE: Record<Range, { label: string; reach: number; engagements: number; followers: number }[]> = {
  "7 days": [
    { label: "Mon", reach: 4200,  engagements: 380,  followers: 12 },
    { label: "Tue", reach: 5800,  engagements: 520,  followers: 28 },
    { label: "Wed", reach: 4900,  engagements: 440,  followers: 15 },
    { label: "Thu", reach: 7200,  engagements: 680,  followers: 44 },
    { label: "Fri", reach: 6800,  engagements: 590,  followers: 31 },
    { label: "Sat", reach: 9100,  engagements: 820,  followers: 67 },
    { label: "Sun", reach: 8300,  engagements: 750,  followers: 53 },
  ],
  "30 days": [
    { label: "W1", reach: 22000, engagements: 1900, followers: 120 },
    { label: "W2", reach: 28400, engagements: 2400, followers: 195 },
    { label: "W3", reach: 31200, engagements: 2800, followers: 240 },
    { label: "W4", reach: 39800, engagements: 3600, followers: 310 },
  ],
  "90 days": [
    { label: "Jan", reach: 68000,  engagements: 5800,  followers: 420 },
    { label: "Feb", reach: 82000,  engagements: 7200,  followers: 580 },
    { label: "Mar", reach: 105000, engagements: 9400,  followers: 820 },
  ],
};

const STAT_DELTAS: Record<Range, { reach: number; engagements: number; followers: number; posts: number }> = {
  "7 days":  { reach: 24, engagements: 11, followers: 18, posts:  8 },
  "30 days": { reach: 41, engagements: 22, followers: 34, posts: 15 },
  "90 days": { reach: 68, engagements: 45, followers: 71, posts: 32 },
};

const PLATFORM_STATS: { name: string; platform: SocialPlatform; reach: number; engagements: number; followers: number; posts: number; color: string; engRate: number }[] = [
  { name: "Twitter",   platform: "TWITTER",   reach: 18200, engagements: 1640, followers: 4821,  posts: 24, color: "#1da1f2", engRate: 4.2 },
  { name: "Instagram", platform: "INSTAGRAM", reach: 12400, engagements: 2100, followers: 12300, posts: 18, color: "#e1306c", engRate: 6.8 },
  { name: "LinkedIn",  platform: "LINKEDIN",  reach:  4000, engagements:  440, followers:  2940, posts:  9, color: "#0a66c2", engRate: 3.1 },
];

const TOP_POSTS = [
  { id: "1", content: "🚀 AI content generation just got smarter. Most teams spend 6+ hrs/week writing posts. We turned that into 6 minutes.", platform: "TWITTER" as SocialPlatform,   reach: 9100, engagements: 820, engRate: 9.0, date: "May 17" },
  { id: "2", content: "Behind every great post is a great strategy ✨ We've been quietly building something that helps brands show up consistently.", platform: "INSTAGRAM" as SocialPlatform, reach: 7200, engagements: 680, engRate: 9.4, date: "May 15" },
  { id: "3", content: "After analyzing 10,000 LinkedIn posts, here's what separates viral content from posts that get 12 likes:", platform: "LINKEDIN" as SocialPlatform,  reach: 5800, engagements: 520, engRate: 8.7, date: "May 13" },
  { id: "4", content: "Hot take: Your brand voice matters more than your posting frequency. Consistency in tone builds trust.", platform: "TWITTER" as SocialPlatform,   reach: 4900, engagements: 440, engRate: 6.2, date: "May 12" },
  { id: "5", content: "This is what your content calendar looks like with AI 🤯 Week 1: Done ✅ Week 2: Done ✅ Week 3: Done ✅", platform: "INSTAGRAM" as SocialPlatform, reach: 4200, engagements: 380, engRate: 5.8, date: "May 9" },
];

const BEST_HOURS = [
  { hour: "6 AM", score: 22 }, { hour: "8 AM", score: 68 }, { hour: "9 AM", score: 88 },
  { hour: "10 AM", score: 74 }, { hour: "12 PM", score: 62 }, { hour: "1 PM", score: 54 },
  { hour: "3 PM", score: 48 }, { hour: "5 PM", score: 80 }, { hour: "6 PM", score: 95 },
  { hour: "7 PM", score: 90 }, { hour: "8 PM", score: 72 }, { hour: "10 PM", score: 34 },
];

// ── Sub-components ─────────────────────────────────────────────────────────

interface TooltipPayloadItem { name: string; value: number; color: string }
interface TooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-lg px-3 py-2.5 text-xs"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--ink-primary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize" style={{ color: "var(--ink-tertiary)" }}>{p.name}:</span>
          <span className="font-medium" style={{ color: "var(--ink-primary)" }}>{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function HourTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-lg px-3 py-2 text-xs"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
      <p className="font-medium" style={{ color: "var(--ink-primary)" }}>{label}</p>
      <p style={{ color: "var(--ink-tertiary)" }}>
        Engagement score:{" "}
        <span className="font-bold" style={{ color: "var(--brand-500)" }}>{payload[0].value}</span>
      </p>
    </div>
  );
}

interface StatCardProps {
  label: string; value: string; delta: number;
  icon: React.FC<{ className?: string }>; iconColor: string; iconBg: string; sub?: string;
}

function StatCard({ label, value, delta, icon: Icon, iconColor, iconBg, sub }: StatCardProps) {
  const up = delta >= 0;
  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon className="h-4 w-4" />
        </div>
        <div
          className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-2xs font-medium"
          style={{
            backgroundColor: up ? "rgba(22,101,52,0.1)" : "rgba(155,28,28,0.1)",
            color: up ? "var(--success)" : "var(--danger)",
          }}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta)}%
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{label}</p>
      {sub && <p className="text-2xs mt-1" style={{ color: "var(--ink-muted)" }}>{sub}</p>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("7 days");
  const [metric, setMetric] = useState<"reach" | "engagements" | "followers">("reach");

  const data = DATA_BY_RANGE[range];
  const deltas = STAT_DELTAS[range];

  const totalReach = data.reduce((s, d) => s + d.reach, 0);
  const totalEng   = data.reduce((s, d) => s + d.engagements, 0);
  const totalFol   = data.reduce((s, d) => s + d.followers, 0);
  const engRate    = ((totalEng / totalReach) * 100).toFixed(1);

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--ink-primary)" }}>Analytics</h2>
          <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Performance across all connected platforms</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--surface-100)" }}>
          {RANGES.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: range === r ? "var(--card)" : "transparent",
                color: range === r ? "var(--ink-primary)" : "var(--ink-tertiary)",
                boxShadow: range === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard label="Total reach" value={formatNumber(totalReach)} delta={deltas.reach}
            icon={Eye} iconColor="var(--brand-500)" iconBg="rgba(23,122,65,0.1)" sub="Unique accounts reached" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard label="Engagements" value={formatNumber(totalEng)} delta={deltas.engagements}
            icon={Heart} iconColor="#e11d48" iconBg="rgba(225,29,72,0.1)" sub="Likes, comments, shares" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="Followers gained" value={`+${formatNumber(totalFol)}`} delta={deltas.followers}
            icon={Users} iconColor="#0a66c2" iconBg="rgba(10,102,194,0.1)" sub="New followers this period" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard label="Engagement rate" value={`${engRate}%`} delta={deltas.posts}
            icon={TrendingUp} iconColor="var(--success)" iconBg="rgba(22,101,52,0.1)" sub="Avg across all posts" />
        </motion.div>
      </div>

      {/* Main chart */}
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Performance over time</h3>
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>All platforms combined</p>
          </div>
          <div className="flex gap-1">
            {(["reach", "engagements", "followers"] as const).map((m) => (
              <button key={m} onClick={() => setMetric(m)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all"
                style={{
                  backgroundColor: metric === m ? "rgba(23,122,65,0.1)" : "transparent",
                  color: metric === m ? "var(--brand-500)" : "var(--ink-tertiary)",
                  border: metric === m ? "1px solid rgba(23,122,65,0.25)" : "1px solid transparent",
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#177A41" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#177A41" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#476B52", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#476B52", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey={metric} stroke="#177A41" strokeWidth={2}
              fill="url(#aGrad)" dot={false}
              activeDot={{ r: 4, fill: "#177A41", stroke: "#ffffff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Platform breakdown + Top posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Platform breakdown */}
        <div className="card-base p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink-primary)" }}>Platform breakdown</h3>
          <div className="space-y-4">
            {PLATFORM_STATS.map((p) => {
              const pct = (p.reach / PLATFORM_STATS.reduce((s, x) => s + x.reach, 0)) * 100;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={p.platform} size={13} showBg />
                      <span className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>{p.name}</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{formatNumber(p.reach)} reach</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: p.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{p.posts} posts · {formatNumber(p.followers)} followers</span>
                    <span className="text-2xs font-medium" style={{ color: p.color }}>{p.engRate}% eng.</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-2xs font-medium mb-3" style={{ color: "var(--ink-tertiary)" }}>Best performing platform</p>
            <div className="flex items-center gap-2.5 rounded-xl p-3"
              style={{ backgroundColor: "rgba(225,48,108,0.06)", border: "1px solid rgba(225,48,108,0.15)" }}>
              <PlatformIcon platform="INSTAGRAM" size={14} showBg />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--ink-primary)" }}>Instagram</p>
                <p className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>6.8% engagement rate · highest of all platforms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top posts */}
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Top performing posts</h3>
            <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Last {range}</span>
          </div>
          <div className="space-y-2.5">
            {TOP_POSTS.map((post, i) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-start gap-3 rounded-xl p-3.5 cursor-pointer transition-all"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(23,122,65,0.2)";
                  e.currentTarget.style.backgroundColor = "rgba(23,122,65,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.backgroundColor = "var(--surface-50)";
                }}>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ backgroundColor: "rgba(23,122,65,0.1)", color: "var(--brand-500)" }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--ink-secondary)" }}>{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <PlatformIcon platform={post.platform} size={11} />
                    <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{post.date}</span>
                    <div className="flex items-center gap-1 text-2xs" style={{ color: "var(--ink-tertiary)" }}>
                      <Eye className="h-3 w-3" /> {formatNumber(post.reach)}
                    </div>
                    <div className="flex items-center gap-1 text-2xs" style={{ color: "var(--ink-tertiary)" }}>
                      <Heart className="h-3 w-3" /> {formatNumber(post.engagements)}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold" style={{ color: "var(--success)" }}>{post.engRate}%</div>
                  <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>eng. rate</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Best times + Quick insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Best times to post */}
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Best times to post</h3>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Based on your audience engagement patterns</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: "rgba(23,122,65,0.08)", border: "1px solid rgba(23,122,65,0.2)" }}>
              <Zap className="h-3 w-3" style={{ color: "var(--brand-500)" }} />
              <span className="text-2xs font-medium" style={{ color: "var(--brand-500)" }}>AI optimized</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={BEST_HOURS} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="hour" tick={{ fill: "#476B52", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<HourTooltip />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#177A41" fillOpacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            {[
              { time: "9 AM", label: "Morning peak", score: 88 },
              { time: "6 PM", label: "Evening peak", score: 95 },
            ].map((t) => (
              <div key={t.time} className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ backgroundColor: "rgba(23,122,65,0.06)", border: "1px solid rgba(23,122,65,0.15)" }}>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand-500)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink-primary)" }}>{t.time}</span>
                <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{t.label} · score {t.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick insights */}
        <div className="card-base p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink-primary)" }}>Quick insights</h3>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, color: "var(--success)",   bg: "rgba(22,101,52,0.08)",  title: "Reach up 24%", desc: "Instagram driving the growth this week" },
              { icon: Heart,      color: "#e11d48",          bg: "rgba(225,29,72,0.08)",   title: "Best engagement day: Saturday", desc: "Posts at 6 PM get 3× more likes" },
              { icon: BarChart2,  color: "var(--brand-500)", bg: "rgba(23,122,65,0.08)",   title: "51 posts published", desc: `Up 8% from last ${range}` },
              { icon: Users,      color: "#0a66c2",          bg: "rgba(10,102,194,0.08)",  title: "+250 new followers", desc: "Twitter growing fastest at 18%/wk" },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: bg }}>
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>{title}</p>
                  <p className="text-2xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
            Full report <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
