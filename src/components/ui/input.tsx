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
          <label htmlFor={inputId} className="text-xs font-medium text-[#8892aa]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4d5675]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-9 w-full rounded-[0.625rem] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f1f3f9]",
              "border border-[rgba(255,255,255,0.08)] placeholder:text-[#4d5675]",
              "transition-all duration-150",
              "hover:border-[rgba(255,255,255,0.14)]",
              "focus:border-[rgba(97,114,243,0.6)] focus:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-3 focus:ring-[rgba(97,114,243,0.12)]",
              "disabled:cursor-not-allowed disabled:opacity-40",
              error && "border-[rgba(239,68,68,0.5)] focus:border-[rgba(239,68,68,0.7)] focus:ring-[rgba(239,68,68,0.12)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d5675]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#f87171]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#4d5675]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
