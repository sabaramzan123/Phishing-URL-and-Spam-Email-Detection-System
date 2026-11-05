"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: "safe" | "threat" | "neutral";
}

export function Stat({ label, value, subtext, icon, trend = "neutral", className, ...props }: StatProps) {
  const trendColors = {
    neutral: "text-[var(--text-1)]",
    safe: "text-[var(--risk-low)]",
    threat: "text-[var(--risk-critical)]",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between transition-colors hover:border-[var(--border-strong)] shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-3)] font-medium">
        <span>{label}</span>
        {icon && <span className="text-[var(--text-3)] shrink-0">{icon}</span>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn("text-2xl sm:text-3xl font-bold tracking-tight tabular-nums", trendColors[trend])}>
          {value}
        </span>
      </div>

      {subtext && <span className="text-xs text-[var(--text-3)] mt-2 leading-tight">{subtext}</span>}
    </div>
  );
}

