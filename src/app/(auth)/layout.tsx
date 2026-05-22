import { Zap, BarChart2, Calendar, Sparkles, Users } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, label: "AI Content Generation", desc: "Write 10× faster with Claude" },
  { icon: Calendar,  label: "Smart Scheduling",      desc: "Post at peak engagement times" },
  { icon: BarChart2, label: "Analytics Dashboard",   desc: "Track what actually works" },
  { icon: Users,     label: "Team Collaboration",    desc: "Multi-user workspaces & roles" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--surface-0)" }}>

      {/* ── Left branding panel (lg+) ────────────────── */}
      <div className="hidden lg:flex relative w-[52%] max-w-[620px] flex-col overflow-hidden border-r"
        style={{ backgroundColor: "var(--surface-50)", borderColor: "var(--border)" }}>
        {/* Subtle background pattern */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(23,122,65,0.08) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(23,122,65,0.05) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #177A41, #0F5E31)" }}>
              <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>SocialSync</span>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h2 className="text-4xl xl:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-4"
              style={{ color: "var(--ink-primary)" }}>
              Your AI-powered<br />
              <span className="gradient-text">social media HQ</span>
            </h2>
            <p className="text-base leading-relaxed max-w-sm" style={{ color: "var(--ink-secondary)" }}>
              Plan, create, and schedule content across every platform — 10× faster with AI.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-3 rounded-xl p-3.5 border"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(23,122,65,0.1)" }}>
                  <Icon className="h-4 w-4" style={{ color: "var(--brand-500)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            {[
              { n: "50K+", l: "Teams" },
              { n: "10M+", l: "Posts scheduled" },
              { n: "4.9★", l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold gradient-text">{s.n}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-auto rounded-2xl p-5 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5" fill="#F59E0B" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-secondary)" }}>
              &ldquo;SocialSync saved our team 15 hours a week on content creation. The AI suggestions are eerily good.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #177A41, #0F5E31)" }}>
                SK
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Sarah Kim</div>
                <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Head of Marketing, Acme Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
