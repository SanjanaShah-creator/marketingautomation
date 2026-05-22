import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "badge-brand",
        success:   "badge-success",
        warning:   "badge-warning",
        danger:    "badge-danger",
        info:      "badge-info",
        neutral:   "badge-neutral",
        outline:   "border border-[var(--border-strong)] text-[var(--ink-secondary)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-[#34d399]": variant === "success",
            "bg-[#fbbf24]": variant === "warning",
            "bg-[#f87171]": variant === "danger",
            "bg-[#60a5fa]": variant === "info",
            "bg-[#177A41]": variant === "default" || !variant,
            "bg-[#476B52]": variant === "neutral",
          })}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
