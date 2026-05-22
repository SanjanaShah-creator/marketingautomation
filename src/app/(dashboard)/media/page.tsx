"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Video, FileText, Search, Grid3X3, List, Trash2, Download, Copy, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaType = "all" | "image" | "video" | "document";

const mockMedia = [
  { id: "1", name: "hero-banner.jpg",       type: "image",    size: "2.4 MB", dims: "1920×1080", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&auto=format&q=80", createdAt: "2 hours ago" },
  { id: "2", name: "product-shot-1.jpg",    type: "image",    size: "1.1 MB", dims: "1200×800",  url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format&q=80", createdAt: "Yesterday" },
  { id: "3", name: "brand-video-thumb.mp4", type: "video",    size: "24 MB",  dims: "1920×1080", url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format&q=80", createdAt: "3 days ago" },
  { id: "4", name: "team-photo.jpg",        type: "image",    size: "3.2 MB", dims: "2400×1600", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&auto=format&q=80", createdAt: "1 week ago" },
  { id: "5", name: "product-shot-2.jpg",    type: "image",    size: "980 KB", dims: "1200×900",  url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&auto=format&q=80", createdAt: "1 week ago" },
  { id: "6", name: "campaign-brief.pdf",    type: "document", size: "450 KB", dims: "—",         url: "", createdAt: "2 weeks ago" },
  { id: "7", name: "logo-dark.png",         type: "image",    size: "220 KB", dims: "800×800",   url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&auto=format&q=80", createdAt: "1 month ago" },
  { id: "8", name: "reel-draft.mp4",        type: "video",    size: "56 MB",  dims: "1080×1920", url: "https://images.unsplash.com/photo-1536240478700-b869ad10e2c8?w=300&h=400&fit=crop&auto=format&q=80", createdAt: "1 month ago" },
];

const TYPE_ICON: Record<string, React.FC<{ className?: string }>> = {
  image: ImageIcon, video: Video, document: FileText,
};

export default function MediaPage() {
  const [activeType, setActiveType] = useState<MediaType>("all");
  const [view, setView]             = useState<"grid" | "list">("grid");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [dragOver, setDragOver]     = useState(false);

  const filtered = mockMedia.filter((m) => {
    if (activeType !== "all" && m.type !== activeType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const tabs: { key: MediaType; label: string; count: number }[] = [
    { key: "all",      label: "All",       count: mockMedia.length },
    { key: "image",    label: "Images",    count: mockMedia.filter((m) => m.type === "image").length },
    { key: "video",    label: "Videos",    count: mockMedia.filter((m) => m.type === "video").length },
    { key: "document", label: "Documents", count: mockMedia.filter((m) => m.type === "document").length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>Media Library</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{mockMedia.length} files · 89 MB used</p>
        </div>
        <Button size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>
          Upload files
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 flex-wrap" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Type tabs */}
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--surface-100)" }}>
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveType(key)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: activeType === key ? "var(--card)" : "transparent",
                color: activeType === key ? "var(--ink-primary)" : "var(--ink-tertiary)",
                boxShadow: activeType === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}>
              {label}
              <span
                className="rounded-full px-1.5 py-0.5 text-2xs"
                style={{
                  backgroundColor: activeType === key ? "rgba(23,122,65,0.12)" : "var(--surface-100)",
                  color: activeType === key ? "var(--brand-500)" : "var(--ink-tertiary)",
                }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--ink-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files…"
            className="w-full h-8 rounded-lg pl-8 pr-3 text-xs focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface-50)",
              border: "1px solid var(--border-strong)",
              color: "var(--ink-primary)",
            }}
          />
        </div>

        <div className="flex-1" />

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--ink-secondary)" }}>{selected.size} selected</span>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--ink-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(155,28,28,0.08)"; e.currentTarget.style.color = "var(--danger)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = "var(--ink-tertiary)"; }}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-lg p-1" style={{ backgroundColor: "var(--surface-100)" }}>
          {([["grid", Grid3X3], ["list", List]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className="flex h-6 w-6 items-center justify-center rounded-md transition-all"
              style={{
                backgroundColor: view === v ? "var(--card)" : "transparent",
                color: view === v ? "var(--ink-primary)" : "var(--ink-tertiary)",
                boxShadow: view === v ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}>
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className="mb-5 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 transition-all cursor-pointer"
          style={{
            borderColor: dragOver ? "rgba(23,122,65,0.5)" : "var(--border-strong)",
            backgroundColor: dragOver ? "rgba(23,122,65,0.04)" : "transparent",
          }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(23,122,65,0.1)" }}>
            <Upload className="h-5 w-5" style={{ color: "var(--brand-500)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>
              Drop files here or{" "}
              <span style={{ color: "var(--brand-500)" }}>browse</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>PNG, JPG, GIF, MP4, PDF up to 100 MB</p>
          </div>
        </div>

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((file, i) => {
              const Icon = TYPE_ICON[file.type];
              const isSelected = selected.has(file.id);
              return (
                <motion.div key={file.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }} onClick={() => toggleSelect(file.id)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    border: isSelected ? "2px solid var(--brand-500)" : "1px solid var(--border)",
                    boxShadow: isSelected ? "0 0 0 3px rgba(23,122,65,0.15)" : "none",
                  }}>
                  {/* Preview */}
                  <div className="aspect-square relative" style={{ backgroundColor: "var(--surface-50)" }}>
                    {file.url ? (
                      <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span style={{ color: "var(--ink-muted)" }}><Icon className="h-8 w-8" /></span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 left-2 h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--brand-500)" }}>
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {file.type === "video" && (
                      <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-2xs text-white font-mono">VIDEO</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-2.5" style={{ backgroundColor: "var(--card)" }}>
                    <p className="text-xs font-medium truncate" style={{ color: "var(--ink-primary)" }}>{file.name}</p>
                    <p className="text-2xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{file.size} · {file.createdAt}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* List view */}
        {view === "list" && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2.5 text-2xs font-medium uppercase tracking-wider"
              style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-50)", color: "var(--ink-tertiary)" }}>
              <span />
              <span>Name</span>
              <span>Size</span>
              <span>Dimensions</span>
              <span>Added</span>
            </div>
            {filtered.map((file, i) => {
              const Icon = TYPE_ICON[file.type];
              return (
                <div key={file.id} onClick={() => toggleSelect(file.id)}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selected.has(file.id) ? "rgba(23,122,65,0.05)" : "transparent",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                  onMouseEnter={(e) => { if (!selected.has(file.id)) e.currentTarget.style.backgroundColor = "var(--surface-50)"; }}
                  onMouseLeave={(e) => { if (!selected.has(file.id)) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "var(--surface-100)" }}>
                    {file.url ? <img src={file.url} alt="" className="h-full w-full object-cover" /> : <span style={{ color: "var(--ink-muted)" }}><Icon className="h-4 w-4" /></span>}
                  </div>
                  <span className="text-sm truncate" style={{ color: "var(--ink-primary)" }}>{file.name}</span>
                  <span className="text-xs tabular-nums" style={{ color: "var(--ink-tertiary)" }}>{file.size}</span>
                  <span className="text-xs tabular-nums" style={{ color: "var(--ink-tertiary)" }}>{file.dims}</span>
                  <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>{file.createdAt}</span>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
              style={{ backgroundColor: "var(--surface-100)" }}>
              <Filter className="h-6 w-6" style={{ color: "var(--ink-muted)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>No files found</p>
            <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
