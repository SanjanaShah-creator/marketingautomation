"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, RefreshCw, ExternalLink, AlertCircle,
  CheckCircle2, XCircle, Link2, Shield, MoreHorizontal, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import type { SocialPlatform } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────

interface ConnectedAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  displayName: string;
  avatar?: string | null;
  followers: number;
  following: number;
  posts: number;
  isActive: boolean;
  lastSync: string;
  tokenExpiresAt?: string | null;
}

const AVAILABLE_PLATFORMS: { platform: SocialPlatform; desc: string; connectHref: string }[] = [
  { platform: "FACEBOOK",  desc: "Pages & personal profiles", connectHref: "#" },
  { platform: "TIKTOK",    desc: "Short-form video content",  connectHref: "#" },
  { platform: "YOUTUBE",   desc: "Long-form video & shorts",  connectHref: "#" },
  { platform: "THREADS",   desc: "Microblogging by Meta",     connectHref: "#" },
];

// ── AccountCard ────────────────────────────────────────────────────────────

function AccountCard({
  account, onRefresh, onDisconnect,
}: {
  account: ConnectedAccount;
  onRefresh: () => void;
  onDisconnect: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  const isHealthy = account.isActive && !isExpired;

  async function handleRefresh() {
    setRefreshing(true);
    setMenuOpen(false);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
    onRefresh();
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        opacity: isHealthy ? 1 : 0.85,
      }}
    >
      {/* Status strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{
          background: isHealthy
            ? "linear-gradient(90deg, var(--success), var(--brand-500))"
            : "linear-gradient(90deg, var(--danger), #f87171)",
        }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <PlatformIcon platform={account.platform} size={18} showBg />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
                {account.displayName}
              </span>
              <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{account.handle}</span>
              {isHealthy ? (
                <span className="flex items-center gap-1 text-2xs" style={{ color: "var(--success)" }}>
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-2xs" style={{ color: "var(--danger)" }}>
                  <XCircle className="h-3 w-3" />
                  {isExpired ? "Token expired" : "Disconnected"}
                </span>
              )}
            </div>
            <p className="text-2xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>
              Last synced {formatRelativeTime(new Date(account.lastSync))}
            </p>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -4 }}
                  className="absolute right-0 top-8 z-20 w-44 rounded-xl overflow-hidden shadow-lg"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-strong)" }}
                >
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={handleRefresh}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors"
                      style={{ color: "var(--ink-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-secondary)"; }}
                    >
                      {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      Refresh token
                    </button>
                    <button
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors"
                      style={{ color: "var(--ink-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-secondary)"; }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View profile
                    </button>
                    <div className="my-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                    <button
                      onClick={() => { onDisconnect(); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors"
                      style={{ color: "var(--danger)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.06)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Disconnect
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Followers", value: formatNumber(account.followers) },
          { label: "Following", value: formatNumber(account.following) },
          { label: "Posts",     value: formatNumber(account.posts) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2.5 text-center"
            style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="text-sm font-bold" style={{ color: "var(--ink-primary)" }}>{s.value}</div>
            <div className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reconnect banner */}
      {!isHealthy && (
        <div
          className="mt-4 flex items-center gap-3 rounded-xl p-3"
          style={{ backgroundColor: "rgba(155,28,28,0.06)", border: "1px solid rgba(155,28,28,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "var(--danger)" }} />
          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>
              {isExpired ? "Access token expired" : "Account disconnected"}
            </p>
            <p className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>Reconnect to continue posting</p>
          </div>
          {account.platform === "INSTAGRAM" && (
            <a href="/api/auth/instagram">
              <Button size="xs" variant="destructive">Reconnect</Button>
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

const MAX_SLOTS = 10;

export default function AccountsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) setAccounts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected) {
      setToast({ type: "success", msg: `${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully!` });
      loadAccounts();
    } else if (error) {
      const messages: Record<string, string> = {
        instagram_denied: "Instagram connection cancelled.",
        instagram_failed: "Instagram connection failed. Check your Meta App settings.",
        invalid_state: "Security check failed. Please try again.",
      };
      setToast({ type: "error", msg: messages[error] ?? "Connection failed." });
    }
    if (connected || error) {
      const url = new URL(window.location.href);
      url.searchParams.delete("connected");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, loadAccounts]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleDisconnect(id: string) {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
            style={{
              backgroundColor: toast.type === "success" ? "rgba(22,101,52,0.95)" : "rgba(155,28,28,0.95)",
              color: "#fff",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>
              Connected accounts
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>
              {accounts.length} of {MAX_SLOTS} account slots used
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(accounts.length / MAX_SLOTS) * 100}%`,
                  background: "linear-gradient(90deg, var(--brand-500), var(--brand-600))",
                }}
              />
            </div>
            <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{accounts.length}/{MAX_SLOTS}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border p-5 animate-pulse" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: "var(--surface-100)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded" style={{ backgroundColor: "var(--surface-100)" }} />
                    <div className="h-2.5 w-20 rounded" style={{ backgroundColor: "var(--surface-50)" }} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[1,2,3].map((j) => (
                    <div key={j} className="h-12 rounded-xl" style={{ backgroundColor: "var(--surface-50)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-50)" }}
          >
            <span style={{ color: "var(--ink-muted)" }}><Link2 className="h-10 w-10 mb-3" /></span>
            <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>No accounts connected</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "var(--ink-tertiary)" }}>
              Connect your social profiles to start scheduling
            </p>
            <a href="/api/auth/instagram">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Connect Instagram</Button>
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onRefresh={loadAccounts}
                onDisconnect={() => handleDisconnect(account.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Connect Instagram CTA */}
      {!loading && !accounts.find((a) => a.platform === "INSTAGRAM") && (
        <section
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ border: "1px solid rgba(23,122,65,0.2)", backgroundColor: "rgba(23,122,65,0.04)" }}
        >
          <PlatformIcon platform="INSTAGRAM" size={20} showBg />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>Connect Instagram</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>
              Link your Business or Creator account to pull real followers, posts, and analytics.
            </p>
          </div>
          <a href="/api/auth/instagram">
            <Button size="sm">Connect</Button>
          </a>
        </section>
      )}

      {/* Other platforms */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold" style={{ color: "var(--ink-primary)" }}>Add more platforms</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>Connect additional accounts to expand your reach</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AVAILABLE_PLATFORMS.map(({ platform, desc }) => (
            <div
              key={platform}
              className="flex items-center gap-3 rounded-2xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", opacity: 0.6 }}
            >
              <PlatformIcon platform={platform} size={16} showBg />
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
                  {platform.charAt(0) + platform.slice(1).toLowerCase()}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--ink-tertiary)" }}>{desc}</p>
              </div>
              <Badge variant="neutral" className="text-2xs ml-auto shrink-0">Soon</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Permissions note */}
      <div
        className="flex items-start gap-3 rounded-2xl p-4"
        style={{ border: "1px solid rgba(23,122,65,0.2)", backgroundColor: "rgba(23,122,65,0.05)" }}
      >
        <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--brand-500)" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--brand-500)" }}>Data security</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--ink-tertiary)" }}>
            We only request the minimum permissions needed to post on your behalf.
            Access tokens are encrypted at rest. You can revoke access at any time from Meta App settings.
          </p>
        </div>
      </div>
    </div>
  );
}
