"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Mail, Trash2, Crown, Shield, Edit3, Eye,
  Copy, Check, Clock, X, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { MemberRole } from "@/types";

// ── Types & data ───────────────────────────────────────────────────────────

interface TeamMember {
  id: string; name: string; email: string; role: MemberRole;
  joinedAt: Date; lastActive: Date; image?: string; postsCount: number;
}

interface PendingInvite {
  id: string; email: string; role: MemberRole; sentAt: Date; expiresAt: Date;
}

const MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alex Johnson",  email: "alex@acme.com",   role: "OWNER",  joinedAt: new Date("2024-01-15"), lastActive: new Date(Date.now() - 5 * 60000),          postsCount: 142 },
  { id: "u2", name: "Sarah Chen",    email: "sarah@acme.com",  role: "ADMIN",  joinedAt: new Date("2024-02-20"), lastActive: new Date(Date.now() - 2 * 3600000),         postsCount: 87 },
  { id: "u3", name: "Marcus Wells",  email: "marcus@acme.com", role: "EDITOR", joinedAt: new Date("2024-03-08"), lastActive: new Date(Date.now() - 24 * 3600000),        postsCount: 34 },
  { id: "u4", name: "Priya Sharma",  email: "priya@acme.com",  role: "EDITOR", joinedAt: new Date("2024-04-01"), lastActive: new Date(Date.now() - 3 * 24 * 3600000),    postsCount: 21 },
  { id: "u5", name: "Tom Richards",  email: "tom@acme.com",    role: "VIEWER", joinedAt: new Date("2024-05-10"), lastActive: new Date(Date.now() - 7 * 24 * 3600000),    postsCount: 0 },
];

const PENDING_INVITES: PendingInvite[] = [
  { id: "i1", email: "newmember@acme.com", role: "EDITOR", sentAt: new Date(Date.now() - 2 * 24 * 3600000), expiresAt: new Date(Date.now() + 5 * 24 * 3600000) },
];

const ROLE_META: Record<MemberRole, { label: string; icon: React.FC<{className?: string}>; iconColor: string; desc: string }> = {
  OWNER:  { label: "Owner",  icon: Crown,  iconColor: "#d97706", desc: "Full workspace control" },
  ADMIN:  { label: "Admin",  icon: Shield, iconColor: "var(--info)", desc: "Manage team & settings" },
  EDITOR: { label: "Editor", icon: Edit3,  iconColor: "var(--success)", desc: "Create & publish posts" },
  VIEWER: { label: "Viewer", icon: Eye,    iconColor: "var(--ink-muted)", desc: "View-only access" },
};

