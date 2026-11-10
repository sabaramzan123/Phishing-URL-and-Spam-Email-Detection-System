"use client";

import React from "react";
import { Link2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { EmbeddedURLItem } from "@/app/page";

export interface EmbeddedURLsViewProps {
  urls: EmbeddedURLItem[];
  combinedExplanation?: string;
}

export default function EmbeddedURLsView({ urls, combinedExplanation }: EmbeddedURLsViewProps) {
  if (!urls || urls.length === 0) return null;

  const suspiciousCount = urls.filter((u) => u.prediction === "SUSPICIOUS").length;

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] space-y-4 transition-colors duration-180">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-3.5 border-b border-[var(--border-subtle)] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-[var(--text-primary)]">
              Embedded Hyperlink Inspection
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-normal">
            Recursive lexical inspection of URLs discovered within the email body.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-[var(--text-secondary)] font-medium">Links Found:</span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-[5px] font-mono text-xs font-semibold border",
              suspiciousCount > 0
                ? "bg-[var(--risk-critical-bg)] border-[var(--risk-critical-border)] text-[var(--risk-critical)]"
                : "bg-[var(--risk-safe-bg)] border-[var(--risk-safe-border)] text-[var(--risk-safe)]"
            )}
          >
            {suspiciousCount > 0
              ? `${suspiciousCount} of ${urls.length} Suspicious`
              : `${urls.length} Clean`}
          </span>
        </div>
      </div>

      {/* URL List */}
      <div className="space-y-2.5">
        {urls.map((item, idx) => {
          const isSuspicious = item.prediction === "SUSPICIOUS";
          const riskVariant =
            item.risk_level === "CRITICAL"
              ? "critical"
              : item.risk_level === "HIGH"
              ? "high"
              : item.risk_level === "MEDIUM"
              ? "medium"
              : "safe";

          return (
            <div
              key={idx}
              className={cn(
                "p-3 sm:p-3.5 rounded-[8px] border transition-colors duration-180 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                isSuspicious
                  ? "bg-[var(--risk-critical-bg)]/30 border-[var(--risk-critical-border)]"
                  : "bg-[var(--bg-input)] border-[var(--border)]"
              )}
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-start gap-2">
                  {isSuspicious ? (
                    <ShieldAlert className="w-4 h-4 text-[var(--risk-critical)] shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[var(--risk-safe)] shrink-0 mt-0.5" />
                  )}
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)] break-all leading-normal">
                    {item.url}
                  </span>
                </div>

                {item.security_indicators && item.security_indicators.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-[var(--text-secondary)] pl-6">
                    {item.security_indicators.map((ind, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.2 rounded-[4px] bg-[var(--bg-card)] border border-[var(--border)] font-mono text-[10px]"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pl-6 sm:pl-0">
                <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums">
                  {item.phishing_probability.toFixed(1)}% risk
                </span>
                <Badge variant={riskVariant} size="sm">
                  {item.risk_level}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
