"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight, Check, Phone, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+81", flag: "🇯🇵", label: "JP" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
];

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number",            test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", workspace: "", phone: "" });
  const [countryCode, setCountryCode] = useState("+1");
  const [error, setError] = useState("");

  const metRequirements = passwordRequirements.filter((r) => r.test(form.password));
  const passwordStrength = metRequirements.length;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          workspaceName: form.workspace || form.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Account created but sign-in failed. Please log in.");
        router.push("/login");
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/onboarding" });
  }

  return (
    <div className="animate-fade-up">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))", boxShadow: "0 0 24px rgba(23,122,65,0.35)" }}>
          <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>Create your account</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-tertiary)" }}>Start your 14-day free trial. No credit card required.</p>
        </div>
      </div>

      {/* Feature pills */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {["AI Content Generation", "10 Social Accounts", "Unlimited Scheduling"].map((f) => (
          <span key={f} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(23,122,65,0.08)", border: "1px solid rgba(23,122,65,0.2)", color: "var(--brand-500)" }}>
            <Check className="h-3 w-3" />
            {f}
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>



        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full name"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Workspace name"
              placeholder="Acme Inc."
              value={form.workspace}
              onChange={(e) => setForm({ ...form, workspace: e.target.value })}
              required
            />
          </div>

          <Input
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Phone number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>
              Phone number <span style={{ color: "var(--ink-tertiary)" }}>(optional)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-10 rounded-[0.625rem] px-2 text-sm transition-all focus:outline-none"
                style={{
                  backgroundColor: "var(--surface-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--ink-primary)",
                  minWidth: 76,
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="flex h-10 flex-1 rounded-[0.625rem] px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--surface-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--ink-primary)",
                }}
              />
            </div>
            <p className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-tertiary)" }}>
              <Phone className="h-3 w-3" />
              Used for two-factor authentication — never shared
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="flex h-10 w-full rounded-[0.625rem] px-3 py-2 pr-10 text-sm transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--surface-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--ink-primary)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--ink-tertiary)" }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= passwordStrength
                        ? passwordStrength === 1 ? "bg-[#ef4444]" : passwordStrength === 2 ? "bg-[#f59e0b]" : "bg-[#10b981]"
                        : "bg-[rgba(0,0,0,0.1)]"
                    }`} />
                  ))}
                </div>
                <div className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${req.test(form.password) ? "bg-[#10b981]" : "bg-[rgba(0,0,0,0.15)]"}`} />
                      <span className="text-xs transition-colors" style={{ color: req.test(form.password) ? "var(--success)" : "var(--ink-tertiary)" }}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#ef4444" }} />
              <span className="text-sm" style={{ color: "#ef4444" }}>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
            size="lg"
            rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Create account
          </Button>

          <p className="text-center text-xs" style={{ color: "var(--ink-tertiary)" }}>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="font-medium" style={{ color: "var(--brand-500)" }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium" style={{ color: "var(--brand-500)" }}>Privacy Policy</Link>.
          </p>
        </form>
      </div>

      <p className="mt-5 text-center text-sm" style={{ color: "var(--ink-tertiary)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--brand-500)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
