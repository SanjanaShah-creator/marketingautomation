"use client";

import { useState } from "react";
import {
  User, Bell, Shield, CreditCard, Globe, Palette,
  ChevronRight, Save, Trash2, AlertTriangle, Check,
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
        <h3 className="text-base font-semibold text-[#f1f3f9]">Profile</h3>
        <p className="text-sm text-[#4d5675]">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
        <UserAvatar name={form.name} size="xl" />
        <div>
          <p className="text-sm font-medium text-[#f1f3f9]">Profile photo</p>
          <p className="text-xs text-[#4d5675] mt-0.5">JPG, GIF or PNG. Max 3MB.</p>
          <div className="mt-3 flex gap-2">
            <Button size="xs" variant="secondary">Upload photo</Button>
            <Button size="xs" variant="ghost" className="text-[#f87171]">Remove</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Input
          label="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          hint="Used for notifications and account recovery"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#8892aa]">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell your team a little about yourself..."
            rows={3}
            className="w-full resize-none rounded-[0.625rem] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] placeholder:text-[#4d5675] focus:border-[rgba(97,114,243,0.6)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(97,114,243,0.12)]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSave}
          leftIcon={saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          className={cn(saved && "bg-[rgba(16,185,129,0.9)]")}
        >
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function WorkspaceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[#f1f3f9]">Workspace settings</h3>
        <p className="text-sm text-[#4d5675]">Manage your workspace preferences</p>
      </div>

      <div className="grid gap-4">
        <Input label="Workspace name" defaultValue="Acme Inc." />
        <Input label="Workspace URL" defaultValue="acme-inc" hint="app.socialsync.io/w/acme-inc" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#8892aa]">Default posting timezone</label>
          <select className="h-9 w-full rounded-[0.625rem] bg-[rgba(255,255,255,0.04)] px-3 text-sm text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(97,114,243,0.6)] focus:outline-none [color-scheme:dark]">
            <option>(UTC-5) Eastern Time</option>
            <option>(UTC-8) Pacific Time</option>
            <option>(UTC+0) UTC</option>
            <option>(UTC+1) London</option>
            <option>(UTC+5:30) India</option>
          </select>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#f87171]" />
          <h4 className="text-sm font-semibold text-[#f87171]">Danger zone</h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#f1f3f9]">Delete workspace</p>
            <p className="text-xs text-[#4d5675]">Permanently delete this workspace and all its data</p>
          </div>
          <Button variant="destructive" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [settings, setSettings] = useState({
    postPublished: true,
    postFailed: true,
    scheduled: false,
    teamInvite: true,
    aiCreditsLow: true,
    weeklyDigest: false,
    emailNotifs: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const notifGroups = [
    {
      label: "Posts",
      items: [
        { key: "postPublished" as const, label: "Post published", desc: "When a post goes live" },
        { key: "postFailed" as const, label: "Post failed", desc: "When publishing encounters an error" },
        { key: "scheduled" as const, label: "Scheduled reminders", desc: "24h before a post publishes" },
      ],
    },
    {
      label: "Team",
      items: [
        { key: "teamInvite" as const, label: "Team activity", desc: "New members, role changes" },
      ],
    },
    {
      label: "Account",
      items: [
        { key: "aiCreditsLow" as const, label: "AI credits low", desc: "When below 10 credits" },
        { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Performance summary every Monday" },
        { key: "emailNotifs" as const, label: "Email notifications", desc: "Receive notifications via email" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[#f1f3f9]">Notifications</h3>
        <p className="text-sm text-[#4d5675]">Choose what you want to be notified about</p>
      </div>

      <div className="space-y-6">
        {notifGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4d5675] mb-3">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl p-3 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#f1f3f9]">{item.label}</p>
                    <p className="text-xs text-[#4d5675]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-all duration-200",
                      settings[item.key] ? "bg-[#6172f3]" : "bg-[rgba(255,255,255,0.1)]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200",
                        settings[item.key] ? "left-[calc(100%-1rem-2px)]" : "left-0.5"
                      )}
                    />
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

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[#f1f3f9]">Billing</h3>
        <p className="text-sm text-[#4d5675]">Manage your subscription and payments</p>
      </div>

      {/* Current plan */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(97,114,243,0.25)] bg-gradient-to-br from-[rgba(97,114,243,0.1)] to-[rgba(168,85,247,0.05)] p-5">
        <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-[#f1f3f9]">Growth Plan</span>
              <Badge variant="default">Active</Badge>
            </div>
            <p className="text-2xl font-bold text-[#f1f3f9]">$49<span className="text-sm font-normal text-[#8892aa]">/month</span></p>
            <p className="text-xs text-[#4d5675] mt-1">Renews December 18, 2026</p>
          </div>
          <Button variant="secondary" size="sm">Manage plan</Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Social accounts", value: "3/10" },
            { label: "AI credits", value: "32/50" },
            { label: "Team members", value: "5/∞" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[rgba(0,0,0,0.3)] p-3 text-center">
              <div className="text-sm font-bold text-[#f1f3f9]">{s.value}</div>
              <div className="text-2xs text-[#4d5675]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4d5675] mb-3">Payment method</p>
        <div className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]">
              <span className="text-xs font-bold text-[#f1f3f9]">VISA</span>
            </div>
            <div>
              <p className="text-sm text-[#f1f3f9]">•••• •••• •••• 4242</p>
              <p className="text-xs text-[#4d5675]">Expires 12/27</p>
            </div>
          </div>
          <Button size="xs" variant="secondary">Update</Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("profile");

  const sectionComponents: Record<SettingsSection, React.FC> = {
    profile: ProfileSection,
    workspace: WorkspaceSection,
    notifications: NotificationsSection,
    billing: BillingSection,
    security: () => (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-[#f1f3f9]">Security</h3>
          <p className="text-sm text-[#4d5675]">Manage your account security settings</p>
        </div>
        <Input label="Current password" type="password" placeholder="••••••••" />
        <Input label="New password" type="password" placeholder="••••••••" />
        <Input label="Confirm new password" type="password" placeholder="••••••••" />
        <Button size="sm">Update password</Button>
      </div>
    ),
  };

  const SectionComponent = sectionComponents[section];

  return (
    <div className="max-w-3xl flex gap-6">
      {/* Nav */}
      <div className="w-48 shrink-0">
        <nav className="space-y-0.5">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={cn(
                "sidebar-item w-full",
                section === id && "active"
              )}
            >
              <Icon className={cn("h-4 w-4", section === id ? "text-[#6172f3]" : "text-[#4d5675]")} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="card-base p-6"
          >
            <SectionComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
