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
  { id: "1", name: "Tech & SaaS",      tags: ["#SaaS", "#TechStartup", "#B2BSoftware", "#ProductHunt", "#IndieHackers", "#StartupLife", "#GrowthHacking"], platforms: ["Twitter", "LinkedIn"], useCount: 34, color: "#6172f3" },
  { id: "2", name: "Marketing",        tags: ["#DigitalMarketing", "#ContentMarketing", "#SocialMediaMarketing", "#MarketingTips", "#GrowthHacking", "#EmailMarketing"], platforms: ["LinkedIn", "Instagram"], useCount: 28, color: "#a855f7" },
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
    <motion.div layout className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left">
        <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${group.color}18`, border: `1px solid ${group.color}30` }}>
          <Hash className="h-4 w-4" style={{ color: group.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#f1f3f9]">{group.name}</span>
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-2xs text-[#4d5675]">{group.tags.length} tags</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {group.platforms.map((p) => (
              <span key={p} className="text-2xs" style={{ color: PLATFORM_COLORS[p] ?? "#8892aa" }}>{p}</span>
            ))}
            <span className="text-2xs text-[#4d5675]">· Used {group.useCount}×</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5 text-xs text-[#8892aa] hover:border-[rgba(255,255,255,0.15)] hover:text-[#f1f3f9] transition-all">
            {copied ? <Check className="h-3 w-3 text-[#10b981]" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy all"}
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#4d5675] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#f87171] transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <ChevronDown className={cn("h-4 w-4 text-[#4d5675] transition-transform", open && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex flex-wrap gap-1.5 pt-3">
                {group.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[#8892aa] hover:border-[rgba(255,255,255,0.15)] hover:text-[#f1f3f9] transition-colors cursor-pointer group">
                    {tag}
                    <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#4d5675]" />
                  </span>
                ))}
                <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-[rgba(255,255,255,0.12)] px-2.5 py-1 text-xs text-[#4d5675] hover:border-[rgba(97,114,243,0.4)] hover:text-[#818cf8] transition-colors">
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
      color: ["#6172f3","#a855f7","#f59e0b","#10b981"][prev.length % 4],
    }, ...prev]);
    setNewName(""); setNewTags(""); setShowNew(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.05)]">
        <div>
          <h1 className="text-lg font-semibold text-[#f1f3f9]">Hashtag Groups</h1>
          <p className="text-xs text-[#4d5675] mt-0.5">{groups.length} groups · Save and reuse your best hashtag sets</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          New group
        </Button>
      </div>

      <div className="px-6 py-3 border-b border-[rgba(255,255,255,0.04)]">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4d5675]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups or tags…"
            className="w-full h-8 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] pl-8 pr-3 text-xs text-[#f1f3f9] placeholder:text-[#4d5675] focus:outline-none focus:border-[rgba(97,114,243,0.5)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {/* New group form */}
        <AnimatePresence>
          {showNew && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-[rgba(97,114,243,0.3)] bg-[rgba(97,114,243,0.06)] p-4 space-y-3">
              <div className="text-sm font-semibold text-[#f1f3f9]">New hashtag group</div>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Group name (e.g. Tech & SaaS)"
                className="w-full h-9 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] px-3 text-sm text-[#f1f3f9] placeholder:text-[#4d5675] focus:outline-none focus:border-[rgba(97,114,243,0.5)]" />
              <textarea value={newTags} onChange={(e) => setNewTags(e.target.value)} rows={3}
                placeholder="#hashtag1 #hashtag2 hashtag3 (space or comma separated, # optional)"
                className="w-full rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] px-3 py-2.5 text-sm text-[#f1f3f9] placeholder:text-[#4d5675] focus:outline-none focus:border-[rgba(97,114,243,0.5)] resize-none" />
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
            <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <div className="text-lg font-bold bg-gradient-to-r from-[#6172f3] to-[#a855f7] bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-[#4d5675] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {filtered.map((group) => (
          <GroupCard key={group.id} group={group} onCopy={(g) => setCopiedGroup(g.id)} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.04)] mb-4">
              <Hash className="h-6 w-6 text-[#4d5675]" />
            </div>
            <p className="text-sm font-medium text-[#8892aa]">No hashtag groups yet</p>
            <p className="text-xs text-[#4d5675] mt-1">Create your first group to save and reuse hashtags</p>
          </div>
        )}
      </div>
    </div>
  );
}
