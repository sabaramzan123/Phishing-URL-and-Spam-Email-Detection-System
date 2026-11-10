"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "low" | "medium" | "high" | "critical" | "safe" | "suspicious";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral:
      "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)]",
    accent:
      "bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] border-[var(--accent-primary-border)] font-medium",
    low: "bg-[var(--risk-safe-bg)] text-[var(--risk-safe)] border-[var(--risk-safe-border)] font-semibold",
    safe: "bg-[var(--risk-safe-bg)] text-[var(--risk-safe)] border-[var(--risk-safe-border)] font-semibold",
    medium:
      "bg-[var(--risk-suspicious-bg)] text-[var(--risk-suspicious)] border-[var(--risk-suspicious-border)] font-semibold",
    suspicious:
      "bg-[var(--risk-suspicious-bg)] text-[var(--risk-suspicious)] border-[var(--risk-suspicious-border)] font-semibold",
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
        "inline-flex items-center justify-center font-medium rounded-[4px] border uppercase tracking-wider",
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
