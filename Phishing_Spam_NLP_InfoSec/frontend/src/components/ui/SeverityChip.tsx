"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ShieldCheck, Info } from "lucide-react";

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
      text: label || "Critical",
      bg: "bg-[var(--risk-critical-bg)]",
      border: "border-[var(--risk-critical-border)]",
      color: "text-[var(--risk-critical)]",
      icon: <AlertCircle className="w-3.5 h-3.5 text-[var(--risk-critical)] shrink-0" />,
    },
    high: {
      text: label || "High Risk",
      bg: "bg-[var(--risk-high-bg)]",
      border: "border-[var(--risk-high-border)]",
      color: "text-[var(--risk-high)]",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-high)] shrink-0" />,
    },
    medium: {
      text: label || "Suspicious",
      bg: "bg-[var(--risk-suspicious-bg)]",
      border: "border-[var(--risk-suspicious-border)]",
      color: "text-[var(--risk-suspicious)]",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-suspicious)] shrink-0" />,
    },
    info: {
      text: label || "Note",
      bg: "bg-[var(--bg-subtle)]",
      border: "border-[var(--border)]",
      color: "text-[var(--text-secondary)]",
      icon: <Info className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />,
    },
    safe: {
      text: label || "Safe",
      bg: "bg-[var(--risk-safe-bg)]",
      border: "border-[var(--risk-safe-border)]",
      color: "text-[var(--risk-safe)]",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-safe)] shrink-0" />,
    },
  };

  const current = configs[severity] || configs.info;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] border text-xs font-medium select-none",
        current.bg,
        current.border,
        current.color,
        className
      )}
      {...props}
    >
      {showIcon && current.icon}
      <span>{label || current.text}</span>
    </span>
  );
}
