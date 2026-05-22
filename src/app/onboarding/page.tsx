"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowRight, Users, BarChart2, Clock, CheckCircle2, ChevronRight, X, Plus,
  Sparkles, Globe, Bell, Loader2, AlertCircle, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = ["welcome", "website", "platforms", "team", "finish"] as const;
type Step = typeof STEPS[number];

function InstagramSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
}
function LinkedInSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}
function FacebookSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
}

const PLATFORMS = [
  { id: "INSTAGRAM", label: "Instagram",    sublabel: "Photos, Reels & Stories",       color: "#e1306c", icon: InstagramSvg },
  { id: "LINKEDIN",  label: "LinkedIn",     sublabel: "Professional content",           color: "#0a66c2", icon: LinkedInSvg },
  { id: "FACEBOOK",  label: "Facebook",     sublabel: "Posts, stories & pages",        color: "#1877f2", icon: FacebookSvg },
] as const;

const GOALS = [
  { id: "growth",   label: "Grow my audience",        icon: BarChart2, desc: "Build followers & reach fast" },
  { id: "schedule", label: "Save time on scheduling",  icon: Clock,     desc: "Automate your content calendar" },
  { id: "team",     label: "Collaborate with my team", icon: Users,     desc: "Multi-user workflows & approval" },
];

const STEP_META = [
  { label: "Goals",     step: "welcome" },
  { label: "Brand",     step: "website" },
  { label: "Platforms", step: "platforms" },
  { label: "Team",      step: "team" },
  { label: "Done",      step: "finish" },
] as const;

interface BrandData {
  brandName: string; brandDescription: string;
  brandColors: string[]; brandKeywords: string[]; brandVoice: string;
}

