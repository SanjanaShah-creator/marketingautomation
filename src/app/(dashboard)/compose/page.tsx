"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ImageIcon, Hash, ArrowRight, RefreshCw,
  X, Check, Palette, Wand2, ChevronRight, Zap,
  Calendar, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { UserAvatar } from "@/components/ui/avatar";
import { cn, PLATFORM_CHAR_LIMITS } from "@/lib/utils";
import type { SocialPlatform } from "@/types";

// ── Constants ──────────────────────────────────────────────────────────────

const PLATFORMS: { key: SocialPlatform; label: string; handle: string }[] = [
  { key: "TWITTER",   label: "Twitter",   handle: "@socialsync" },
  { key: "INSTAGRAM", label: "Instagram", handle: "@socialsync.app" },
  { key: "LINKEDIN",  label: "LinkedIn",  handle: "SocialSync" },
  { key: "FACEBOOK",  label: "Facebook",  handle: "SocialSync" },
];

const BRAND_COLORS = ["#6172f3", "#a855f7", "#10b981", "#f59e0b"];
const EXTRA_COLORS = ["#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#e11d48"];
const IMG_STYLES = ["Photorealistic", "Illustration", "Abstract", "Minimal"] as const;
type ImgStyle = typeof IMG_STYLES[number];

interface Suggestion { id: string; content: string; tags: string[] }

