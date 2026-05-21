"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, RefreshCw, ExternalLink, AlertCircle,
  CheckCircle2, XCircle, Link2, Shield, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";
import type { SocialPlatform } from "@/types";

// ── Types & data ───────────────────────────────────────────────────────────

interface ConnectedAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  displayName: string;
  avatar?: string;
  followers: number;
  following: number;
  posts: number;
  isActive: boolean;
  lastSync: Date;
  expiresAt?: Date;
}

const CONNECTED: ConnectedAccount[] = [
  { id: "a1", platform: "TWITTER",   handle: "@socialsync",     displayName: "SocialSync", followers: 4821,  following: 342, posts: 1240, isActive: true,  lastSync: new Date(Date.now() - 5 * 60000) },
  { id: "a2", platform: "INSTAGRAM", handle: "@socialsync.app", displayName: "SocialSync", followers: 12300, following: 890, posts: 387,  isActive: true,  lastSync: new Date(Date.now() - 12 * 60000) },
  { id: "a3", platform: "LINKEDIN",  handle: "SocialSync",      displayName: "SocialSync", followers: 2940,  following: 145, posts: 92,   isActive: false, lastSync: new Date(Date.now() - 3 * 3600000), expiresAt: new Date(Date.now() - 24 * 3600000) },
];

const AVAILABLE_PLATFORMS: { platform: SocialPlatform; desc: string; available: boolean }[] = [
  { platform: "FACEBOOK",  desc: "Pages & personal profiles", available: true },
  { platform: "TIKTOK",    desc: "Short-form video content",  available: true },
  { platform: "YOUTUBE",   desc: "Long-form video & shorts",  available: true },
  { platform: "THREADS",   desc: "Microblogging by Meta",     available: true },
  { platform: "PINTEREST", desc: "Visual discovery & pins",   available: false },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function AccountCard({ account, onRefresh, onDisconnect }: {
  account: ConnectedAccount;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isExpired = account.expiresAt && account.expiresAt < new Date();

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
    onRefresh(account.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card-base p-5 relative",
        !account.isActive && "opacity-80"
      )}
    >
      {/* Status strip */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl",
        account.isActive && !isExpired ? "bg-gradient-to-r from-[#10b981] to-[#059669]" : "bg-gradient-to-r from-[#ef4444] to-[#dc2626]"
      )} />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Platform icon */}
          <PlatformIcon platform={account.platform} size={18} showBg />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#f1f3f9]">{account.displayName}</span>
              <span className="text-xs text-[#4d5675]">{account.handle}</span>
              {account.isActive && !isExpired ? (
                <span className="flex items-center gap-1 text-2xs text-[#34d399]">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-2xs text-[#f87171]">
                  <XCircle className="h-3 w-3" />
                  {isExpired ? "Token expired" : "Disconnected"}
                </span>
              )}
            </div>
            <p className="text-2xs text-[#4d5675] mt-0.5">
              Last synced {formatRelativeTime(account.lastSync)}
            </p>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#4d5675] hover:text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] transition-all"
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
                  className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111420] shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden"
                >
                  <div className="p-1 space-y-0.5">
                    <button onClick={() => { handleRefresh(); setMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#8892aa] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f1f3f9] transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Refresh token
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#8892aa] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f1f3f9] transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View profile
                    </button>
                    <div className="my-1 h-px bg-[rgba(255,255,255,0.06)]" />
                    <button
                      onClick={() => { onDisconnect(account.id); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
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

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Followers", value: formatNumber(account.followers) },
          { label: "Following", value: formatNumber(account.following) },
          { label: "Posts",     value: formatNumber(account.posts) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] p-2.5 text-center">
            <div className="text-sm font-bold text-[#f1f3f9]">{s.value}</div>
            <div className="text-2xs text-[#4d5675]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reconnect banner */}
      {(!account.isActive || isExpired) && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] p-3">
          <AlertCircle className="h-4 w-4 text-[#f87171] shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-[#f87171]">
              {isExpired ? "Access token expired" : "Account disconnected"}
            </p>
            <p className="text-2xs text-[#4d5675]">Reconnect to continue posting</p>
          </div>
          <Button size="xs" variant="destructive">Reconnect</Button>
        </div>
      )}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(CONNECTED);
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  function handleRefresh(id: string) {
    setAccounts((prev) =>
      prev.map((a) => a.id === id ? { ...a, isActive: true, lastSync: new Date() } : a)
    );
  }

  async function handleConnect(platform: SocialPlatform) {
    setConnecting(platform);
    await new Promise((r) => setTimeout(r, 1500));
    setConnecting(null);
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Connected section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#f1f3f9]">Connected accounts</h2>
            <p className="text-xs text-[#4d5675]">{accounts.length} of 10 account slots used</p>
          </div>
          {/* Slot indicator */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#6172f3] to-[#a855f7]" style={{ width: `${(accounts.length / 10) * 100}%` }} />
            </div>
            <span className="text-xs text-[#4d5675]">{accounts.length}/10</span>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] py-16">
            <Link2 className="h-10 w-10 text-[#2e3554] mb-3" />
            <p className="text-sm font-medium text-[#4d5675]">No accounts connected</p>
            <p className="text-xs text-[#2e3554] mt-1 mb-4">Connect your social profiles to start scheduling</p>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Connect first account</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onRefresh={handleRefresh}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </section>

      {/* Available platforms */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#f1f3f9]">Add more platforms</h2>
          <p className="text-xs text-[#4d5675]">Connect additional accounts to expand your reach</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_PLATFORMS.map(({ platform, desc, available }) => (
            <button
              key={platform}
              disabled={!available || connecting === platform}
              onClick={() => handleConnect(platform)}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150",
                available
                  ? "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(97,114,243,0.3)] hover:bg-[rgba(97,114,243,0.05)] cursor-pointer"
                  : "border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] cursor-not-allowed opacity-50"
              )}
            >
              <PlatformIcon platform={platform} size={18} showBg />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f1f3f9]">{platform.charAt(0) + platform.slice(1).toLowerCase()}</p>
                <p className="text-xs text-[#4d5675] truncate">{desc}</p>
              </div>
              {connecting === platform ? (
                <div className="h-4 w-4 rounded-full border-2 border-[#6172f3] border-t-transparent animate-spin shrink-0" />
              ) : available ? (
                <Plus className="h-4 w-4 text-[#4d5675] shrink-0" />
              ) : (
                <Badge variant="neutral" className="text-2xs shrink-0">Soon</Badge>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Permissions note */}
      <div className="flex items-start gap-3 rounded-2xl border border-[rgba(97,114,243,0.15)] bg-[rgba(97,114,243,0.06)] p-4">
        <Shield className="h-4 w-4 text-[#818cf8] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-[#818cf8]">Data security</p>
          <p className="text-xs text-[#4d5675] mt-0.5 leading-relaxed">
            We only request the minimum permissions needed to post on your behalf.
            Access tokens are encrypted at rest. You can revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
