"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ShieldCheck, Info, Flame } from "lucide-react";

export type SeverityLevel = "critical" | "high" | "medium" | "info" | "safe";

export interface SeverityChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity: SeverityLevel;
  showIcon?: boolean;
  label?: string;
}

export function SeverityChip({
  severity,
  showIcon = true,
  label,
  className,
  ...props
}: SeverityChipProps) {
  const configs: Record<
    SeverityLevel,
    { text: string; bg: string; border: string; color: string; icon: React.ReactNode }
  > = {
    critical: {
      text: label || "Critical Threat",
      bg: "bg-[var(--risk-critical-bg)]",
      border: "border-[var(--risk-critical-border)]",
      color: "text-[var(--risk-critical)]",
      icon: <Flame className="w-3 h-3 text-[var(--risk-critical)] shrink-0" />,
    },
    high: {
      text: label || "High Threat",
      bg: "bg-[var(--risk-high-bg)]",
      border: "border-[var(--risk-high-border)]",
      color: "text-[var(--risk-high)]",
      icon: <AlertCircle className="w-3 h-3 text-[var(--risk-high)] shrink-0" />,
    },
    medium: {
      text: label || "Medium Alert",
      bg: "bg-[var(--risk-med-bg)]",
      border: "border-[var(--risk-med-border)]",
      color: "text-[var(--risk-med)]",
      icon: <AlertTriangle className="w-3 h-3 text-[var(--risk-med)] shrink-0" />,
    },
    info: {
      text: label || "Info Flag",
      bg: "bg-[var(--accent-subtle)]",
      border: "border-[var(--accent-border)]",
      color: "text-[var(--accent)]",
      icon: <Info className="w-3 h-3 text-[var(--accent)] shrink-0" />,
    },
    safe: {
      text: label || "Verified Benign",
      bg: "bg-[var(--risk-low-bg)]",
      border: "border-[var(--risk-low-border)]",
      color: "text-[var(--risk-low)]",
      icon: <ShieldCheck className="w-3 h-3 text-[var(--risk-low)] shrink-0" />,
    },
  };

  const current = configs[severity] || configs.info;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md border tracking-wide uppercase",
        current.bg,
        current.border,
        current.color,
        className
      )}
      {...props}
    >
      {showIcon && current.icon}
      <span>{current.text}</span>
    </span>
  );
}

