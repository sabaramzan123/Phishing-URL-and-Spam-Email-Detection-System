"use client";

import React from "react";
import {
  Clock,
  Key,
  Globe,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Lock,
  Link2,
  FileText,
} from "lucide-react";
import { SeverityChip, type SeverityLevel } from "@/components/ui/SeverityChip";

export interface DetectionReasonsProps {
  indicators: string[];
  explanation?: string;
  isThreat: boolean;
}

interface ParsedFinding {
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
  // Parse indicator string into structured, academic finding
  const parseIndicator = (raw: string): ParsedFinding => {
    const lower = raw.toLowerCase();

    // 1. Typosquatting / Brand impersonation / Suspicious pattern
    if (
      lower.includes("lookalike") ||
      lower.includes("typosquat") ||
      lower.includes("brand impersonation") ||
      lower.includes("suspicious url structure")
    ) {
      return {
        title: "Brand Typosquatting Detected",
        description:
          "Target domain structurally mimics recognized consumer brands or employs character substitutions (homoglyphs) to deceive users.",
        severity: "critical",
        icon: <Flame className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />,
      };
    }

    // 2. Raw IP host
    if (lower.includes("raw ip") || lower.includes("ip address")) {
      return {
        title: "Raw IP Address Used",
        description:
          "URL uses a numerical IPv4 address rather than a registered domain name, commonly used to bypass reputation filtering.",
        severity: "critical",
        icon: <Globe className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />,
      };
    }

    // 3. Credential harvesting / Login keywords
    if (
      lower.includes("credential") ||
      lower.includes("password") ||
      lower.includes("login") ||
      lower.includes("verify your account")
    ) {
      return {
        title: "Credential Harvesting Trigger",
        description:
          "Text or URL contains high-affinity authentication lures designed to prompt immediate credential submission.",
        severity: "high",
        icon: <Key className="w-4 h-4 text-[var(--risk-high)] shrink-0" />,
      };
    }

    // 4. Urgent / Pressure manipulation
    if (
      lower.includes("urgent") ||
      lower.includes("pressure") ||
      lower.includes("immediate") ||
      lower.includes("pragmatic")
    ) {
      return {
        title: "Urgent Language Detected",
        description:
          "Coercive urgency cues (e.g. immediate account suspension threats) intended to force impulsive user action.",
        severity: "high",
        icon: <Clock className="w-4 h-4 text-[var(--risk-high)] shrink-0" />,
      };
    }

    // 5. Embedded link threat
    if (lower.includes("embedded") || lower.includes("hyperlink")) {
      return {
        title: "Embedded Malicious Link",
        description:
          "Hyperlink embedded inside the email payload was flagged as suspicious upon recursive structural inspection.",
        severity: "critical",
        icon: <Link2 className="w-4 h-4 text-[var(--risk-critical)] shrink-0" />,
      };
    }

    // 6. Insecure HTTP / No SSL
    if (lower.includes("insecure") || lower.includes("no ssl") || lower.includes("http)")) {
      return {
        title: "Insecure Cleartext Transport (HTTP)",
        description:
          "Connection lacks TLS encryption, leaving data vulnerable to eavesdropping and interception.",
        severity: "medium",
        icon: <Lock className="w-4 h-4 text-[var(--risk-suspicious)] shrink-0" />,
      };
    }

    // 7. Suspicious TLD / Multiple subdomains / Structural
    if (lower.includes("subdomain") || lower.includes("tld") || lower.includes("hyphen")) {
      return {
        title: "Suspicious URL Structure",
        description:
          "Anomalous subdomain depth, abnormal hyphenation, or high-risk top-level domain frequently used in phishing campaigns.",
        severity: "medium",
        icon: <AlertTriangle className="w-4 h-4 text-[var(--risk-suspicious)] shrink-0" />,
      };
    }

    // 8. Safe / Benign indicators
    if (lower.includes("standard") || lower.includes("clean") || lower.includes("official") || lower.includes("safe")) {
      return {
        title: "Standard Web Structure",
        description: "URL or text conforms to verified legitimate domain and lexical standards.",
        severity: "safe",
        icon: <ShieldCheck className="w-4 h-4 text-[var(--risk-safe)] shrink-0" />,
      };
    }

    // Fallback: Custom indicator
    return {
      title: raw.split("(")[0]?.trim() || raw,
      description: raw.includes("(") ? raw.slice(raw.indexOf("(") + 1).replace(")", "") : "Identified during security analysis.",
      severity: isThreat ? "medium" : "info",
      icon: <FileText className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />,
    };
  };

  const findings = indicators.map(parseIndicator);

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] transition-colors duration-180">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-3 sm:mb-4 border-b border-[var(--border-subtle)] gap-2">
        <div>
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[var(--text-primary)]">
            Detection Findings
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-normal">
            Key indicators and security signals identified by the classifier.
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)] shrink-0">
          {findings.length} {findings.length === 1 ? "signal" : "signals"}
        </span>
      </div>

      {/* Findings List */}
      {findings.length === 0 ? (
        <div className="py-6 px-4 rounded-[8px] bg-[var(--bg-subtle)] border border-[var(--border)] text-center">
          <ShieldCheck className="w-5 h-5 text-[var(--risk-safe)] mx-auto mb-1.5" />
          <p className="text-sm font-medium text-[var(--text-primary)]">
            No Malicious Indicators Detected
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Input exhibits standard patterns with no high-risk keywords or structural anomalies.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {findings.map((f, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[8px] bg-[var(--bg-input)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3 transition-colors duration-180 hover:bg-[var(--bg-subtle)]"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">{f.icon}</div>
                <div className="min-w-0">
                  <div className="text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)] leading-tight">
                    {f.title}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-normal break-words">
                    {f.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto pl-6 sm:pl-0">
                <SeverityChip severity={f.severity} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
