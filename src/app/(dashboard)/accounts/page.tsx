"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, RefreshCw, ExternalLink, AlertCircle,
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

const AVAILABLE_PLATFORMS: { platform: SocialPlatform; desc: string }[] = [
  { platform: "FACEBOOK",  desc: "Pages & personal profiles" },
  { platform: "TIKTOK",    desc: "Short-form video content" },
  { platform: "YOUTUBE",   desc: "Long-form video & shorts" },
  { platform: "THREADS",   desc: "Microblogging by Meta" },
  { platform: "PINTEREST", desc: "Visual discovery & pins" },
];

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  instagram_denied: "Instagram connection was cancelled.",
  instagram_failed: "Instagram connection failed — check your Meta App settings.",
  invalid_state: "Security check failed. Please try again.",
};

// ── OAuthResultHandler ─────────────────────────────────────────────────────
// Must be wrapped in <Suspense> because useSearchParams() throws during prerender

function OAuthResultHandler({
  onResult,
}: {
  onResult: (connected: string | null, error: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected || error) {
      handled.current = true;
      onResult(connected, error);
      const url = new URL(window.location.href);
      url.searchParams.delete("connected");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, onResult]);

  return null;
}

// ── AccountCard ────────────────────────────────────────────────────────────

function AccountCard({
  account,
  onRefresh,
  onDisconnect,
}: {
  account: ConnectedAccount;
  onRefresh: () => void;
  onDisconnect: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isExpired = account.tokenExpiresAt
    ? new Date(account.tokenExpiresAt) < new Date()
    : false;
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
      className="rounded-2xl p-5 relative"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Status strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{
          background: isHealthy
            ? "linear-gradient(90deg, var(--success), var(--brand-500))"
            : "linear-gradient(90deg, var(--danger), #c0392b)",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <PlatformIcon platform={account.platform} size={18} showBg />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
                {account.displayName}
              </span>
              <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                {account.handle}
              </span>
              {isHealthy ? (
                <span className="flex items-center gap-1 text-2xs font-medium" style={{ color: "var(--success)" }}>
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-2xs font-medium" style={{ color: "var(--danger)" }}>
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

        {/* Kebab menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-100)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
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
                    {[
                      { icon: refreshing ? Loader2 : RefreshCw, label: "Refresh token", onClick: handleRefresh, spin: refreshing },
                      { icon: ExternalLink, label: "View profile", onClick: () => setMenuOpen(false) },
                    ].map(({ icon: Icon, label, onClick, spin }) => (
                      <button key={label} onClick={onClick}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors"
                        style={{ color: "var(--ink-secondary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-secondary)"; }}>
                        <Icon className={`h-3.5 w-3.5 ${spin ? "animate-spin" : ""}`} />
                        {label}
                      </button>
                    ))}
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
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { label: "Followers", value: formatNumber(account.followers) },
          { label: "Following", value: formatNumber(account.following) },
          { label: "Posts",     value: formatNumber(account.posts) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2.5 text-center"
            style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border)" }}
          >
            <div className="text-sm font-bold" style={{ color: "var(--ink-primary)" }}>{s.value}</div>
            <div className="text-2xs mt-0.5" style={{ color: "var(--ink-secondary)" }}>{s.label}</div>
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
            <p className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
              {isExpired ? "Access token expired" : "Account disconnected"}
            </p>
            <p className="text-2xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>
              Reconnect to continue posting
            </p>
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

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleOAuthResult = useCallback(
    (connected: string | null, error: string | null) => {
      if (connected) {
        setToast({
          type: "success",
          msg: `${connected.charAt(0).toUpperCase() + connected.slice(1)} connected!`,
        });
        loadAccounts();
      } else if (error) {
        setToast({ type: "error", msg: OAUTH_ERROR_MESSAGES[error] ?? "Connection failed." });
      }
    },
    [loadAccounts]
  );

  async function handleDisconnect(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
  }

  const hasInstagram = accounts.some((a) => a.platform === "INSTAGRAM");

  return (
    <div className="max-w-4xl space-y-8">
      {/* Reads ?connected=instagram or ?error=... from URL — must be in Suspense */}
      <Suspense fallback={null}>
        <OAuthResultHandler onResult={handleOAuthResult} />
      </Suspense>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
            style={{
              backgroundColor: toast.type === "success" ? "var(--success)" : "var(--danger)",
              color: "#fff",
              maxWidth: "340px",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Connected accounts ── */}
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
            <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-100)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((accounts.length / MAX_SLOTS) * 100, 100)}%`,
                  background: "linear-gradient(90deg, var(--brand-500), var(--brand-600))",
                }}
              />
            </div>
            <span className="text-xs tabular-nums" style={{ color: "var(--ink-tertiary)" }}>
              {accounts.length}/{MAX_SLOTS}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: "var(--surface-100)" }} />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-28 rounded" style={{ backgroundColor: "var(--surface-100)" }} />
                    <div className="h-2.5 w-20 rounded" style={{ backgroundColor: "var(--surface-50)" }} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 rounded-xl" style={{ backgroundColor: "var(--surface-50)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-50)" }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
              style={{ backgroundColor: "var(--surface-100)" }}
            >
              <Link2 className="h-6 w-6" style={{ color: "var(--ink-tertiary)" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
              No accounts connected
            </p>
            <p className="text-xs mt-1 mb-5" style={{ color: "var(--ink-secondary)" }}>
              Connect your social profiles to start scheduling
            </p>
            <a href="/api/auth/instagram">
              <Button size="sm">Connect Instagram</Button>
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

      {/* ── Connect Instagram CTA (when not yet connected) ── */}
      {!loading && !hasInstagram && (
        <section
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ border: "1px solid rgba(23,122,65,0.25)", backgroundColor: "rgba(23,122,65,0.04)" }}
        >
          <PlatformIcon platform="INSTAGRAM" size={20} showBg />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
              Connect Instagram
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-secondary)" }}>
              Link your Business or Creator account to see real followers, posts, and analytics.
            </p>
          </div>
          <a href="/api/auth/instagram">
            <Button size="sm">Connect</Button>
          </a>
        </section>
      )}

      {/* ── More platforms (coming soon) ── */}
      <section>
        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--ink-primary)" }}>
          Add more platforms
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--ink-secondary)" }}>
          More integrations coming soon
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {AVAILABLE_PLATFORMS.map(({ platform, desc }) => (
            <div
              key={platform}
              className="flex items-center gap-3 rounded-xl border p-3.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-50)" }}
            >
              <PlatformIcon platform={platform} size={16} showBg />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>
                  {platform.charAt(0) + platform.slice(1).toLowerCase()}
                </p>
                <p className="text-2xs truncate" style={{ color: "var(--ink-tertiary)" }}>{desc}</p>
              </div>
              <Badge variant="neutral" className="text-2xs shrink-0">Soon</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security note ── */}
      <div
        className="flex items-start gap-3 rounded-2xl p-4"
        style={{ border: "1px solid rgba(23,122,65,0.2)", backgroundColor: "rgba(23,122,65,0.04)" }}
      >
        <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--brand-500)" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--brand-600)" }}>Data security</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
            We only request the minimum permissions needed to post on your behalf.
            Access tokens are encrypted at rest. Revoke access any time from Meta App settings.
          </p>
        </div>
      </div>
    </div>
  );
}
