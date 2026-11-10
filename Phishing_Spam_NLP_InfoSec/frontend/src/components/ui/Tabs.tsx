"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
    sm: "p-0.5 text-xs h-9",
    md: "p-1 text-sm h-10 sm:h-11",
  };

  return (
    <div
      role="tablist"
      className={cn(
        "grid grid-cols-2 items-center bg-[var(--bg-subtle)] border border-[var(--border)] rounded-[9px] relative w-full",
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
              "relative z-10 flex items-center justify-center gap-2 px-3 h-full rounded-[7px] font-medium text-xs sm:text-sm transition-all duration-180 ease-in-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary-focus)]",
              isActive
                ? "bg-[var(--bg-card)] text-[var(--accent-primary)] font-semibold border border-[var(--border-strong)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]/50"
            )}
          >
            <span className="flex items-center gap-1.5 truncate">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span className="truncate">{opt.label}</span>
              {opt.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
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