export default function OnboardingPage() {
  const router  = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals]         = useState<string[]>([]);
  const [teamSize, setTeamSize]                   = useState("");
  const [connecting, setConnecting]               = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl]               = useState("");
  const [brandLoading, setBrandLoading]           = useState(false);
  const [brandError, setBrandError]               = useState("");
  const [brandData, setBrandData]                 = useState<BrandData | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progress  = (stepIndex / (STEPS.length - 1)) * 100;

  function togglePlatform(id: string) {
    setSelectedPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  async function handleConnectPlatform(id: string) {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1200));
    setConnecting(null);
    togglePlatform(id);
  }

  async function analyzeBrand() {
    if (!websiteUrl) return;
    setBrandLoading(true);
    setBrandError("");
    try {
      let url = websiteUrl.trim();
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      const res = await fetch("/api/analyze-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to analyze website");
      setBrandData(data);
    } catch (e) {
      setBrandError(e instanceof Error ? e.message : "Could not analyze website");
    } finally {
      setBrandLoading(false);
    }
  }

  function next() {
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) setStep(STEPS[nextIdx]);
    else router.push("/dashboard");
  }

  const VOICE_LABELS: Record<string, string> = {
    professional: "Professional", casual: "Casual", humorous: "Humorous",
    inspiring: "Inspiring", educational: "Educational", bold: "Bold",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--surface-0)" }}>

      {/* ── Top progress bar ─────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ backgroundColor: "var(--border-subtle)" }}>
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, var(--brand-500), var(--accent-500))" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between px-6 lg:px-10 border-b"
        style={{ backgroundColor: "var(--surface-0)", borderColor: "var(--border)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))" }}>
            <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>SocialSync</span>
        </div>

        {/* Step indicator */}
        <div className="hidden md:flex items-center gap-1">
          {STEP_META.map(({ label, step: s }, i) => {
            const idx    = STEPS.indexOf(s as Step);
            const done   = stepIndex > idx;
            const active = stepIndex === idx;
            return (
              <div key={s} className="flex items-center gap-1">
                {i > 0 && (
                  <div className="w-6 h-px transition-colors"
                    style={{ backgroundColor: done ? "var(--brand-500)" : "var(--border)" }} />
                )}
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                  active ? "border" : "")}
                  style={active ? {
                    backgroundColor: "rgba(107,191,138,0.1)",
                    borderColor: "rgba(107,191,138,0.3)",
                    color: "var(--brand-500)",
                  } : {}}>
                  <span className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-2xs font-bold transition-all",
                  )} style={{
                    backgroundColor: done ? "var(--brand-500)" : active ? "rgba(107,191,138,0.2)" : "var(--border)",
                    color: done || active ? (done ? "#fff" : "var(--brand-500)") : "var(--ink-tertiary)",
                  }}>
                    {done ? <CheckCircle2 className="h-2.5 w-2.5" /> : i + 1}
                  </span>
                  <span className={active || done ? "" : "hidden sm:inline"}
                    style={{ color: active ? "var(--brand-500)" : done ? "var(--ink-secondary)" : "var(--ink-tertiary)" }}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Skip */}
          {step !== "finish" && (
            <button onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{ color: "var(--ink-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; e.currentTarget.style.backgroundColor = "var(--border-subtle)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.backgroundColor = ""; }}>
              <X className="h-3.5 w-3.5" /> Skip setup
            </button>
          )}
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────── */}
      <main className="flex-1 flex items-start justify-center px-6 py-10 lg:px-10">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">

            {/* ══ Step 1: Goals ══ */}
            {step === "welcome" && (
              <motion.div key="welcome"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">

                <div className="space-y-8">
                  {/* Hero */}
                  <div>
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                      style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))", boxShadow: "0 0 32px rgba(107,191,138,0.35)" }}>
                      <Zap className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-3" style={{ color: "var(--ink-primary)" }}>
                      Welcome to{" "}
                      <span className="gradient-text">SocialSync</span>
                    </h1>
                    <p className="text-base leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                      AI-powered social media, trained on your brand. Let&apos;s get your workspace set up in under 2 minutes.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "10×", label: "Faster content" },
                      { value: "8+",  label: "Platforms" },
                      { value: "∞",   label: "Scheduling" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
                        <div className="text-2xl font-bold leading-none gradient-text">{s.value}</div>
                        <div className="text-xs mt-1.5" style={{ color: "var(--ink-tertiary)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>What&apos;s your main goal?</p>
                    <div className="grid gap-2.5">
                      {GOALS.map((goal) => {
                        const active = selectedGoals.includes(goal.id);
                        return (
                          <button key={goal.id}
                            onClick={() => setSelectedGoals((p) => p.includes(goal.id) ? p.filter((g) => g !== goal.id) : [...p, goal.id])}
                            className="flex items-center gap-4 rounded-xl p-4 text-left transition-all border"
                            style={{
                              backgroundColor: active ? "rgba(107,191,138,0.08)" : "var(--border-subtle)",
                              borderColor: active ? "rgba(107,191,138,0.3)" : "var(--border)",
                            }}
                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                              style={{ backgroundColor: active ? "rgba(107,191,138,0.15)" : "var(--border)" }}>
                              <goal.icon className="h-5 w-5 transition-colors"
                                style={{ color: active ? "var(--brand-500)" : "var(--ink-tertiary)" }} />
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{goal.label}</div>
                              <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{goal.desc}</div>
                            </div>
                            <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                              active ? "scale-100 opacity-100" : "scale-75 opacity-0")}
                              style={{ backgroundColor: "var(--brand-500)" }}>
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={next} size="lg" className="w-full"
                    rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Get started
                  </Button>
                </div>

                {/* Right panel */}
                <div className="hidden lg:flex flex-col gap-4 sticky top-24">
                  <div className="rounded-2xl p-5 space-y-4"
                    style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4" style={{ color: "var(--brand-500)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>What SocialSync does for you</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Analyzes your brand website and learns your voice",
                        "Generates on-brand content with one click",
                        "Schedules posts at peak engagement times",
                        "Tracks analytics across all platforms",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                          <span className="text-sm" style={{ color: "var(--ink-secondary)" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(107,191,138,0.06)", border: "1px solid rgba(107,191,138,0.15)" }}>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                      <span className="font-semibold" style={{ color: "var(--brand-500)" }}>50,000+ teams</span> use SocialSync to save 10+ hours per week on content creation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ Step 2: Website / Brand ══ */}
            {step === "website" && (
              <motion.div key="website"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">

                <div className="space-y-6">
                  <div>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))" }}>
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--ink-primary)" }}>
                      Add your website
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                      SocialSync will read your site and learn your brand — colors, voice, keywords — so every AI post sounds like you.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>Website URL</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />
                        <input type="url" value={websiteUrl}
                          onChange={(e) => { setWebsiteUrl(e.target.value); setBrandData(null); setBrandError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && analyzeBrand()}
                          placeholder="https://yourcompany.com"
                          className="h-10 w-full rounded-xl pl-9 pr-3 text-sm transition-all focus:outline-none focus:ring-2"
                          style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)", color: "var(--ink-primary)" }}
                        />
                      </div>
                      <button onClick={analyzeBrand} disabled={!websiteUrl || brandLoading}
                        className="flex items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all disabled:opacity-50 shrink-0"
                        style={{ backgroundColor: "rgba(107,191,138,0.12)", border: "1px solid rgba(107,191,138,0.25)", color: "var(--brand-500)" }}>
                        {brandLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {brandLoading ? "Analyzing…" : "Analyze"}
                      </button>
                    </div>
                    {brandError && (
                      <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--danger)" }} />
                        <span className="text-xs" style={{ color: "var(--danger)" }}>{brandError}</span>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {brandData && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-5 space-y-4"
                        style={{ backgroundColor: "rgba(107,191,138,0.05)", border: "1px solid rgba(107,191,138,0.2)" }}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" style={{ color: "var(--success)" }} />
                          <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Brand identity detected</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs mb-0.5" style={{ color: "var(--ink-tertiary)" }}>Brand name</div>
                            <div className="font-semibold" style={{ color: "var(--ink-primary)" }}>{brandData.brandName}</div>
                          </div>
                          <div>
                            <div className="text-xs mb-0.5" style={{ color: "var(--ink-tertiary)" }}>Voice</div>
                            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                              style={{ backgroundColor: "rgba(107,191,138,0.12)", border: "1px solid rgba(107,191,138,0.2)", color: "var(--brand-500)" }}>
                              {VOICE_LABELS[brandData.brandVoice] ?? brandData.brandVoice}
                            </span>
                          </div>
                        </div>
                        {brandData.brandColors.length > 0 && (
                          <div>
                            <div className="text-xs mb-1.5" style={{ color: "var(--ink-tertiary)" }}>Brand colors</div>
                            <div className="flex flex-wrap gap-2 items-center">
                              {brandData.brandColors.map((color) => (
                                <div key={color} className="group relative flex-shrink-0" title={color}>
                                  <div className="h-7 w-7 rounded-lg border shadow-sm"
                                    style={{ backgroundColor: color, borderColor: "var(--border)" }} />
                                  <button
                                    onClick={() => setBrandData({ ...brandData, brandColors: brandData.brandColors.filter((c) => c !== color) })}
                                    className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--ink-primary)" }}
                                    title="Remove color"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              {brandData.brandColors.length < 8 && (
                                <label
                                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                                  style={{ borderColor: "var(--border-strong)", color: "var(--ink-tertiary)" }}
                                  title="Add color"
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-500)"; e.currentTarget.style.color = "var(--brand-500)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-tertiary)"; }}
                                >
                                  <input
                                    type="color"
                                    className="sr-only"
                                    onChange={(e) => {
                                      const newColor = e.target.value;
                                      if (!brandData.brandColors.includes(newColor)) {
                                        setBrandData({ ...brandData, brandColors: [...brandData.brandColors, newColor] });
                                      }
                                    }}
                                  />
                                  <Plus className="h-3 w-3" />
                                </label>
                              )}
                            </div>
                          </div>
                        )}
                        {brandData.brandKeywords.length > 0 && (
                          <div>
                            <div className="text-xs mb-1.5" style={{ color: "var(--ink-tertiary)" }}>Keywords</div>
                            <div className="flex flex-wrap gap-1.5">
                              {brandData.brandKeywords.slice(0, 6).map((k) => (
                                <span key={k} className="rounded-full px-2.5 py-0.5 text-xs"
                                  style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)", color: "var(--ink-secondary)" }}>{k}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                          style={{ backgroundColor: "rgba(107,191,138,0.08)", border: "1px solid rgba(107,191,138,0.15)" }}>
                          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--brand-500)" }} />
                          <span className="text-xs" style={{ color: "var(--brand-500)" }}>AI will now write in your brand&apos;s voice automatically</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => setStep("welcome")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {brandData ? "Looks great, continue" : "Skip for now"}
                    </Button>
                  </div>
                </div>

                {/* Right panel */}
                <div className="hidden lg:flex flex-col gap-3 sticky top-24">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>How brand learning works</p>
                  {[
                    { icon: Globe,   title: "Reads your website",      desc: "Fetches meta tags, colors, and description" },
                    { icon: Palette, title: "Extracts brand identity",  desc: "Colors, tone, keywords, and niche detected automatically" },
                    { icon: Sparkles,title: "Trains AI on your voice",  desc: "Every generation uses your brand context" },
                    { icon: Bell,    title: "Always on-brand",          desc: "Captions, hashtags, and hooks sound like you" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-xl p-3.5"
                      style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "rgba(107,191,138,0.12)" }}>
                        <Icon className="h-4 w-4" style={{ color: "var(--brand-500)" }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>{title}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ Step 3: Platforms ══ */}
            {step === "platforms" && (
              <motion.div key="platforms"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--ink-primary)" }}>
                      Connect your accounts
                    </h2>
                    <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                      Connect at least one platform to start scheduling posts
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {PLATFORMS.map(({ id, label, sublabel, color, icon: Icon }) => {
                      const isConnected = selectedPlatforms.includes(id);
                      const isLoading   = connecting === id;
                      return (
                        <button key={id} onClick={() => !isConnected && handleConnectPlatform(id)} disabled={isLoading}
                          className="flex items-center gap-4 rounded-xl p-4 text-left transition-all border"
                          style={{
                            backgroundColor: isConnected ? "rgba(107,191,138,0.05)" : "var(--border-subtle)",
                            borderColor: isConnected ? "rgba(107,191,138,0.25)" : "var(--border)",
                            opacity: isLoading ? 0.7 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isConnected) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                          onMouseLeave={(e) => { if (!isConnected) e.currentTarget.style.borderColor = "var(--border)"; }}>
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
                            <span style={{ color }}><Icon className="h-5 w-5" /></span>
                          </span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{label}</div>
                            <div className="text-xs mt-0.5" style={{ color: isConnected ? "var(--success)" : "var(--ink-tertiary)" }}>
                              {isConnected ? "✓ Connected" : isLoading ? "Connecting…" : sublabel}
                            </div>
                          </div>
                          {isConnected
                            ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
                            : isLoading
                            ? <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin shrink-0" style={{ borderColor: "var(--brand-500)", borderTopColor: "transparent" }} />
                            : <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => setStep("website")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {selectedPlatforms.length > 0 ? `Continue (${selectedPlatforms.length} connected)` : "Skip for now"}
                    </Button>
                  </div>
                </div>

                {/* Right panel */}
                <div className="hidden lg:flex flex-col gap-4 sticky top-24">
                  {brandData && (
                    <div className="rounded-xl p-4"
                      style={{ backgroundColor: "rgba(107,191,138,0.06)", border: "1px solid rgba(107,191,138,0.18)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--brand-500)" }} />
                        <span className="text-xs font-semibold" style={{ color: "var(--ink-primary)" }}>{brandData.brandName} brand loaded</span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                        Posts will be written in your brand&apos;s <span style={{ color: "var(--brand-500)" }}>{brandData.brandVoice}</span> voice
                      </p>
                    </div>
                  )}
                  <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-tertiary)" }}>Connected accounts</p>
                    <div className="space-y-2">
                      {PLATFORMS.map(({ id, label, color, icon: Icon }) => (
                        <div key={id} className="flex items-center gap-3 rounded-lg p-2 transition-colors"
                          style={{ backgroundColor: selectedPlatforms.includes(id) ? "rgba(107,191,138,0.05)" : undefined }}>
                          <span className="flex h-6 w-6 items-center justify-center rounded-md"
                            style={{ backgroundColor: `${color}18` }}>
                            <span style={{ color }}><Icon className="h-3.5 w-3.5" /></span>
                          </span>
                          <span className="text-sm flex-1" style={{ color: "var(--ink-secondary)" }}>{label}</span>
                          {selectedPlatforms.includes(id) && <CheckCircle2 className="h-4 w-4" style={{ color: "var(--success)" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ Step 4: Team ══ */}
            {step === "team" && (
              <motion.div key="team"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--ink-primary)" }}>
                      How big is your team?
                    </h2>
                    <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                      Help us personalize your experience and seat limits
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Just me",      desc: "Solo creator" },
                      { label: "2–5 people",   desc: "Small team" },
                      { label: "6–20 people",  desc: "Growing team" },
                      { label: "20+ people",   desc: "Enterprise" },
                    ].map(({ label, desc }) => (
                      <button key={label} onClick={() => setTeamSize(label)}
                        className="rounded-xl p-4 text-left transition-all border"
                        style={{
                          backgroundColor: teamSize === label ? "rgba(107,191,138,0.08)" : "var(--border-subtle)",
                          borderColor: teamSize === label ? "rgba(107,191,138,0.3)" : "var(--border)",
                        }}
                        onMouseEnter={(e) => { if (teamSize !== label) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                        onMouseLeave={(e) => { if (teamSize !== label) e.currentTarget.style.borderColor = "var(--border)"; }}>
                        <div className="text-sm font-semibold" style={{ color: teamSize === label ? "var(--brand-500)" : "var(--ink-primary)" }}>{label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>
                      Invite teammates <span style={{ color: "var(--ink-tertiary)" }}>(optional)</span>
                    </label>
                    <input type="email" placeholder="colleague@company.com, another@company.com"
                      className="h-10 w-full rounded-xl px-3 text-sm transition-all focus:outline-none focus:ring-2"
                      style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)", color: "var(--ink-primary)" }} />
                    <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Separate multiple emails with commas.</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => setStep("platforms")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
                  </div>
                </div>

                {/* Right panel */}
                <div className="hidden lg:flex flex-col gap-3 sticky top-24">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>Team roles</p>
                  {[
                    { role: "Owner",  desc: "Full access, billing, settings",  color: "var(--brand-500)" },
                    { role: "Admin",  desc: "Manage accounts & members",       color: "var(--accent-500)" },
                    { role: "Editor", desc: "Create and schedule posts",        color: "var(--success)" },
                    { role: "Viewer", desc: "View-only access",                 color: "var(--ink-tertiary)" },
                  ].map((r) => (
                    <div key={r.role} className="flex items-center gap-3 rounded-xl p-3.5"
                      style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{r.role}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ Step 5: Finish ══ */}
            {step === "finish" && (
              <motion.div key="finish"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-lg mx-auto text-center space-y-8 py-8">

                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(135deg, var(--brand-500), var(--accent-500))", boxShadow: "0 0 60px rgba(107,191,138,0.4)" }}>
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </motion.div>
                </div>

                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2" style={{ color: "var(--ink-primary)" }}>
                    You&apos;re all set!
                  </h2>
                  <p className="text-base" style={{ color: "var(--ink-secondary)" }}>
                    Your workspace is ready. Time to create your first post.
                  </p>
                </div>

                <div className="grid gap-2 text-left max-w-sm mx-auto">
                  {[
                    brandData && `Brand identity loaded: ${brandData.brandName}`,
                    selectedPlatforms.length > 0 && `${selectedPlatforms.length} social account${selectedPlatforms.length > 1 ? "s" : ""} connected`,
                    "AI content generation enabled",
                    "14-day free trial started",
                  ].filter(Boolean).map((item) => (
                    <div key={item as string} className="flex items-center gap-3 rounded-xl p-3"
                      style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} />
                      <span className="text-sm" style={{ color: "var(--ink-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={() => router.push("/dashboard")} size="xl" className="w-full max-w-sm mx-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Go to my dashboard
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
