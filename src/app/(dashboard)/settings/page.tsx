"use client";

import { useState, useRef } from "react";
import {
  User, Bell, Shield, CreditCard, Globe,
  Save, Trash2, AlertTriangle, Check, X,
  Smartphone, ShieldCheck, Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SettingsSection = "profile" | "workspace" | "notifications" | "billing" | "security";

const SECTIONS = [
  { id: "profile" as const,       label: "Profile",       icon: User },
  { id: "workspace" as const,     label: "Workspace",     icon: Globe },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "billing" as const,       label: "Billing",       icon: CreditCard },
  { id: "security" as const,      label: "Security",      icon: Shield },
];

/* ── OTP input ─────────────────────────────────────────────────────────── */
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
          className="h-12 w-10 rounded-xl text-center text-lg font-bold transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--border-subtle)",
            border: `1.5px solid ${digit ? "var(--brand-500)" : "var(--border)"}`,
            color: "var(--ink-primary)",
          }}
        />
      ))}
    </div>
  );
}

/* ── QR code placeholder ────────────────────────────────────────────────── */
function QRCodePlaceholder() {
  const size = 21;
  const cells: boolean[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r < 7 && c < 7) {
        cells.push(r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
      } else if (r < 7 && c >= 14) {
        const fc = c - 14;
        cells.push(r === 0 || r === 6 || fc === 0 || fc === 6 || (r >= 2 && r <= 4 && fc >= 2 && fc <= 4));
      } else if (r >= 14 && c < 7) {
        const fr = r - 14;
        cells.push(fr === 0 || fr === 6 || c === 0 || c === 6 || (fr >= 2 && fr <= 4 && c >= 2 && c <= 4));
      } else if (r === 6 || c === 6) {
        cells.push((r + c) % 2 === 0);
      } else {
        cells.push((r * 37 + c * 17 + r * c) % 7 < 4);
      }
    }
  }
  return (
    <div style={{ padding: 10, backgroundColor: "#ffffff", borderRadius: 10, display: "inline-block" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 1fr)`, width: 140, height: 140, gap: 1 }}>
        {cells.map((filled, i) => (
          <div key={i} style={{ backgroundColor: filled ? "#111" : "#fff" }} />
        ))}
      </div>
    </div>
  );
}

/* ── Profile ────────────────────────────────────────────────────────────── */
function ProfileSection() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "Alex Johnson", email: "alex@acme.com", bio: "" });

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Profile</h3>
        <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Manage your personal information</p>
      </div>
      <div className="flex items-center gap-5 rounded-2xl p-5" style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
        <UserAvatar name={form.name} size="xl" />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>Profile photo</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>JPG, GIF or PNG. Max 3MB.</p>
          <div className="mt-3 flex gap-2">
            <Button size="xs" variant="secondary">Upload photo</Button>
            <Button size="xs" variant="ghost" className="text-[var(--danger)]">Remove</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} hint="Used for notifications and account recovery" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell your team a little about yourself..."
            rows={3}
            className="w-full resize-none rounded-[0.625rem] px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--border-subtle)",
              border: "1px solid var(--border)",
              color: "var(--ink-primary)",
            }}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} leftIcon={saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}>
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

/* ── Workspace ──────────────────────────────────────────────────────────── */
function WorkspaceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Workspace settings</h3>
        <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Manage your workspace preferences</p>
      </div>
      <div className="grid gap-4">
        <Input label="Workspace name" defaultValue="Acme Inc." />
        <Input label="Workspace URL" defaultValue="acme-inc" hint="app.socialsync.io/w/acme-inc" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>Default posting timezone</label>
          <select
            className="h-9 w-full rounded-[0.625rem] px-3 text-sm transition-all focus:outline-none"
            style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)", color: "var(--ink-primary)" }}
          >
            <option>(UTC-5) Eastern Time</option>
            <option>(UTC-8) Pacific Time</option>
            <option>(UTC+0) UTC</option>
            <option>(UTC+1) London</option>
            <option>(UTC+5:30) India</option>
          </select>
        </div>
      </div>
      <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(239,68,68,0.2)", backgroundColor: "rgba(239,68,68,0.04)" }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color: "var(--danger)" }} />
          <h4 className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Danger zone</h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>Delete workspace</p>
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Permanently delete this workspace and all its data</p>
          </div>
          <Button variant="destructive" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Notifications ──────────────────────────────────────────────────────── */
function NotificationsSection() {
  const [settings, setSettings] = useState({
    postPublished: true, postFailed: true, scheduled: false,
    teamInvite: true, aiCreditsLow: true, weeklyDigest: false, emailNotifs: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const notifGroups = [
    { label: "Posts", items: [
      { key: "postPublished" as const, label: "Post published", desc: "When a post goes live" },
      { key: "postFailed" as const, label: "Post failed", desc: "When publishing encounters an error" },
      { key: "scheduled" as const, label: "Scheduled reminders", desc: "24h before a post publishes" },
    ]},
    { label: "Team", items: [
      { key: "teamInvite" as const, label: "Team activity", desc: "New members, role changes" },
    ]},
    { label: "Account", items: [
      { key: "aiCreditsLow" as const, label: "AI credits low", desc: "When below 10 credits" },
      { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Performance summary every Monday" },
      { key: "emailNotifs" as const, label: "Email notifications", desc: "Receive notifications via email" },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Notifications</h3>
        <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Choose what you want to be notified about</p>
      </div>
      <div className="space-y-6">
        {notifGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-tertiary)" }}>{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl p-3 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-subtle)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>{item.label}</p>
                    <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className="relative h-5 w-9 rounded-full transition-all duration-200"
                    style={{ backgroundColor: settings[item.key] ? "var(--brand-500)" : "var(--border)" }}>
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200",
                      settings[item.key] ? "left-[calc(100%-1rem-2px)]" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Billing ────────────────────────────────────────────────────────────── */
function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Billing</h3>
        <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Manage your subscription and payments</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl p-5" style={{ border: "1px solid rgba(23,122,65,0.25)", background: "linear-gradient(135deg, rgba(23,122,65,0.08) 0%, rgba(23,122,65,0.03) 100%)" }}>
        <div className="absolute top-0 right-0 h-32 w-32" style={{ background: "radial-gradient(circle, rgba(23,122,65,0.1) 0%, transparent 70%)" }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ color: "var(--ink-primary)" }}>Growth Plan</span>
              <Badge variant="default">Active</Badge>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--ink-primary)" }}>$49<span className="text-sm font-normal" style={{ color: "var(--ink-secondary)" }}>/month</span></p>
            <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>Renews December 18, 2026</p>
          </div>
          <Button variant="secondary" size="sm">Manage plan</Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[{ label: "Social accounts", value: "3/10" }, { label: "AI credits", value: "32/50" }, { label: "Team members", value: "5/∞" }].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
              <div className="text-sm font-bold" style={{ color: "var(--ink-primary)" }}>{s.value}</div>
              <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-tertiary)" }}>Payment method</p>
        <div className="flex items-center justify-between rounded-xl p-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--border)", border: "1px solid var(--border-strong)" }}>
              <span className="text-xs font-bold" style={{ color: "var(--ink-primary)" }}>VISA</span>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--ink-primary)" }}>•••• •••• •••• 4242</p>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Expires 12/27</p>
            </div>
          </div>
          <Button size="xs" variant="secondary">Update</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Security ───────────────────────────────────────────────────────────── */
function SecuritySection() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [show2FaSetup, setShow2FaSetup] = useState(false);
  const [show2FaDisable, setShow2FaDisable] = useState(false);
  const [setupCode, setSetupCode] = useState(["", "", "", "", "", ""]);
  const [disableCode, setDisableCode] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const FAKE_SECRET = "JBSWY3DPEHPK3PXP";

  async function handleEnable2Fa() {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    setTwoFaEnabled(true);
    setShow2FaSetup(false);
    setSetupCode(["", "", "", "", "", ""]);
  }

  async function handleDisable2Fa() {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    setVerifying(false);
    setTwoFaEnabled(false);
    setShow2FaDisable(false);
    setDisableCode(["", "", "", "", "", ""]);
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    await fetch("/api/user/delete", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Security</h3>
          <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>Manage your account security settings</p>
        </div>

        {/* Password */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>Password</p>
          <Input label="Current password" type="password" placeholder="••••••••" />
          <Input label="New password" type="password" placeholder="••••••••" />
          <Input label="Confirm new password" type="password" placeholder="••••••••" />
          <Button size="sm"
            leftIcon={passwordSaved ? <Check className="h-4 w-4" /> : undefined}
            onClick={async () => { await new Promise(r => setTimeout(r, 800)); setPasswordSaved(true); setTimeout(() => setPasswordSaved(false), 2000); }}>
            {passwordSaved ? "Password updated!" : "Update password"}
          </Button>
        </div>

        {/* 2FA */}
        <div className="rounded-2xl p-5 space-y-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: twoFaEnabled ? "rgba(107,191,138,0.12)" : "var(--border)" }}>
                <ShieldCheck className="h-4 w-4" style={{ color: twoFaEnabled ? "var(--brand-500)" : "var(--ink-tertiary)" }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>Two-Factor Authentication</p>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {twoFaEnabled && <Badge variant="success">Active</Badge>}
              <Button size="xs" variant={twoFaEnabled ? "ghost" : "secondary"}
                onClick={() => twoFaEnabled ? setShow2FaDisable(true) : setShow2FaSetup(true)}>
                {twoFaEnabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>

          {twoFaEnabled && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: "rgba(107,191,138,0.08)", border: "1px solid rgba(107,191,138,0.15)" }}>
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--brand-500)" }} />
              <p className="text-xs" style={{ color: "var(--brand-500)" }}>Your account is protected with two-factor authentication.</p>
            </div>
          )}
        </div>

        {/* Recovery codes */}
        {twoFaEnabled && (
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ border: "1px solid var(--border)", backgroundColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>Recovery codes</p>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>8 codes remaining</p>
              </div>
            </div>
            <Button size="xs" variant="secondary">View codes</Button>
          </div>
        )}

        {/* Danger zone */}
        <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(239,68,68,0.2)", backgroundColor: "rgba(239,68,68,0.04)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--danger)" }} />
            <h4 className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Danger zone</h4>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>Delete your account</p>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => setShowDeleteModal(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA Setup modal */}
      <AnimatePresence>
        {show2FaSetup && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShow2FaSetup(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
              <button onClick={() => setShow2FaSetup(false)}
                className="absolute right-4 top-4 rounded-lg p-1 transition-colors"
                style={{ color: "var(--ink-tertiary)" }}>
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(107,191,138,0.12)" }}>
                  <Smartphone className="h-5 w-5" style={{ color: "var(--brand-500)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Set up two-factor authentication</p>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Use an authenticator app to generate codes</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mb-5">
                <QRCodePlaceholder />
                <p className="text-xs text-center" style={{ color: "var(--ink-tertiary)" }}>
                  Scan with Google Authenticator, Authy, or any TOTP app
                </p>
                <div className="w-full rounded-xl p-3 text-center" style={{ backgroundColor: "var(--border-subtle)", border: "1px solid var(--border)" }}>
                  <p className="text-2xs mb-1" style={{ color: "var(--ink-tertiary)" }}>Manual entry code</p>
                  <p className="text-xs font-mono tracking-widest font-semibold" style={{ color: "var(--ink-primary)" }}>{FAKE_SECRET}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-center" style={{ color: "var(--ink-secondary)" }}>Enter the 6-digit code from your app to verify</p>
                <OtpInput code={setupCode} onChange={setSetupCode} />
                <Button className="w-full" onClick={handleEnable2Fa} loading={verifying}
                  disabled={setupCode.some((d) => !d)}>
                  Verify & Enable 2FA
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2FA Disable modal */}
      <AnimatePresence>
        {show2FaDisable && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShow2FaDisable(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
              <button onClick={() => setShow2FaDisable(false)}
                className="absolute right-4 top-4 rounded-lg p-1"
                style={{ color: "var(--ink-tertiary)" }}>
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: "var(--danger)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Disable 2FA?</p>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Enter your current code to confirm</p>
                </div>
              </div>
              <div className="space-y-4">
                <OtpInput code={disableCode} onChange={setDisableCode} />
                <div className="flex gap-2">
                  <button onClick={() => setShow2FaDisable(false)}
                    className="flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                    style={{ backgroundColor: "var(--border-subtle)", color: "var(--ink-secondary)" }}>
                    Cancel
                  </button>
                  <button onClick={handleDisable2Fa}
                    className="flex-1 rounded-xl py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: "var(--danger)" }}
                    disabled={disableCode.some((d) => !d)}>
                    {verifying ? "Verifying…" : "Disable 2FA"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete account modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
              <button onClick={() => setShowDeleteModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1"
                style={{ color: "var(--ink-tertiary)" }}>
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: "var(--danger)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Delete your account</p>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--ink-secondary)" }}>
                All your workspaces, posts, analytics, and team data will be permanently deleted. This cannot be recovered.
              </p>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>
                    Type <span className="font-mono font-bold" style={{ color: "var(--danger)" }}>DELETE</span> to confirm
                  </label>
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="h-9 w-full rounded-[0.625rem] px-3 text-sm transition-all focus:outline-none"
                    style={{
                      backgroundColor: "var(--border-subtle)",
                      border: `1px solid ${deleteConfirm === "DELETE" ? "var(--danger)" : "var(--border)"}`,
                      color: "var(--ink-primary)",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                    className="flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                    style={{ backgroundColor: "var(--border-subtle)", color: "var(--ink-secondary)" }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "DELETE" || deleting}
                    className="flex-1 rounded-xl py-2 text-sm font-medium text-white transition-all"
                    style={{
                      backgroundColor: "var(--danger)",
                      opacity: deleteConfirm !== "DELETE" || deleting ? 0.5 : 1,
                    }}>
                    {deleting ? "Deleting…" : "Delete my account"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("profile");

  const sectionComponents: Record<SettingsSection, React.FC> = {
    profile: ProfileSection,
    workspace: WorkspaceSection,
    notifications: NotificationsSection,
    billing: BillingSection,
    security: SecuritySection,
  };

  const SectionComponent = sectionComponents[section];

  return (
    <div className="max-w-3xl flex gap-6">
      <div className="w-48 shrink-0">
        <nav className="space-y-0.5">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className={cn("sidebar-item w-full", section === id && "active")}>
              <Icon className="h-4 w-4" style={{ color: section === id ? "var(--brand-500)" : "var(--ink-tertiary)" }} />
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="card-base p-6">
            <SectionComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
