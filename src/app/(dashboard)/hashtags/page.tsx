"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Hash, Copy, Trash2, Search, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HashtagGroup {
  id: string;
  name: string;
  tags: string[];
  platforms: string[];
  useCount: number;
  color: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Twitter: "#1da1f2", Instagram: "#e1306c", LinkedIn: "#0a66c2", Facebook: "#1877f2",
};

const mockGroups: HashtagGroup[] = [
  { id: "1", name: "Tech & SaaS",      tags: ["#SaaS", "#TechStartup", "#B2BSoftware", "#ProductHunt", "#IndieHackers", "#StartupLife", "#GrowthHacking"], platforms: ["Twitter", "LinkedIn"], useCount: 34, color: "#177A41" },
  { id: "2", name: "Marketing",        tags: ["#DigitalMarketing", "#ContentMarketing", "#SocialMediaMarketing", "#MarketingTips", "#GrowthHacking", "#EmailMarketing"], platforms: ["LinkedIn", "Instagram"], useCount: 28, color: "#0F5E31" },
  { id: "3", name: "Motivational",     tags: ["#Motivation", "#Entrepreneurship", "#Mindset", "#Success", "#Hustle", "#BuildInPublic", "#Startup"], platforms: ["Instagram", "Twitter"], useCount: 19, color: "#f59e0b" },
  { id: "4", name: "AI & Automation",  tags: ["#AI", "#MachineLearning", "#Automation", "#ChatGPT", "#ArtificialIntelligence", "#NoCode", "#FutureOfWork"], platforms: ["Twitter", "LinkedIn", "Instagram"], useCount: 42, color: "#10b981" },
];

function GroupCard({ group, onCopy }: { group: HashtagGroup; onCopy: (g: HashtagGroup) => void }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(group.tags.join(" "));
    setCopied(true);
    onCopy(group);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div layout className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left transition-colors"
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}>
        <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${group.color}15`, border: `1px solid ${group.color}30` }}>
          <Hash className="h-4 w-4" style={{ color: group.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>{group.name}</span>
            <span className="rounded-full px-2 py-0.5 text-2xs" style={{ backgroundColor: "var(--surface-100)", color: "var(--ink-tertiary)" }}>
              {group.tags.length} tags
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {group.platforms.map((p) => (
              <span key={p} className="text-2xs" style={{ color: PLATFORM_COLORS[p] ?? "var(--ink-tertiary)" }}>{p}</span>
            ))}
            <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>· Used {group.useCount}×</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all"
            style={{ border: "1px solid var(--border-strong)", backgroundColor: "var(--surface-50)", color: "var(--ink-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}>
            {copied ? <Check className="h-3 w-3" style={{ color: "var(--success)" }} /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy all"}
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--ink-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.08)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} style={{ color: "var(--ink-muted)" }} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex flex-wrap gap-1.5 pt-3">
                {group.tags.map((tag) => (
                  <span key={tag}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs cursor-pointer transition-colors group"
                    style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border)", color: "var(--ink-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-secondary)"; }}>
                    {tag}
                    <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ink-muted)" }} />
                  </span>
                ))}
                <button
                  className="inline-flex items-center gap-1 rounded-full border-dashed px-2.5 py-1 text-xs transition-colors"
                  style={{ border: "1px dashed var(--border-strong)", color: "var(--ink-tertiary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(23,122,65,0.4)"; e.currentTarget.style.color = "var(--brand-500)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
                  <Plus className="h-3 w-3" /> Add tag
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HashtagsPage() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState(mockGroups);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTags, setNewTags] = useState("");
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const filtered = groups.filter((g) =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function createGroup() {
    if (!newName.trim()) return;
    const tags = newTags.split(/[\s,]+/).filter((t) => t).map((t) => t.startsWith("#") ? t : `#${t}`);
    setGroups((prev) => [{
      id: Date.now().toString(), name: newName.trim(), tags, platforms: ["Instagram"], useCount: 0,
      color: ["#177A41", "#0F5E31", "#f59e0b", "#10b981"][prev.length % 4],
    }, ...prev]);
    setNewName(""); setNewTags(""); setShowNew(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>Hashtag Groups</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{groups.length} groups · Save and reuse your best hashtag sets</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          New group
        </Button>
      </div>

      <div className="px-6 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--ink-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups or tags…"
            className="w-full h-8 rounded-lg pl-8 pr-3 text-xs focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface-50)",
              border: "1px solid var(--border-strong)",
              color: "var(--ink-primary)",
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {/* New group form */}
        <AnimatePresence>
          {showNew && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl p-4 space-y-3"
              style={{ border: "1px solid rgba(23,122,65,0.3)", backgroundColor: "rgba(23,122,65,0.05)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>New hashtag group</div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Group name (e.g. Tech & SaaS)"
                className="w-full h-9 rounded-xl px-3 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border-strong)", color: "var(--ink-primary)" }}
              />
              <textarea
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                rows={3}
                placeholder="#hashtag1 #hashtag2 hashtag3 (space or comma separated, # optional)"
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ backgroundColor: "var(--surface-50)", border: "1px solid var(--border-strong)", color: "var(--ink-primary)" }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={createGroup}>Create group</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[
            { label: "Total groups", value: groups.length.toString() },
            { label: "Total tags",   value: groups.reduce((s, g) => s + g.tags.length, 0).toString() },
            { label: "Times used",   value: groups.reduce((s, g) => s + g.useCount, 0).toString() },
          ].map((s) => (
            <div key={s.label} className="rounded-xl px-4 py-3" style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}>
              <div className="text-lg font-bold" style={{ color: "var(--brand-500)" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {filtered.map((group) => (
          <GroupCard key={group.id} group={group} onCopy={(g) => setCopiedGroup(g.id)} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
              style={{ backgroundColor: "var(--surface-100)" }}>
              <Hash className="h-6 w-6" style={{ color: "var(--ink-muted)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>No hashtag groups yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>Create your first group to save and reuse hashtags</p>
          </div>
        )}
      </div>
    </div>
  );
}
