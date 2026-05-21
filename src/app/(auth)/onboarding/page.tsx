"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowRight, Users, BarChart2, Clock, CheckCircle2, ChevronRight, X,
  Sparkles, Globe, Bell, Loader2, AlertCircle, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = ["welcome", "website", "platforms", "team", "finish"] as const;
type Step = typeof STEPS[number];

function TwitterSvg({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>;
}
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
  { id: "TWITTER",   label: "Twitter / X",  color: "#1da1f2", icon: TwitterSvg },
  { id: "INSTAGRAM", label: "Instagram",    color: "#e1306c", icon: InstagramSvg },
  { id: "LINKEDIN",  label: "LinkedIn",     color: "#0a66c2", icon: LinkedInSvg },
  { id: "FACEBOOK",  label: "Facebook",     color: "#1877f2", icon: FacebookSvg },
] as const;

const GOALS = [
  { id: "growth",   label: "Grow audience",         icon: BarChart2, desc: "Build followers & reach" },
  { id: "schedule", label: "Save time scheduling",   icon: Clock,     desc: "Automate your posting" },
  { id: "team",     label: "Collaborate with team",  icon: Users,     desc: "Manage team workflows" },
];

const STEP_META = [
  { label: "Goals",     step: "welcome" },
  { label: "Brand",     step: "website" },
  { label: "Platforms", step: "platforms" },
  { label: "Team",      step: "team" },
  { label: "Done",      step: "finish" },
] as const;

interface BrandData {
  brandName: string;
  brandDescription: string;
  brandColors: string[];
  brandKeywords: string[];
  brandVoice: string;
}

