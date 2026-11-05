"use client";

import React from "react";
import { Gauge } from "@/components/ui/Gauge";
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

  // 4-tier risk classification: Low <30, Medium 30-59, High 60-84, Critical >=85
  const getRiskTier = (score: number) => {
    if (score >= 85) return { label: "CRITICAL RISK", variant: "critical" as const };
    if (score >= 60) return { label: "HIGH RISK", variant: "high" as const };
    if (score >= 30) return { label: "MEDIUM RISK", variant: "medium" as const };
    return { label: "LOW RISK", variant: "low" as const };
  };

  const riskTier = getRiskTier(normalizedScore);
  const confidence = isThreat ? normalizedScore : Math.round((100 - normalizedScore) * 10) / 10;

  return (
    <div
      className={cn(
        "rounded-2xl p-6 sm:p-7 bg-[var(--surface-2)] border flex flex-col justify-between h-full transition-all duration-200 shadow-lg",
        isThreat
          ? "border-[var(--risk-critical-border)]"
          : "border-[var(--risk-low-border)]"
      )}
    >
      {/* Top Header: Target Type & Risk Tier Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-3)] font-medium">
          {isThreat ? (
            <ShieldAlert className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[var(--risk-low)] shrink-0" />
          )}
          <span className="text-sm font-medium text-[var(--text-2)]">
            {type === "email" ? "Email Security Verdict" : "URL Lexical Verdict"}
          </span>
        </div>

        <Badge variant={riskTier.variant} size="sm">
          {riskTier.label}
        </Badge>
      </div>

      {/* Main Gauge & Primary Classification Display */}
      <div className="py-6 flex flex-col items-center text-center">
        <Gauge value={normalizedScore} size={154} strokeWidth={12} />

        <div className="mt-5 space-y-1">
          <h2
            className={cn(
              "text-xl font-bold tracking-tight",
              isThreat ? "text-[var(--risk-critical)]" : "text-[var(--risk-low)]"
            )}
          >
            {prediction}
          </h2>
          <p className="text-xs text-[var(--text-3)] tabular-nums font-mono">
            Model Confidence: <span className="text-[var(--text-1)] font-semibold">{confidence}%</span>
          </p>
        </div>
      </div>

      {/* Bottom Summary Callout */}
      {explanation && (
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-xs sm:text-[13px] text-[var(--text-2)] leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
