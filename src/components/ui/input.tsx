"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, label, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }}>
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-[0.625rem] px-3 py-2 text-sm",
              "border transition-all duration-150",
              "placeholder:text-[var(--ink-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[rgba(23,122,65,0.35)] focus:border-[rgba(23,122,65,0.6)]",
              "disabled:cursor-not-allowed disabled:opacity-40",
              error && "border-[rgba(155,28,28,0.5)] focus:border-[rgba(155,28,28,0.7)] focus:ring-[rgba(155,28,28,0.15)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            style={{ backgroundColor: "var(--card)", borderColor: error ? undefined : "var(--border-strong)", color: "var(--ink-primary)" }}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        {hint && !error && <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
