"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ResultCardProps {
  prediction: string;
  isThreat: boolean;
  riskScore: number; // 0 to 100
  type: "email" | "url";
  explanation?: string;
}

export default function ResultCard({
  prediction,
  isThreat,
  riskScore,
  type,
  explanation,
}: ResultCardProps) {
  const normalizedScore = Math.max(0, Math.min(100, riskScore));

  // 4-tier risk classification: Low <30%, Medium 30-59%, High 60-84%, Critical >=85%
  const getRiskTier = (score: number) => {
    if (score >= 85) {
      return {
        label: "Critical Risk",
        category: "CRITICAL",
        variant: "critical" as const,
        color: "var(--risk-critical)",
      };
    }
    if (score >= 60) {
      return {
        label: "High Risk",
        category: "HIGH",
        variant: "high" as const,
        color: "var(--risk-high)",
      };
    }
    if (score >= 30) {
      return {
        label: "Suspicious",
        category: "SUSPICIOUS",
        variant: "suspicious" as const,
        color: "var(--risk-suspicious)",
      };
    }
    return {
      label: "Safe / Low Risk",
      category: "SAFE",
      variant: "safe" as const,
      color: "var(--risk-safe)",
    };
  };

  const riskTier = getRiskTier(normalizedScore);

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] transition-colors duration-180">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-3 sm:mb-4 border-b border-[var(--border-subtle)] gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {isThreat ? (
            <ShieldAlert className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[var(--risk-safe)] shrink-0" />
          )}
          <span className="text-[11px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider truncate">
            {type === "email" ? "Email Classification Verdict" : "URL Classification Verdict"}
          </span>
        </div>

        <Badge variant={riskTier.variant} size="sm">
          {riskTier.label}
        </Badge>
      </div>

      {/* Main Prediction & Probability Section */}
      <div className="space-y-3.5 sm:space-y-4">
        <div>
          <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mb-1">
            Predicted Class
          </div>
          <div
            className={cn(
              "text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-tight break-words leading-tight",
              isThreat ? "text-[var(--risk-critical)]" : "text-[var(--risk-safe)]"
            )}
          >
            {prediction}
          </div>
        </div>

        {/* Compact Horizontal Risk Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)] font-medium">
              Risk Probability Score
            </span>
            <span className="font-mono font-semibold text-[var(--text-primary)] tabular-nums text-sm">
              {normalizedScore.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2.5 sm:h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border)] relative">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${normalizedScore}%`,
                backgroundColor: riskTier.color,
              }}
            />
          </div>

          {/* Scale Markers */}
          <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] pt-0.5">
            <span>0% Safe</span>
            <span>30% Suspicious</span>
            <span>60% Threat</span>
            <span>100% Critical</span>
          </div>
        </div>

        {/* Human-Readable Explanation */}
        {explanation && (
          <div className="p-3 sm:p-3.5 rounded-[8px] bg-[var(--bg-input)] border border-[var(--border)] text-xs sm:text-[13px] text-[var(--text-primary)] leading-relaxed mt-2">
            <span className="font-medium text-[var(--text-primary)] block mb-0.5">
              Diagnostic Summary:
            </span>
            <p className="break-words">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
