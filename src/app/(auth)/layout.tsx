import { Zap, BarChart2, Calendar, Sparkles, Users } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, label: "AI Content Generation", desc: "Write 10x faster with Claude" },
  { icon: Calendar,  label: "Smart Scheduling",      desc: "Post at peak engagement times" },
  { icon: BarChart2, label: "Analytics Dashboard",   desc: "Track what actually works" },
  { icon: Users,     label: "Team Collaboration",    desc: "Multi-user workspaces & roles" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090e] flex">

      {/* ── Left branding panel (lg+) ────────────────── */}
      <div className="hidden lg:flex relative w-[52%] max-w-[640px] flex-col overflow-hidden border-r border-[rgba(255,255,255,0.06)]">
        {/* bg glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(97,114,243,0.15)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6172f3] to-[#a855f7] shadow-[0_0_20px_rgba(97,114,243,0.5)]">
              <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-[#f1f3f9]">SocialSync</span>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h2 className="text-4xl xl:text-[2.75rem] font-bold text-[#f1f3f9] tracking-tight leading-[1.1] mb-4">
              Your AI-powered<br />
              <span className="bg-gradient-to-r from-[#6172f3] to-[#a855f7] bg-clip-text text-transparent">
                social media HQ
              </span>
            </h2>
            <p className="text-[#8892aa] text-base leading-relaxed max-w-sm">
              Plan, create, and schedule content across every platform — 10x faster with AI.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex gap-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(97,114,243,0.15)]">
                  <Icon className="h-4 w-4 text-[#8b9cf4]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#f1f3f9]">{label}</div>
                  <div className="text-xs text-[#4d5675] mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            {[
              { n: "50K+",  l: "Teams" },
              { n: "10M+",  l: "Posts scheduled" },
              { n: "4.9★",  l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#6172f3] to-[#a855f7] bg-clip-text text-transparent">
                  {s.n}
                </div>
                <div className="text-xs text-[#4d5675] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-auto rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-[#8892aa] leading-relaxed mb-4">
              &ldquo;SocialSync saved our team 15 hours a week on content creation. The AI suggestions are eerily good.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6172f3] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white">
                SK
              </div>
              <div>
                <div className="text-sm font-medium text-[#f1f3f9]">Sarah Kim</div>
                <div className="text-xs text-[#4d5675]">Head of Marketing, Acme Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex flex-1 flex-col relative overflow-y-auto">
        {/* mobile-only ambient glows */}
        <div className="pointer-events-none absolute inset-0 lg:hidden overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(97,114,243,0.12)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
