"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "low" | "medium" | "high" | "critical";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "neutral", size = "sm", children, ...props }: BadgeProps) {
  const variantStyles = {
    neutral:
      "bg-[var(--surface-3)] text-[var(--text-2)] border-[var(--border)]",
    accent:
      "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)] font-semibold",
    low: "bg-[var(--risk-low-bg)] text-[var(--risk-low)] border-[var(--risk-low-border)] font-semibold",
    medium:
      "bg-[var(--risk-med-bg)] text-[var(--risk-med)] border-[var(--risk-med-border)] font-semibold",
    high: "bg-[var(--risk-high-bg)] text-[var(--risk-high)] border-[var(--risk-high-border)] font-semibold",
    critical:
      "bg-[var(--risk-critical-bg)] text-[var(--risk-critical)] border-[var(--risk-critical-border)] font-semibold",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md border tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

