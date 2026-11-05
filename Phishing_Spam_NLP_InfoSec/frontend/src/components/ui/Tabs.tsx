"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  mobileLabel?: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SegmentedTabsProps<T extends string = string> {
  options: TabOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedTabs<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: SegmentedTabsProps<T>) {
  const sizeStyles = {
    sm: "p-1 text-xs h-10",
    md: "p-1.5 text-xs sm:text-sm h-12",
  };

  return (
    <div
      role="tablist"
      className={cn(
        "grid items-center bg-[var(--surface-3)] border border-[var(--border)] rounded-xl relative w-full",
        options.length === 2 ? "grid-cols-2" : `grid-cols-${options.length}`,
        sizeStyles[size],
        className
      )}
    >
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            type="button"
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 h-full rounded-lg font-medium text-[11px] sm:text-sm transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] min-w-0",
              isActive
                ? "text-[var(--text-1)] font-semibold"
                : "text-[var(--text-3)] hover:text-[var(--text-2)]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-indicator"
                className="absolute inset-0 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-20 flex items-center gap-1.5 sm:gap-2 truncate">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span className="hidden sm:inline truncate">{opt.label}</span>
              <span className="sm:hidden truncate">{opt.mobileLabel || opt.label}</span>
              {opt.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-input)] text-[var(--text-3)] font-mono shrink-0">
                  {opt.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

