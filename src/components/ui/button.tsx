"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(97,114,243,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090e] disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#6172f3] to-[#5662e8] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] hover:from-[#6e7ef5] hover:to-[#6172f3] hover:shadow-[0_4px_12px_rgba(97,114,243,0.4)] hover:-translate-y-px active:translate-y-0 active:shadow-none",
        secondary:
          "bg-[rgba(255,255,255,0.06)] text-[#f1f3f9] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.14)]",
        outline:
          "border border-[rgba(255,255,255,0.1)] text-[#8892aa] hover:text-[#f1f3f9] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.04)]",
        ghost:
          "text-[#8892aa] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f1f3f9]",
        destructive:
          "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)] hover:bg-[rgba(239,68,68,0.25)]",
        success:
          "bg-[rgba(16,185,129,0.15)] text-[#34d399] border border-[rgba(16,185,129,0.25)] hover:bg-[rgba(16,185,129,0.25)]",
        brand:
          "bg-gradient-to-br from-[#6172f3] via-[#7c4dff] to-[#a855f7] text-white shadow-[0_0_20px_rgba(97,114,243,0.3)] hover:shadow-[0_0_32px_rgba(97,114,243,0.5)] hover:-translate-y-px",
        link: "text-[#818cf8] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:  "h-7 rounded-lg px-2.5 text-xs",
        sm:  "h-8 rounded-lg px-3 text-sm",
        default: "h-9 rounded-[0.625rem] px-4 text-sm",
        lg:  "h-10 rounded-xl px-5 text-base",
        xl:  "h-12 rounded-xl px-6 text-base",
        icon:   "h-9 w-9 rounded-[0.625rem]",
        "icon-sm": "h-7 w-7 rounded-lg",
        "icon-lg": "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
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
