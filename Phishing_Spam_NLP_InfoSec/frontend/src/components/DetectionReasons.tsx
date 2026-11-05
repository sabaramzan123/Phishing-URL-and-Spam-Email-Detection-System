"use client";

import React from "react";
import {
  ShieldAlert,
  Clock,
  Key,
  Link2,
  Globe,
  AlertTriangle,
  Flame,
  ShieldCheck,
  FileText,
  Lock,
} from "lucide-react";
import { SeverityChip, type SeverityLevel } from "@/components/ui/SeverityChip";
import { cn } from "@/lib/utils";

export interface DetectionReasonsProps {
  indicators: string[];
  explanation?: string;
  isThreat: boolean;
}

interface ParsedIndicator {
  title: string;
  description: string;
  severity: SeverityLevel;
  icon: React.ReactNode;
}

export default function DetectionReasons({
  indicators,
  explanation,
  isThreat,
}: DetectionReasonsProps) {
  // Helper to parse indicator string into structured, enterprise-grade row
  const parseIndicator = (raw: string): ParsedIndicator => {
    const lower = raw.toLowerCase();

    // 1. Typosquatting / Brand impersonation / Suspicious pattern
    if (lower.includes("lookalike") || lower.includes("typosquat") || lower.includes("brand impersonation") || lower.includes("suspicious url structure")) {
      return {
        title: "Deceptive Brand Lookalike / Typosquatting",
        description: "Domain structurally mimics known consumer brands or uses character substitutions (homoglyphs) to mislead users.",
        severity: "critical",
        icon: <Flame className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />,
      };
    }

    // 2. Raw IP host
    if (lower.includes("raw ip") || lower.includes("ip address")) {
      return {
        title: "Raw IP Address Used as Host",
        description: "URL circumvents standard DNS infrastructure by directly routing to a bare IPv4 host, a tactic used to evade domain reputation filters.",
        severity: "critical",
        icon: <Globe className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />,
      };
    }

    // 3. Credential harvesting / Login keywords
    if (lower.includes("credential") || lower.includes("password") || lower.includes("login") || lower.includes("verify your account")) {
      return {
        title: "Authentication / Credential Harvesting Trigger",
        description: "Message or URL contains high-affinity credential collection targets designed to intercept user session credentials.",
        severity: "high",
        icon: <Key className="w-4 h-4 text-[var(--risk-high)] shrink-0" />,
      };
    }

    // 4. Urgent / Pressure manipulation
    if (lower.includes("urgent") || lower.includes("pressure") || lower.includes("immediate") || lower.includes("pragmatic")) {
      return {
        title: "Psychological Coercion & Artificial Urgency",
        description: "Linguistic urgency cues (e.g., immediate account suspension threats) intended to bypass rational verification.",
        severity: "high",
        icon: <Clock className="w-4 h-4 text-[var(--risk-high)] shrink-0" />,
      };
    }

    // 5. Insecure HTTP / No SSL
    if (lower.includes("insecure") || lower.includes("no ssl")) {
      return {
        title: "Insecure Cleartext Transport (HTTP)",
        description: "Connection lacks SSL/TLS transport encryption, exposing transmitted credentials to interception.",
        severity: "medium",
        icon: <Lock className="w-4 h-4 text-[var(--risk-med)] shrink-0" />,
      };
    }

    // 6. Suspicious TLD / Multiple subdomains
    if (lower.includes("subdomain") || lower.includes("tld") || lower.includes("hyphen")) {
      return {
        title: "Anomalous Structural Hierarchy",
        description: "Excessive nesting depth, high hyphen count, or high-risk top-level domain frequently leveraged in burner phishing kits.",
        severity: "medium",
        icon: <AlertTriangle className="w-4 h-4 text-[var(--risk-med)] shrink-0" />,
      };
    }

    // 7. Shortener
    if (lower.includes("shorten") || lower.includes("shortener")) {
      return {
        title: "URL Shortener Redirection Cloak",
        description: "Destination obscures true apex destination behind a redirection intermediary.",
        severity: "medium",
        icon: <Link2 className="w-4 h-4 text-[var(--risk-med)] shrink-0" />,
      };
    }

    // 8. HTTPS detected (Benign indicator)
    if (lower.includes("https detected")) {
      return {
        title: "Transport Layer Security (TLS) Present",
        description: "Valid HTTPS scheme detected. (Note: Many modern phishing sites also utilize free TLS certificates).",
        severity: "info",
        icon: <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />,
      };
    }

    // Fallback negative
    if (isThreat) {
      return {
        title: raw,
        description: "Statistical trigger exceeding normal baseline distributions for benign content.",
        severity: "high",
        icon: <AlertTriangle className="w-4 h-4 text-[var(--risk-high)] shrink-0" />,
      };
    }

    // Fallback benign
    return {
      title: raw,
      description: "Conforms to authentic structural and linguistic communication standards.",
      severity: "safe",
      icon: <ShieldCheck className="w-4 h-4 text-[var(--risk-low)] shrink-0" />,
    };
  };

  const parsedList = indicators.map(parseIndicator);

  // Sort by severity hierarchy
  const severityOrder: Record<SeverityLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    info: 3,
    safe: 4,
  };

  parsedList.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="rounded-2xl p-6 sm:p-7 bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between h-full shadow-lg">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-base font-semibold text-[var(--text-1)]">
              {isThreat ? "Why Was This Flagged?" : "Security Analysis Findings"}
            </h3>
          </div>

          <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
            {parsedList.length} {parsedList.length === 1 ? "indicator" : "indicators"}
          </span>
        </div>

        {/* Severity-Ordered Indicator Rows */}
        <div className="mt-5 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {parsedList.length > 0 ? (
            parsedList.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3.5 rounded-xl border transition-colors flex items-start gap-3.5",
                  item.severity === "critical"
                    ? "bg-[var(--risk-critical-bg)] border-[var(--risk-critical-border)]"
                    : item.severity === "high"
                    ? "bg-[var(--risk-high-bg)] border-[var(--risk-high-border)]"
                    : item.severity === "medium"
                    ? "bg-[var(--risk-med-bg)] border-[var(--risk-med-border)]"
                    : item.severity === "safe"
                    ? "bg-[var(--risk-low-bg)] border-[var(--risk-low-border)]"
                    : "bg-[var(--surface-3)] border-[var(--border)]"
                )}
              >
                <div className="mt-0.5">{item.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[13px] sm:text-sm font-semibold text-[var(--text-1)] leading-tight">
                      {item.title}
                    </span>
                    <SeverityChip severity={item.severity} />
                  </div>
                  <p className="text-xs sm:text-[13px] text-[var(--text-2)] mt-1.5 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 rounded-xl bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] text-xs sm:text-sm text-[var(--risk-low)] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>No malicious or suspicious indicators detected. Message adheres to legitimate communication standards.</span>
            </div>
          )}
        </div>
      </div>

      {/* Technical Context Bar */}
      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-3)]">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <FileText className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" />
          <span>Multivariate Security Assessment</span>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-3)]">
          {indicators.length === 0 ? "Zero Threat Signatures" : `${indicators.length} Active Finding${indicators.length > 1 ? "s" : ""}`}
        </span>
      </div>
    </div>
  );
}
