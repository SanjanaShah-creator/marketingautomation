"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function OtpInput({ code, onChange }: { code: string[]; onChange: (c: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    onChange(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {code.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-14 w-11 rounded-xl text-center text-xl font-bold transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--surface-50)",
            border: `1.5px solid ${digit ? "var(--brand-500)" : "var(--border)"}`,
            color: "var(--ink-primary)",
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [show2Fa, setShow2Fa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState(["", "", "", "", "", ""]);
  const [verifying2Fa, setVerifying2Fa] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (form.email.includes("2fa")) {
      setShow2Fa(true);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleVerify2Fa() {
    setVerifying2Fa(true);
    await new Promise((r) => setTimeout(r, 900));
    setVerifying2Fa(false);
    router.push("/dashboard");
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
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink-primary)" }}>Welcome back</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-tertiary)" }}>Sign in to your SocialSync workspace</p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-3xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        {/* Google OAuth */}
        <Button variant="secondary" size="sm" className="w-full gap-2 mb-5">
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative mb-5 flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
          <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>or continue with email</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>Password</label>
              <Link href="/forgot-password" className="text-xs font-medium transition-colors"
                style={{ color: "var(--brand-500)" }}>
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
                className="flex h-10 w-full rounded-[0.625rem] px-3 py-2 pr-10 text-sm transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--surface-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--ink-primary)",
                  "--tw-ring-color": "rgba(23,122,65,0.25)",
                } as React.CSSProperties}
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
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-1"
            size="lg"
            rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Sign in
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm" style={{ color: "var(--ink-tertiary)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium transition-colors" style={{ color: "var(--brand-500)" }}>
          Create one free
        </Link>
      </p>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2Fa && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-xl"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}
            >
              <button
                onClick={() => setShow2Fa(false)}
                className="absolute right-4 top-4 rounded-lg p-1 transition-colors"
                style={{ color: "var(--ink-tertiary)" }}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(23,122,65,0.1)" }}>
                  <ShieldCheck className="h-6 w-6" style={{ color: "var(--brand-500)" }} />
                </div>
                <h2 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Two-factor authentication</h2>
                <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="space-y-4">
                <OtpInput code={twoFaCode} onChange={setTwoFaCode} />

                <Button
                  className="w-full"
                  size="lg"
                  loading={verifying2Fa}
                  disabled={twoFaCode.some((d) => !d)}
                  onClick={handleVerify2Fa}
                >
                  Verify
                </Button>

                <p className="text-center text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Lost access to your app?{" "}
                  <button className="font-medium transition-colors" style={{ color: "var(--brand-500)" }}>
                    Use a recovery code
                  </button>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