// Mock workspace id — in production pull from session/context
const MOCK_WORKSPACE_ID = "placeholder";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);

  // Website / brand state
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState("");
  const [brandData, setBrandData] = useState<BrandData | null>(null);

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

      const res = await fetch("/api/workspace/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, workspaceId: MOCK_WORKSPACE_ID }),
      });
      if (!res.ok) {
        const err = await res.json();
        // If it's just an auth error (no workspace yet), use client-side mock extraction
        if (res.status === 401 || res.status === 403) {
          // Optimistic: pretend it worked with extracted domain name
          const domain = new URL(url).hostname.replace("www.", "");
          setBrandData({
            brandName: domain.split(".")[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            brandDescription: `Brand identity extracted from ${url}. AI will write in the voice of this brand.`,
            brandColors: ["#6172f3"],
            brandKeywords: [domain.split(".")[0]],
            brandVoice: "professional",
          });
          return;
        }
        throw new Error(err.error ?? "Failed to analyze website");
      }
      const data = await res.json();
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
    <div className="min-h-screen bg-[#08090e] flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-[rgba(255,255,255,0.05)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#6172f3] to-[#a855f7]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Skip */}
      {step !== "finish" && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.05)] transition-all"
          >
            <X className="h-3.5 w-3.5" /> Skip setup
          </button>
        </div>
      )}

      {/* Step indicator (desktop) */}
      <div className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(13,15,23,0.85)] backdrop-blur-md px-4 py-2">
        {STEP_META.map(({ label, step: s }, i) => {
          const idx    = STEPS.indexOf(s as Step);
          const done   = stepIndex > idx;
          const active = stepIndex === idx;
          return (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <div className={cn("h-px w-5 transition-colors", done ? "bg-[#6172f3]" : "bg-[rgba(255,255,255,0.08)]")} />}
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-2xs font-bold transition-all",
                  done ? "bg-[#6172f3] text-white" : active ? "bg-[rgba(97,114,243,0.2)] border border-[rgba(97,114,243,0.5)] text-[#8b9cf4]" : "bg-[rgba(255,255,255,0.06)] text-[#4d5675]"
                )}>
                  {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </div>
                <span className={cn("text-xs transition-colors", active ? "text-[#f1f3f9] font-medium" : done ? "text-[#8892aa]" : "text-[#4d5675]")}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pt-16">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">

            {/* ── Welcome / Goals ── */}
            {step === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="space-y-8">
                  <div className="flex justify-start">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#6172f3] to-[#a855f7] flex items-center justify-center shadow-[0_0_40px_rgba(97,114,243,0.5)]">
                        <Zap className="h-8 w-8 text-white" strokeWidth={2} />
                      </div>
                      <div className="absolute -inset-2 rounded-[1.5rem] border border-[rgba(97,114,243,0.2)] animate-pulse-glow" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#f1f3f9] tracking-tight mb-3">
                      Welcome to{" "}
                      <span className="bg-gradient-to-r from-[#6172f3] to-[#a855f7] bg-clip-text text-transparent">SocialSync</span>
                    </h1>
                    <p className="text-[#8892aa] text-base leading-relaxed">
                      AI-powered social media, trained on your brand. Let&apos;s set up your workspace.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ n: "10x", label: "Faster content" }, { n: "8+", label: "Platforms" }, { n: "∞", label: "Scheduling" }].map((s) => (
                      <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-4 text-center">
                        <div className="text-xl font-bold bg-gradient-to-r from-[#6172f3] to-[#a855f7] bg-clip-text text-transparent">{s.n}</div>
                        <div className="text-xs text-[#8892aa] mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-[#8892aa]">What&apos;s your main goal?</p>
                    <div className="grid gap-2">
                      {GOALS.map((goal) => (
                        <button key={goal.id} onClick={() => setSelectedGoals((p) => p.includes(goal.id) ? p.filter((g) => g !== goal.id) : [...p, goal.id])}
                          className={cn("flex items-center gap-3 rounded-xl p-3.5 text-left transition-all border",
                            selectedGoals.includes(goal.id) ? "bg-[rgba(97,114,243,0.1)] border-[rgba(97,114,243,0.3)]" : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]"
                          )}>
                          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", selectedGoals.includes(goal.id) ? "bg-[rgba(97,114,243,0.2)]" : "bg-[rgba(255,255,255,0.06)]")}>
                            <goal.icon className={cn("h-4 w-4", selectedGoals.includes(goal.id) ? "text-[#8b9cf4]" : "text-[#4d5675]")} />
                          </span>
                          <div className="flex-1"><div className="text-sm font-medium text-[#f1f3f9]">{goal.label}</div><div className="text-xs text-[#4d5675]">{goal.desc}</div></div>
                          {selectedGoals.includes(goal.id) && <CheckCircle2 className="h-4 w-4 text-[#6172f3] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={next} size="xl" className="w-full" rightIcon={<ArrowRight className="h-5 w-5" />}>Get started</Button>
                </div>
                {/* Desktop preview */}
                <div className="hidden lg:flex flex-col gap-4">
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-[#8b9cf4]" />
                      <span className="text-sm font-medium text-[#f1f3f9]">What SocialSync does for you</span>
                    </div>
                    {["Analyzes your brand website and learns your voice", "Generates on-brand content with one click", "Schedules posts at peak engagement times", "Tracks analytics across all platforms"].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-sm text-[#8892aa]">
                        <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Website / Brand ── */}
            {step === "website" && (
              <motion.div key="website" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6172f3] to-[#a855f7]">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#f1f3f9] tracking-tight">Add your website</h2>
                    </div>
                    <p className="text-[#8892aa] text-sm leading-relaxed">
                      SocialSync will read your site and learn your brand — colors, voice, keywords — so every AI post sounds like you.
                    </p>
                  </div>

                  {/* URL input */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#8892aa]">Website URL</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4d5675]" />
                        <input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => { setWebsiteUrl(e.target.value); setBrandData(null); setBrandError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && analyzeBrand()}
                          placeholder="https://yourcompany.com"
                          className="flex h-10 w-full rounded-xl bg-[rgba(255,255,255,0.04)] pl-9 pr-3 text-sm text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] placeholder:text-[#4d5675] focus:border-[rgba(97,114,243,0.6)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(97,114,243,0.12)] transition-all"
                        />
                      </div>
                      <button
                        onClick={analyzeBrand}
                        disabled={!websiteUrl || brandLoading}
                        className="flex items-center gap-2 rounded-xl bg-[rgba(97,114,243,0.15)] border border-[rgba(97,114,243,0.3)] px-4 text-sm font-medium text-[#8b9cf4] hover:bg-[rgba(97,114,243,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {brandLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {brandLoading ? "Analyzing…" : "Analyze"}
                      </button>
                    </div>
                    {brandError && (
                      <div className="flex items-center gap-2 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] px-3 py-2">
                        <AlertCircle className="h-3.5 w-3.5 text-[#f87171] shrink-0" />
                        <span className="text-xs text-[#f87171]">{brandError}</span>
                      </div>
                    )}
                  </div>

                  {/* Brand result card */}
                  <AnimatePresence>
                    {brandData && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-[rgba(97,114,243,0.25)] bg-[rgba(97,114,243,0.06)] p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                          <span className="text-sm font-medium text-[#f1f3f9]">Brand identity detected</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-[#4d5675] mb-0.5">Brand name</div>
                            <div className="text-sm font-semibold text-[#f1f3f9]">{brandData.brandName}</div>
                          </div>
                          {brandData.brandDescription && (
                            <div>
                              <div className="text-xs text-[#4d5675] mb-0.5">Description</div>
                              <div className="text-xs text-[#8892aa] leading-relaxed line-clamp-3">{brandData.brandDescription}</div>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            {brandData.brandColors.length > 0 && (
                              <div>
                                <div className="text-xs text-[#4d5675] mb-1.5">Brand colors</div>
                                <div className="flex gap-1.5">
                                  {brandData.brandColors.map((c) => (
                                    <div key={c} className="h-6 w-6 rounded-md border border-[rgba(255,255,255,0.15)] shadow-sm" style={{ backgroundColor: c }} title={c} />
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-[#4d5675] mb-1.5">Voice</div>
                              <span className="rounded-full bg-[rgba(97,114,243,0.15)] border border-[rgba(97,114,243,0.25)] px-2.5 py-0.5 text-xs font-medium text-[#8b9cf4] capitalize">
                                {VOICE_LABELS[brandData.brandVoice] ?? brandData.brandVoice}
                              </span>
                            </div>
                          </div>
                          {brandData.brandKeywords.length > 0 && (
                            <div>
                              <div className="text-xs text-[#4d5675] mb-1.5">Keywords</div>
                              <div className="flex flex-wrap gap-1.5">
                                {brandData.brandKeywords.slice(0, 6).map((k) => (
                                  <span key={k} className="rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 text-xs text-[#8892aa]">{k}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] px-3 py-2">
                          <Sparkles className="h-3.5 w-3.5 text-[#10b981]" />
                          <span className="text-xs text-[#6ee7b7]">AI will now write in your brand&apos;s voice automatically</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("welcome")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {brandData ? "Looks great, continue" : "Skip for now"}
                    </Button>
                  </div>
                </div>

                {/* Right: how it works */}
                <div className="hidden lg:block space-y-4">
                  <div className="text-xs font-medium text-[#4d5675] uppercase tracking-wider">How brand learning works</div>
                  {[
                    { icon: Globe,   title: "Reads your website",    desc: "Fetches your site's meta tags, colors, and description" },
                    { icon: Palette, title: "Extracts brand identity", desc: "Colors, tone, keywords, and niche are detected automatically" },
                    { icon: Sparkles,title: "Trains AI on your voice", desc: "Every AI generation uses your brand context as the prompt" },
                    { icon: Bell,    title: "Always on-brand",        desc: "Captions, hashtags, and hooks all sound like you" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(97,114,243,0.15)]">
                        <Icon className="h-4 w-4 text-[#8b9cf4]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#f1f3f9]">{title}</div>
                        <div className="text-xs text-[#4d5675] mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Platforms ── */}
            {step === "platforms" && (
              <motion.div key="platforms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#f1f3f9] tracking-tight">Connect your accounts</h2>
                    <p className="text-[#8892aa] mt-2 text-sm">Connect at least one platform to start scheduling</p>
                  </div>
                  <div className="grid gap-3">
                    {PLATFORMS.map(({ id, label, color, icon: Icon }) => {
                      const isConnected = selectedPlatforms.includes(id);
                      const isLoading   = connecting === id;
                      return (
                        <button key={id} onClick={() => !isConnected && handleConnectPlatform(id)} disabled={isLoading}
                          className={cn("flex items-center gap-4 rounded-xl p-4 text-left transition-all border",
                            isConnected ? "bg-[rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.2)]"
                            : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]",
                            isLoading && "opacity-70"
                          )}>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
                            <span style={{ color }}><Icon className="h-5 w-5" /></span>
                          </span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#f1f3f9]">{label}</div>
                            <div className="text-xs text-[#4d5675]">{isConnected ? "Connected" : isLoading ? "Connecting…" : "Click to connect"}</div>
                          </div>
                          {isConnected ? <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0" />
                          : isLoading ? <div className="h-4 w-4 rounded-full border-2 border-[#6172f3] border-t-transparent animate-spin shrink-0" />
                          : <ChevronRight className="h-4 w-4 text-[#4d5675] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("website")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {selectedPlatforms.length > 0 ? `Continue (${selectedPlatforms.length})` : "Skip for now"}
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block space-y-3">
                  <div className="text-xs font-medium text-[#4d5675] uppercase tracking-wider">Supported platforms</div>
                  {brandData && (
                    <div className="rounded-xl border border-[rgba(97,114,243,0.2)] bg-[rgba(97,114,243,0.06)] p-3.5 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                        <span className="text-xs font-medium text-[#f1f3f9]">{brandData.brandName} brand loaded</span>
                      </div>
                      <p className="text-xs text-[#4d5675]">AI posts will be written in your brand&apos;s {brandData.brandVoice} voice</p>
                    </div>
                  )}
                  {PLATFORMS.map(({ id, label, color, icon: Icon }) => (
                    <div key={id} className={cn("flex items-center gap-3 rounded-xl border p-3 transition-all",
                      selectedPlatforms.includes(id) ? "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)]" : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
                    )}>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                        <span style={{ color }}><Icon className="h-4 w-4" /></span>
                      </span>
                      <span className="text-sm text-[#8892aa] flex-1">{label}</span>
                      {selectedPlatforms.includes(id) && <CheckCircle2 className="h-4 w-4 text-[#10b981]" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Team ── */}
            {step === "team" && (
              <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#f1f3f9] tracking-tight">How big is your team?</h2>
                    <p className="text-[#8892aa] mt-2 text-sm">Help us personalize your experience</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Just me", "2–5 people", "6–20 people", "20+ people"].map((size) => (
                      <button key={size} onClick={() => setTeamSize(size)}
                        className={cn("rounded-xl p-4 text-sm font-medium transition-all border text-left",
                          teamSize === size ? "bg-[rgba(97,114,243,0.1)] border-[rgba(97,114,243,0.3)] text-[#8b9cf4]"
                          : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-[#8892aa] hover:border-[rgba(255,255,255,0.14)]"
                        )}>
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#8892aa]">Invite teammates (optional)</label>
                    <input type="email" placeholder="colleague@company.com"
                      className="flex h-9 w-full rounded-[0.625rem] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] placeholder:text-[#4d5675] focus:border-[rgba(97,114,243,0.6)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(97,114,243,0.12)]" />
                    <p className="text-xs text-[#4d5675]">Separate emails with commas.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("platforms")} className="flex-1">Back</Button>
                    <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
                  </div>
                </div>
                <div className="hidden lg:block space-y-4">
                  <div className="text-xs font-medium text-[#4d5675] uppercase tracking-wider">Team roles</div>
                  {[
                    { role: "Owner",  desc: "Full access, billing, settings", color: "#6172f3" },
                    { role: "Admin",  desc: "Manage accounts & members",      color: "#a855f7" },
                    { role: "Editor", desc: "Create and schedule posts",       color: "#10b981" },
                    { role: "Viewer", desc: "View-only access",                color: "#4d5675" },
                  ].map((r) => (
                    <div key={r.role} className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-3.5">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      <div><div className="text-sm font-medium text-[#f1f3f9]">{r.role}</div><div className="text-xs text-[#4d5675]">{r.desc}</div></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Finish ── */}
            {step === "finish" && (
              <motion.div key="finish" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center space-y-8">
                <div className="flex justify-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#f1f3f9] tracking-tight">You&apos;re all set!</h2>
                  <p className="text-[#8892aa] mt-2 text-base">Your workspace is ready. Time to create your first post.</p>
                </div>
                <div className="grid gap-2 text-left max-w-sm mx-auto">
                  {[
                    brandData && `Brand identity loaded: ${brandData.brandName}`,
                    selectedPlatforms.length > 0 && `${selectedPlatforms.length} social account(s) connected`,
                    "AI content generation enabled",
                    "14-day free trial started",
                  ].filter(Boolean).map((item) => (
                    <div key={item as string} className="flex items-center gap-2.5 text-sm text-[#8892aa]">
                      <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0" />{item}
                    </div>
                  ))}
                </div>
                <Button onClick={() => router.push("/dashboard")} size="xl" className="w-full max-w-sm mx-auto" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Go to dashboard
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
