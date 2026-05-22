"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(23,122,65,0.5)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#177A41] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:bg-[#0F5E31] hover:shadow-[0_4px_12px_rgba(23,122,65,0.3)] hover:-translate-y-px active:translate-y-0 active:shadow-none",
        secondary:
          "bg-[var(--surface-100)] text-[var(--ink-primary)] border border-[var(--border)] hover:bg-[var(--surface-150)] hover:border-[var(--border-strong)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-50)]",
        ghost:
          "text-[var(--ink-secondary)] hover:bg-[var(--surface-100)] hover:text-[var(--ink-primary)]",
        destructive:
          "bg-[rgba(155,28,28,0.08)] text-[#9B1C1C] border border-[rgba(155,28,28,0.2)] hover:bg-[rgba(155,28,28,0.14)]",
        success:
          "bg-[rgba(22,101,52,0.08)] text-[#166534] border border-[rgba(22,101,52,0.2)] hover:bg-[rgba(22,101,52,0.14)]",
        brand:
          "bg-gradient-to-br from-[#177A41] to-[#0F5E31] text-white shadow-[0_0_20px_rgba(23,122,65,0.2)] hover:shadow-[0_0_32px_rgba(23,122,65,0.35)] hover:-translate-y-px",
        link: "text-[#177A41] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:       "h-7 rounded-lg px-2.5 text-xs",
        sm:       "h-9 rounded-lg px-3 text-sm",
        default:  "h-10 rounded-[0.625rem] px-4 text-sm",
        lg:       "h-11 rounded-xl px-5 text-base",
        xl:       "h-12 rounded-xl px-6 text-base",
        icon:     "h-10 w-10 rounded-[0.625rem]",
        "icon-sm":"h-7 w-7 rounded-lg",
        "icon-lg":"h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
