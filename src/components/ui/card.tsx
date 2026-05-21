import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "outlined" | "ghost";
  hover?: boolean;
  noPadding?: boolean;
}

function Card({ className, variant = "default", hover = false, noPadding = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        !noPadding && "p-5",
        {
          "card-base": variant === "default",
          "bg-[#111420] border border-[rgba(255,255,255,0.07)] shadow-[0_4px_16px_rgba(0,0,0,0.5)]": variant === "elevated",
          "glass rounded-2xl": variant === "glass",
          "border border-[rgba(255,255,255,0.08)] bg-transparent": variant === "outlined",
          "bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]": variant === "ghost",
        },
        hover && "cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-[#f1f3f9] tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[#8892aa]", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-[rgba(255,255,255,0.06)] mt-4", className)} {...props} />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