// ── Invite modal ───────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("EDITOR");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
      >
        <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--ink-primary)" }}>Invite team member</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>They&apos;ll receive an email with a join link</p>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--ink-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(22,101,52,0.1)", border: "1px solid rgba(22,101,52,0.2)" }}>
                <Check className="h-7 w-7" style={{ color: "var(--success)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Invitation sent!</p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                  An email was sent to{" "}
                  <span style={{ color: "var(--brand-500)" }}>{email}</span>
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-xs font-medium" style={{ color: "var(--ink-secondary)" }}>Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["EDITOR", "VIEWER", "ADMIN"] as MemberRole[]).map((r) => {
                    const meta = ROLE_META[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className="flex items-center gap-2.5 rounded-xl p-3 text-left transition-all"
                        style={{
                          border: isSelected ? "1px solid rgba(23,122,65,0.3)" : "1px solid var(--border)",
                          backgroundColor: isSelected ? "rgba(23,122,65,0.06)" : "var(--surface-50)",
                        }}>
                        <span style={{ color: meta.iconColor }}><meta.icon className="h-4 w-4 shrink-0" /></span>
                        <div>
                          <p className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>{meta.label}</p>
                          <p className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{meta.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button
                  loading={sending}
                  className="flex-1"
                  disabled={!email}
                  onClick={handleSend}
                  leftIcon={<Mail className="h-4 w-4" />}>
                  Send invite
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [members, setMembers] = useState(MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);

  async function copyInviteLink(id: string) {
    await navigator.clipboard.writeText(`https://app.socialsync.io/invite/${id}`);
    setCopiedInvite(id);
    setTimeout(() => setCopiedInvite(null), 2000);
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Team members</h2>
          <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{members.length} members · 1 pending invite</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setInviteOpen(true)}>
          Invite member
        </Button>
      </div>

      {/* Roles overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(ROLE_META) as [MemberRole, typeof ROLE_META[MemberRole]][]).map(([role, meta]) => {
          const count = members.filter((m) => m.role === role).length;
          return (
            <div key={role} className="card-base p-4 text-center">
              <span style={{ color: meta.iconColor }}><meta.icon className="h-5 w-5 mx-auto mb-2" /></span>
              <div className="text-xl font-bold" style={{ color: "var(--ink-primary)" }}>{count}</div>
              <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{meta.label}{count !== 1 ? "s" : ""}</div>
            </div>
          );
        })}
      </div>

      {/* Members list */}
      <div className="space-y-2">
        {members.map((member, i) => {
          const meta = ROLE_META[member.role];
          const isOwner = member.role === "OWNER";
          return (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 rounded-xl p-3.5 transition-all group"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--card)"; }}>
              <UserAvatar name={member.name} image={member.image} size="md" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>{member.name}</span>
                  <span className="flex items-center gap-1 text-2xs" style={{ color: meta.iconColor }}>
                    <meta.icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{member.email}</span>
                  <span className="text-2xs" style={{ color: "var(--ink-muted)" }}>·</span>
                  <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Active {formatRelativeTime(member.lastActive)}</span>
                  {member.postsCount > 0 && (
                    <>
                      <span className="text-2xs" style={{ color: "var(--ink-muted)" }}>·</span>
                      <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{member.postsCount} posts</span>
                    </>
                  )}
                </div>
              </div>

              {!isOwner && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeMember(member.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                    style={{ color: "var(--ink-tertiary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.backgroundColor = ""; }}
                    title="Remove member">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pending invites */}
      {PENDING_INVITES.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--ink-secondary)" }}>Pending invites</h3>
          <div className="space-y-2">
            {PENDING_INVITES.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-4 rounded-xl border-dashed p-3.5"
                style={{ border: "1px dashed var(--border-strong)", backgroundColor: "var(--surface-50)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: "var(--surface-100)" }}>
                  <Mail className="h-4 w-4" style={{ color: "var(--ink-muted)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>{invite.email}</span>
                    <Badge variant="warning" className="text-2xs">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3" style={{ color: "var(--ink-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>Expires {formatRelativeTime(invite.expiresAt)}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => copyInviteLink(invite.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)", color: "var(--ink-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}>
                    {copiedInvite === invite.id ? <Check className="h-3 w-3" style={{ color: "var(--success)" }} /> : <Copy className="h-3 w-3" />}
                    {copiedInvite === invite.id ? "Copied" : "Copy link"}
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                    style={{ color: "var(--ink-tertiary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.backgroundColor = ""; }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Role permissions table */}
      <section>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--ink-secondary)" }}>Permissions</h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}>
                <th className="py-3 px-4 text-left text-2xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>Permission</th>
                {(["OWNER", "ADMIN", "EDITOR", "VIEWER"] as MemberRole[]).map((r) => {
                  const meta = ROLE_META[r];
                  return (
                    <th key={r} className="py-3 px-3 text-center text-2xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>
                      {meta.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {[
                { action: "View posts",            perms: [true,  true,  true,  true]  },
                { action: "Create & edit posts",   perms: [true,  true,  true,  false] },
                { action: "Publish & schedule",    perms: [true,  true,  true,  false] },
                { action: "Connect accounts",      perms: [true,  true,  false, false] },
                { action: "Invite members",        perms: [true,  true,  false, false] },
                { action: "Manage billing",        perms: [true,  false, false, false] },
                { action: "Delete workspace",      perms: [true,  false, false, false] },
              ].map((row, i) => (
                <tr key={row.action}
                  style={{
                    borderBottom: i < 6 ? "1px solid var(--border-subtle)" : "none",
                    backgroundColor: i % 2 === 1 ? "var(--surface-50)" : "transparent",
                  }}>
                  <td className="py-3 px-4" style={{ color: "var(--ink-secondary)" }}>{row.action}</td>
                  {row.perms.map((allowed, j) => (
                    <td key={j} className="py-3 px-3 text-center">
                      {allowed ? (
                        <Check className="h-4 w-4 mx-auto" style={{ color: "var(--success)" }} />
                      ) : (
                        <X className="h-4 w-4 mx-auto" style={{ color: "var(--ink-muted)" }} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invite modal */}
      <AnimatePresence>
        {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