const BRAND_SUGGESTIONS: Record<SocialPlatform, Suggestion[]> = {
  TWITTER: [
    {
      id: "tw1",
      content: "🚀 AI content generation just got smarter.\n\nMost teams spend 6+ hrs/week writing social posts. We turned that into 6 minutes.\n\nTry SocialSync free → socialsync.app\n\n#AI #Marketing #SaaS",
      tags: ["#AI", "#Marketing", "#SaaS"],
    },
    {
      id: "tw2",
      content: "Hot take: Your brand voice matters more than your posting frequency.\n\nConsistency in tone builds trust. Trust drives conversions.\n\nWhat's your brand voice? Reply below 👇\n\n#BrandVoice #ContentMarketing",
      tags: ["#BrandVoice", "#ContentMarketing"],
    },
    {
      id: "tw3",
      content: "We analyzed 10,000 social posts to find what actually works.\n\nTop finding: Posts with a clear CTA get 3.2× more engagement.\n\nFull breakdown in the thread 🧵\n\n#DataDriven #SocialMedia #GrowthHacking",
      tags: ["#DataDriven", "#GrowthHacking"],
    },
  ],
  INSTAGRAM: [
    {
      id: "ig1",
      content: "Behind every great post is a great strategy ✨\n\nWe've been quietly building something that helps brands show up consistently — without burning out their teams.\n\nSpoiler: it's already changing how 50,000+ brands create content.\n\nLink in bio to see what's possible 🔗\n\n#ContentCreation #MarketingTips #SocialMediaMarketing #BrandBuilding #DigitalMarketing",
      tags: ["#ContentCreation", "#MarketingTips"],
    },
    {
      id: "ig2",
      content: "This is what your content calendar looks like with AI 🤯\n\nWeek 1: Done ✅\nWeek 2: Done ✅\nWeek 3: Done ✅\nWeek 4: Done ✅\n\nStop creating content one post at a time. Start building a content engine.\n\nSave this and share it with someone who needs this 💜\n\n#AIMarketing #ContentStrategy #SocialMediaTips",
      tags: ["#AIMarketing", "#ContentStrategy"],
    },
    {
      id: "ig3",
      content: "3 things we know about great social media content 📱\n\n1. It sounds like a human wrote it\n2. It's specific to your audience\n3. It shows up consistently\n\nThat's exactly what we built SocialSync to do.\n\nDouble tap if you agree 💜\n\n#MarketingTips #SocialMedia #ContentCreator",
      tags: ["#MarketingTips", "#ContentCreator"],
    },
  ],
  LINKEDIN: [
    {
      id: "li1",
      content: "After analyzing 10,000 LinkedIn posts, here's what separates viral content from content that gets 12 likes:\n\n1. Lead with a surprising insight, not a humble brag\n2. Use white space like it's a luxury good\n3. End with a question that makes people think\n\nThe best posts feel like a conversation, not a press release.\n\nSave this. Your future posts will thank you.\n\n#LinkedInTips #ContentStrategy #DigitalMarketing",
      tags: ["#LinkedInTips", "#ContentStrategy"],
    },
    {
      id: "li2",
      content: "We just hit 50,000 users.\n\nHere's what we learned building SocialSync:\n\n→ Ship fast. Perfection is a myth.\n→ Listen to your customers obsessively.\n→ The feature everyone asks for isn't always the one they need.\n→ Boring consistency > flashy launches.\n\nThe hardest part wasn't building the product. It was believing it was worth building.\n\nTo every founder grinding right now: keep going.\n\n#StartupLife #BuildInPublic #SaaS",
      tags: ["#StartupLife", "#BuildInPublic"],
    },
    {
      id: "li3",
      content: "The future of marketing isn't about creating more content.\n\nIt's about creating the right content, at the right time, in the right voice.\n\nAI won't replace marketers. But marketers who use AI will replace those who don't.\n\nAt SocialSync, we built an AI that learns your brand voice — so every post sounds like you, not a robot.\n\nCurious how it works? Comment 'demo' below.\n\n#AIMarketing #ContentMarketing #FutureOfWork",
      tags: ["#AIMarketing", "#FutureOfWork"],
    },
  ],
  FACEBOOK: [
    {
      id: "fb1",
      content: "We get it — keeping up with social media is exhausting. 😩\n\nYou have a business to run. You don't have time to spend hours every week writing captions and hoping the algorithm works in your favor.\n\nThat's why we built SocialSync.\n\n✅ Generate posts in seconds\n✅ Schedule across all platforms\n✅ Track what's working\n\nTry it free for 14 days. No credit card required.\n\n👉 Link in comments!",
      tags: ["#SocialMedia", "#SmallBusiness"],
    },
    {
      id: "fb2",
      content: "Quick poll! 📊\n\nWhat's your biggest social media challenge right now?\n\nA) Not enough time to create content\nB) Don't know what to post\nC) Hard to stay consistent\nD) Low engagement\n\nDrop your answer below — we're building tools to solve exactly these problems! 👇",
      tags: ["#Poll", "#SocialMedia"],
    },
    {
      id: "fb3",
      content: "Fun fact: Brands that post consistently grow their audience 3× faster than those that post sporadically.\n\nThe secret? It's not about posting every day. It's about having a system.\n\nSocialSync helps you build that system — AI-powered content suggestions, smart scheduling, and analytics that tell you what's actually working.\n\n🔗 Start your free trial today (link in comments)",
      tags: ["#Marketing", "#SocialMediaTips"],
    },
  ],
  TIKTOK: [
    { id: "tt1", content: "POV: You just automated your entire content calendar in 6 minutes 😮‍💨✨ #SocialSync #ContentCreator #MarketingTok #AITools", tags: ["#MarketingTok", "#AITools"] },
    { id: "tt2", content: "Reply to @user — yes, AI really can write in YOUR brand voice 🤯 Here's how SocialSync does it… #MarketingTips #ContentCreation #AI", tags: ["#MarketingTips", "#AI"] },
    { id: "tt3", content: "Things I stopped doing when I found SocialSync 👇\n❌ Writing captions at midnight\n❌ Posting inconsistently\n❌ Running out of ideas\n✅ All automated now 🙌 #SmallBusiness #SocialMediaTips", tags: ["#SmallBusiness", "#SocialMediaTips"] },
  ],
  YOUTUBE: [
    { id: "yt1", content: "We Built an AI That Writes Social Media Posts in Your Brand Voice — Here's How It Works | SocialSync Deep Dive", tags: ["#AI", "#Marketing"] },
    { id: "yt2", content: "How 50,000 Brands Schedule a Month of Content in One Afternoon (Full Walkthrough) | SocialSync Tutorial", tags: ["#Tutorial", "#ContentStrategy"] },
    { id: "yt3", content: "I Tested 5 AI Social Media Tools So You Don't Have To — Honest Review 2024 | SocialSync vs. Competitors", tags: ["#Review", "#AITools"] },
  ],
  THREADS: [
    { id: "th1", content: "Unpopular opinion: most brands don't need to post more. They need to post better.\n\nQuality over quantity wins every time.", tags: ["#Marketing"] },
    { id: "th2", content: "The brands winning on social right now all have one thing in common: they sound like a real person wrote their posts.\n\nThat's the whole game.", tags: ["#BrandVoice"] },
    { id: "th3", content: "Content idea for today: share one thing you learned this week. That's it. No sales pitch. Just value.\n\nYour audience will remember it.", tags: ["#ContentTips"] },
  ],
  PINTEREST: [
    { id: "pi1", content: "7 Proven Social Media Strategies That Actually Drive Sales in 2024 | Save this for later! ✨ #MarketingTips #SocialMediaStrategy #ContentMarketing #DigitalMarketing", tags: ["#MarketingTips", "#ContentMarketing"] },
    { id: "pi2", content: "How to Build a Month of Content in One Afternoon ☑️ Step-by-step guide inside → #ContentCalendar #ContentCreation #AIMarketing #SocialMediaTips", tags: ["#ContentCalendar", "#AIMarketing"] },
    { id: "pi3", content: "Your brand color palette + AI content = posts that stop the scroll 🎨 Discover how SocialSync generates on-brand visuals automatically. #BrandDesign #MarketingTools #ContentCreator", tags: ["#BrandDesign", "#MarketingTools"] },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────

function CharCounter({ content, platform }: { content: string; platform: SocialPlatform }) {
  const limit = PLATFORM_CHAR_LIMITS[platform] ?? 2200;
  const remaining = limit - content.length;
  const pct = content.length / limit;
  const isOver = remaining < 0;
  const isWarn = !isOver && pct > 0.85;
  const r = 10;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <div className="flex items-center gap-1.5">
      <svg width={24} height={24} className="rotate-[-90deg]">
        <circle cx={12} cy={12} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
        <circle cx={12} cy={12} r={r} fill="none"
          stroke={isOver ? "#ef4444" : isWarn ? "#f59e0b" : "#6172f3"}
          strokeWidth={2} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.2s" }}
        />
      </svg>
      <span className={cn("text-xs tabular-nums", isOver ? "text-[#f87171]" : isWarn ? "text-[#fbbf24]" : "text-[#4d5675]")}>
        {remaining}
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ComposePage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [activePlatform, setActivePlatform] = useState<SocialPlatform>("TWITTER");
  const [content, setContent] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS[0]);
  const [imgStyle, setImgStyle] = useState<ImgStyle>("Photorealistic");
  const [imgGenerated, setImgGenerated] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [publishing, setPublishing] = useState(false);

  const suggestions = BRAND_SUGGESTIONS[activePlatform];
  const charLimit = PLATFORM_CHAR_LIMITS[activePlatform] ?? 2200;

  function applySuggestion(s: Suggestion) {
    setSelectedSuggestion(s.id);
    setContent(s.content);
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function switchPlatform(p: SocialPlatform) {
    setActivePlatform(p);
    setSelectedSuggestion(null);
    setIsEditing(false);
    setContent("");
  }

  async function handleGenerateImage() {
    setImgLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    setImgGenerated(true);
    setImgLoading(false);
  }

  async function handleRefreshSuggestions() {
    setRegenerating(true);
    await new Promise((r) => setTimeout(r, 1400));
    setRegenerating(false);
  }

  async function handleAIRefine() {
    if (!aiPrompt.trim() && !content) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setContent((prev) => `${prev}\n\n✨ [AI refined — add your custom prompt to personalise further]`);
    setAiLoading(false);
    setAiPrompt("");
  }

  async function handlePublish() {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
  }

  const activePlatformMeta = PLATFORMS.find((p) => p.key === activePlatform)!;

  return (
    <div className="flex flex-col h-[calc(100vh-56px-48px)] max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#f1f3f9]">Compose</h2>
          <p className="text-xs text-[#4d5675]">Brand-tailored content for each platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Save draft</Button>
          <Button size="sm" loading={publishing} onClick={handlePublish}
            rightIcon={!publishing ? <ArrowRight className="h-4 w-4" /> : undefined}>
            {isSchedule ? "Schedule" : "Publish now"}
          </Button>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── Left panel ── */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto pb-4 scrollbar-thin">

          {/* Platform tabs */}
          <div className="card-base p-2">
            <div className="flex gap-1">
              {PLATFORMS.map(({ key, label }) => (
                <button key={key} onClick={() => switchPlatform(key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all",
                    activePlatform === key
                      ? "bg-[rgba(97,114,243,0.12)] border border-[rgba(97,114,243,0.3)] text-[#f1f3f9]"
                      : "text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                  )}>
                  <PlatformIcon platform={key} size={13} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand suggestions */}
          <div className="card-base p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#6172f3] to-[#a855f7]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f1f3f9]">
                    Suggested for {activePlatformMeta.label}
                  </p>
                  <p className="text-2xs text-[#4d5675]">Tailored to your brand · SocialSync</p>
                </div>
              </div>
              <button onClick={handleRefreshSuggestions} disabled={regenerating}
                className="flex items-center gap-1.5 text-2xs text-[#818cf8] hover:text-[#6172f3] transition-colors disabled:opacity-50">
                <RefreshCw className={cn("h-3 w-3", regenerating && "animate-spin")} />
                {regenerating ? "Generating…" : "Refresh ideas"}
              </button>
            </div>

            <div className="space-y-2.5">
              {suggestions.map((s) => {
                const isSelected = selectedSuggestion === s.id;
                const preview = s.content.slice(0, 140) + (s.content.length > 140 ? "…" : "");
                const overLimit = s.content.length > charLimit;
                return (
                  <motion.div key={s.id} layout
                    className={cn(
                      "group rounded-xl border p-4 transition-all cursor-pointer",
                      isSelected
                        ? "border-[rgba(97,114,243,0.4)] bg-[rgba(97,114,243,0.08)]"
                        : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                    onClick={() => applySuggestion(s)}
                  >
                    <p className="text-xs text-[#c4cbdc] leading-relaxed whitespace-pre-line">{preview}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {s.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-2xs text-[#4d5675] bg-[rgba(255,255,255,0.05)] rounded-full px-2 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={cn("text-2xs tabular-nums", overLimit ? "text-[#f87171]" : "text-[#4d5675]")}>
                          {s.content.length}/{charLimit}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-2xs font-medium text-[#10b981]">
                            <Check className="h-3 w-3" /> Selected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-2xs font-medium text-[#818cf8] opacity-0 group-hover:opacity-100 transition-opacity">
                            Use this <ChevronRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Editor */}
          <AnimatePresence>
            {isEditing ? (
              <motion.div key="editor"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="card-base p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#f1f3f9]">Your post</p>
                  <div className="flex items-center gap-3">
                    <CharCounter content={content} platform={activePlatform} />
                    <button onClick={() => { setIsEditing(false); setSelectedSuggestion(null); setContent(""); }}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-[#4d5675] hover:text-[#f1f3f9] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Your content will appear here…"
                  className="w-full resize-none rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] px-4 py-3 text-sm text-[#f1f3f9] placeholder:text-[#2e3554] focus:outline-none focus:border-[rgba(97,114,243,0.4)] leading-relaxed"
                />

                {/* Toolbar */}
                <div className="flex items-center gap-1 border-t border-[rgba(255,255,255,0.05)] pt-3">
                  <div className="flex gap-0.5">
                    {[{ icon: ImageIcon, label: "Image" }, { icon: Hash, label: "Hashtags" }].map(({ icon: Icon, label }) => (
                      <button key={label} title={label}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAIRefine()}
                      placeholder="Refine with AI…"
                      className="h-7 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] px-2.5 text-xs text-[#f1f3f9] placeholder:text-[#2e3554] focus:outline-none focus:border-[rgba(97,114,243,0.4)] w-36"
                    />
                    <button onClick={handleAIRefine} disabled={aiLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-[rgba(97,114,243,0.1)] border border-[rgba(97,114,243,0.2)] px-2.5 py-1.5 text-xs text-[#818cf8] hover:bg-[rgba(97,114,243,0.18)] transition-all disabled:opacity-50">
                      {aiLoading
                        ? <RefreshCw className="h-3 w-3 animate-spin" />
                        : <Sparkles className="h-3 w-3" />
                      }
                      {aiLoading ? "Refining…" : "Refine"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button key="scratch"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { setContent(""); setIsEditing(true); setSelectedSuggestion(null); }}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[rgba(255,255,255,0.1)] py-3.5 text-xs text-[#4d5675] hover:border-[rgba(97,114,243,0.3)] hover:text-[#818cf8] transition-all">
                <Plus className="h-3.5 w-3.5" /> Write from scratch
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right panel ── */}
        <div className="w-[280px] shrink-0 flex flex-col gap-4 overflow-y-auto pb-4 scrollbar-thin">

          {/* Image generation */}
          <div className="card-base p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f97316]">
                <ImageIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f1f3f9]">Image generation</p>
                <p className="text-2xs text-[#4d5675]">AI-powered brand visuals</p>
              </div>
            </div>

            {/* Preview area */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
              {imgGenerated ? (
                <div className="h-full w-full flex flex-col items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${selectedColor}25 0%, rgba(13,15,23,0.95) 100%)` }}>
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${selectedColor}25`, border: `1px solid ${selectedColor}45` }}>
                    <ImageIcon className="h-7 w-7" style={{ color: selectedColor }} />
                  </div>
                  <p className="text-xs font-medium text-[#f1f3f9]">Generated image</p>
                  <p className="text-2xs text-[#4d5675] mt-0.5">{imgStyle} style</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full border border-[rgba(255,255,255,0.2)]" style={{ backgroundColor: selectedColor }} />
                    <span className="text-2xs text-[#4d5675] font-mono">{selectedColor}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.04)]">
                    <Wand2 className="h-5 w-5 text-[#4d5675]" />
                  </div>
                  <p className="text-xs text-[#4d5675] leading-relaxed">Pick colors &amp; style, then generate your brand image</p>
                </div>
              )}
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(13,15,23,0.85)] backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full border-2 border-[#6172f3] border-t-transparent animate-spin" />
                    <p className="text-2xs text-[#818cf8]">Creating your image…</p>
                  </div>
                </div>
              )}
            </div>

            {/* Brand colors */}
            <div>
              <p className="text-2xs font-medium text-[#4d5675] mb-2 flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Brand colors
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {BRAND_COLORS.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={cn("h-7 w-7 rounded-lg transition-all",
                      selectedColor === c && "ring-2 ring-offset-2 ring-offset-[#111420] ring-white/50 scale-110"
                    )}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-2xs font-medium text-[#4d5675] mb-2">Other colors</p>
              <div className="flex flex-wrap gap-2">
                {EXTRA_COLORS.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={cn("h-7 w-7 rounded-lg transition-all",
                      selectedColor === c && "ring-2 ring-offset-2 ring-offset-[#111420] ring-white/50 scale-110"
                    )}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Style picker */}
            <div>
              <p className="text-2xs font-medium text-[#4d5675] mb-2">Style</p>
              <div className="grid grid-cols-2 gap-1.5">
                {IMG_STYLES.map((s) => (
                  <button key={s} onClick={() => setImgStyle(s)}
                    className={cn("rounded-lg px-2 py-1.5 text-2xs font-medium transition-all border",
                      imgStyle === s
                        ? "bg-[rgba(97,114,243,0.15)] border-[rgba(97,114,243,0.3)] text-[#818cf8]"
                        : "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[#4d5675] hover:text-[#8892aa]"
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleGenerateImage} loading={imgLoading}
                leftIcon={<Wand2 className="h-3.5 w-3.5" />}>
                {imgGenerated ? "Regenerate" : "Generate"}
              </Button>
              {imgGenerated && (
                <button onClick={() => setImgGenerated(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] text-[#4d5675] hover:text-[#f1f3f9] hover:border-[rgba(255,255,255,0.15)] transition-all">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Publishing */}
          <div className="card-base p-4 space-y-3">
            <p className="text-xs font-semibold text-[#f1f3f9]">Publishing</p>
            <div className="space-y-1.5">
              {[
                { id: "now",      label: "Publish now",   icon: Zap,      desc: "Goes live immediately" },
                { id: "schedule", label: "Schedule",      icon: Calendar, desc: "Pick date & time" },
                { id: "optimal",  label: "AI best time",  icon: Sparkles, desc: "Peak engagement" },
              ].map((opt) => {
                const isActive = opt.id === "now" ? !isSchedule : isSchedule && opt.id === "schedule";
                return (
                  <button key={opt.id} onClick={() => setIsSchedule(opt.id !== "now")}
                    className={cn("flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left border transition-all",
                      isActive
                        ? "bg-[rgba(97,114,243,0.1)] border-[rgba(97,114,243,0.25)]"
                        : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)]"
                    )}>
                    <div className={cn("flex h-4 w-4 items-center justify-center rounded-full border-2 shrink-0",
                      isActive ? "border-[#6172f3] bg-[#6172f3]" : "border-[#2e3554]")}>
                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#f1f3f9]">{opt.label}</p>
                      <p className="text-2xs text-[#4d5675]">{opt.desc}</p>
                    </div>
                    {opt.id === "optimal" && <Badge variant="default" className="text-2xs px-1.5 py-0">AI</Badge>}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isSchedule && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-2 overflow-hidden">
                  <div>
                    <label className="text-2xs font-medium text-[#4d5675] block mb-1">Date</label>
                    <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                      className="h-8 w-full rounded-lg bg-[rgba(255,255,255,0.04)] px-2 text-xs text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(97,114,243,0.5)] focus:outline-none [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-[#4d5675] block mb-1">Time</label>
                    <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                      className="h-8 w-full rounded-lg bg-[rgba(255,255,255,0.04)] px-2 text-xs text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(97,114,243,0.5)] focus:outline-none [color-scheme:dark]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button size="sm" className="w-full" loading={publishing} onClick={handlePublish}
              rightIcon={!publishing ? <ArrowRight className="h-3.5 w-3.5" /> : undefined}>
              {isSchedule ? "Schedule post" : "Publish now"}
            </Button>
          </div>

          {/* Live preview */}
          {isEditing && content && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-base p-4">
              <p className="text-xs font-semibold text-[#f1f3f9] mb-3">Preview</p>
              <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <PlatformIcon platform={activePlatform} size={12} />
                  <span className="text-2xs text-[#4d5675]">{activePlatformMeta.handle}</span>
                </div>
                <div className="flex gap-2">
                  <UserAvatar name="Alex" size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-2xs font-semibold text-[#f1f3f9]">Alex Johnson</p>
                    <p className="text-xs text-[#c4cbdc] whitespace-pre-wrap leading-relaxed mt-0.5 line-clamp-8">{content}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
