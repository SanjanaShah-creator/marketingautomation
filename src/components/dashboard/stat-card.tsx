"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  suffix?: string;
  className?: string;
  sparkline?: number[];
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#177A41"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  iconColor = "#818cf8",
  iconBg = "rgba(97,114,243,0.12)",
  suffix,
  className,
  sparkline,
}: StatCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value;
  const isPositive = (delta ?? 0) > 0;
  const isNegative = (delta ?? 0) < 0;

  return (
    <div className={cn("card-base p-5 relative overflow-hidden group", className)}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(97,114,243,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg }}>
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        {sparkline && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <MiniSparkline data={sparkline} />
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <p className="text-2xs font-medium uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>{label}</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold tracking-tight leading-none" style={{ color: "var(--ink-primary)" }}>
            {displayValue}
            {suffix && <span className="text-base font-medium ml-0.5" style={{ color: "var(--ink-secondary)" }}>{suffix}</span>}
          </p>
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-1 pt-0.5">
            <span className="text-xs font-medium" style={{ color: isPositive ? "var(--success)" : isNegative ? "var(--danger)" : "var(--ink-secondary)" }}>
              {isPositive ? "+" : ""}{delta}%
            </span>
            <span className="text-2xs" style={{ color: "var(--ink-tertiary)" }}>vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
