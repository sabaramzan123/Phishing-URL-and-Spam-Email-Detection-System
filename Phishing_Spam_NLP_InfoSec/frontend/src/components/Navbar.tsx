"use client";

import React, { useState } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  apiOnline: boolean | null;
  onRefreshStatus: () => void;
}

export default function Navbar({ apiOnline, onRefreshStatus }: NavbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg-card)] sticky top-0 z-40">
      <div className="app-container h-14 flex items-center justify-between gap-2">
        {/* Left: PhishGuard Logo & Wordmark */}
        <div className="flex items-center gap-2 sm:gap-2.5 select-none shrink-0">
          <div className="w-8 h-8 rounded-[9px] bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary-border)] flex items-center justify-center text-[var(--accent-primary)] shadow-none transition-transform duration-180 hover:scale-105">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-semibold text-[15px] sm:text-[16px] tracking-tight text-[var(--text-primary)]">
              PhishGuard
            </span>
            <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] hidden md:inline">
              NLP &amp; Threat Detection
            </span>
          </div>
        </div>

        {/* Right: Dual Scanner Indicator + API Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-[var(--bg-subtle)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span>Dual Scanner</span>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-[7px] border text-[11px] sm:text-xs font-mono transition-colors duration-180",
                apiOnline === true
                  ? "bg-[var(--risk-safe-bg)] border-[var(--risk-safe-border)] text-[var(--risk-safe)]"
                  : apiOnline === false
                  ? "bg-[var(--risk-critical-bg)] border-[var(--risk-critical-border)] text-[var(--risk-critical)]"
                  : "bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)]"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  apiOnline === true
                    ? "bg-[var(--risk-safe)] animate-pulse"
                    : apiOnline === false
                    ? "bg-[var(--risk-critical)]"
                    : "bg-[var(--text-muted)]"
                )}
              />
              <span className="hidden xs:inline sm:inline">
                {apiOnline === true
                  ? "API Online"
                  : apiOnline === false
                  ? "API Offline"
                  : "Connecting..."}
              </span>
              <span className="xs:hidden sm:hidden">
                {apiOnline === true ? "Online" : apiOnline === false ? "Offline" : "..."}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh API connection status"
              title="Refresh API connection status"
              className="p-1.5 sm:p-2 rounded-[9px] border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-all duration-180 ease-in-out hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw
                className={cn(
                  "w-3.5 h-3.5",
                  isRefreshing && "animate-spin text-[var(--accent-primary)]"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
