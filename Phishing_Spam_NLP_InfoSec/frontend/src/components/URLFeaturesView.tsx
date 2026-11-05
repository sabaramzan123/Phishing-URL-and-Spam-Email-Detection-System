"use client";

import React, { useMemo } from "react";
import {
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface URLFeaturesViewProps {
  url: string;
  features: Record<string, number>;
}

export default function URLFeaturesView({ url, features }: URLFeaturesViewProps) {
  // Parse URL components to highlight suspicious tokens
  const urlBreakdown = useMemo(() => {
    try {
      const hasScheme = url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://");
      const urlObj = new URL(hasScheme ? url : `http://${url}`);
      return {
        protocol: urlObj.protocol.replace(":", ""),
        host: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hasSSL: urlObj.protocol === "https:",
      };
    } catch {
      return {
        protocol: url.startsWith("https") ? "https" : "http",
        host: url,
        pathname: "",
        search: "",
        hasSSL: url.startsWith("https"),
      };
    }
  }, [url]);

  // Feature definitions with description, threshold, and threat impact
  const featureDefinitions: Array<{
    key: string;
    label: string;
    description: string;
    isTriggered: (val: number) => boolean;
    formatValue: (val: number) => string;
  }> = [
    {
      key: "suspicious_patterns",
      label: "Typosquatting & Threat Patterns",
      description: "Detects brand homoglyphs, character swaps (e.g. paypa1), and double slash exploits.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Detected)" : "0 (Clean)"),
    },
    {
      key: "has_ip",
      label: "Raw IPv4 Host Address",
      description: "Checks if domain resolves to a numerical IP instead of a verified registered domain.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Host IP)" : "0 (DNS Name)"),
    },
    {
      key: "https",
      label: "TLS / HTTPS Protocol",
      description: "Checks whether transport is secured with valid TLS encryption (0 = Unencrypted HTTP).",
      isTriggered: (v) => v === 0,
      formatValue: (v) => (v === 1 ? "1 (HTTPS)" : "0 (HTTP No SSL)"),
    },
    {
      key: "has_at",
      label: "@ Obfuscation Delimiter",
      description: "Authority token delimiter used to deceive users regarding the genuine apex host.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Present)" : "0 (Clean)"),
    },
    {
      key: "is_shortener",
      label: "URL Shortener Redirection",
      description: "Detects shortening services (bit.ly, tinyurl, etc.) masking true destination.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Shortener)" : "0 (Direct)"),
    },
    {
      key: "login_keyword",
      label: "Login Trigger Keyword",
      description: "Matches authentication keywords: 'login', 'signin', 'log-in'.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Found)" : "0 (None)"),
    },
    {
      key: "verify_keyword",
      label: "Verify Trigger Keyword",
      description: "Matches verification keywords: 'verify', 'verification', 'confirm'.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Found)" : "0 (None)"),
    },
    {
      key: "password_keyword",
      label: "Password Keyword",
      description: "Matches credential keywords: 'password', 'passcode', 'credential'.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Found)" : "0 (None)"),
    },
    {
      key: "account_keyword",
      label: "Account Keyword",
      description: "Matches user profile keywords: 'account', 'profile', 'membership'.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Found)" : "0 (None)"),
    },
    {
      key: "secure_keyword",
      label: "Security Keyword",
      description: "Matches pseudo-trust keywords: 'secure', 'security', 'protect'.",
      isTriggered: (v) => v === 1,
      formatValue: (v) => (v === 1 ? "1 (Found)" : "0 (None)"),
    },
    {
      key: "num_subdomains",
      label: "Subdomain Nesting Depth",
      description: "Depth of subdomains under apex (threshold: >=2 levels).",
      isTriggered: (v) => v >= 2,
      formatValue: (v) => `${v} levels`,
    },
    {
      key: "url_length",
      label: "Total URL Character Length",
      description: "Overall character count (threshold: >75 characters).",
      isTriggered: (v) => v > 75,
      formatValue: (v) => `${v} chars`,
    },
    {
      key: "domain_length",
      label: "Apex Domain Length",
      description: "Length of domain host string (threshold: >28 characters).",
      isTriggered: (v) => v > 28,
      formatValue: (v) => `${v} chars`,
    },
    {
      key: "num_dots",
      label: "Period (.) Delimiter Count",
      description: "Count of dots in URL string (threshold: >=4 dots).",
      isTriggered: (v) => v >= 4,
      formatValue: (v) => `${v} dots`,
    },
    {
      key: "num_hyphens",
      label: "Hyphen (-) Count",
      description: "Count of hyphens commonly used to mimic brand names (threshold: >=3).",
      isTriggered: (v) => v >= 3,
      formatValue: (v) => `${v} hyphens`,
    },
    {
      key: "num_special_chars",
      label: "Special Characters Count",
      description: "Density of special characters (?=&%_-~+#@:; threshold: >=6).",
      isTriggered: (v) => v >= 6,
      formatValue: (v) => `${v} chars`,
    },
    {
      key: "num_digits",
      label: "Numerical Digits Count",
      description: "Count of numerical digits in URL string (threshold: >=5).",
      isTriggered: (v) => v >= 5,
      formatValue: (v) => `${v} digits`,
    },
    {
      key: "num_slashes",
      label: "Path Slashes Count",
      description: "Directory hierarchy depth (threshold: >=5 slashes).",
      isTriggered: (v) => v >= 5,
      formatValue: (v) => `${v} slashes`,
    },
    {
      key: "query_length",
      label: "Query Parameter Length",
      description: "Character length of HTTP GET parameters following '?' (threshold: >40).",
      isTriggered: (v) => v > 40,
      formatValue: (v) => `${v} chars`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. URL Syntactic RFC 3986 Breakdown Card */}
      <div className="p-5 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between mb-3 text-xs text-[var(--text-3)] font-medium">
          <span className="flex items-center gap-1.5 text-[var(--text-1)] font-semibold">
            <Globe className="w-4 h-4 text-[var(--accent)]" />
            <span>URL Syntactic RFC 3986 Structural Breakdown</span>
          </span>
          <span className="font-mono">{url.length} total characters</span>
        </div>

        {/* Visual Token Stream */}
        <div className="p-3.5 rounded-lg bg-[var(--surface-input)] border border-[var(--border-strong)] font-mono text-xs break-all flex flex-wrap items-center gap-1.5 leading-relaxed">
          {/* Protocol */}
          <span
            className={cn(
              "px-2 py-0.5 rounded font-semibold",
              urlBreakdown.hasSSL
                ? "bg-[var(--risk-low-bg)] text-[var(--risk-low)] border border-[var(--risk-low-border)]"
                : "bg-[var(--risk-critical-bg)] text-[var(--risk-critical)] border border-[var(--risk-critical-border)]"
            )}
            title={urlBreakdown.hasSSL ? "Encrypted HTTPS Scheme" : "Unencrypted Insecure HTTP Scheme"}
          >
            {urlBreakdown.protocol}://
          </span>

          {/* Host */}
          <span
            className={cn(
              "px-2 py-0.5 rounded font-semibold",
              features.suspicious_patterns === 1 || features.has_ip === 1
                ? "bg-[var(--risk-critical-bg)] text-[var(--risk-critical)] border border-[var(--risk-critical-border)]"
                : "text-[var(--text-1)]"
            )}
            title="Registered Host / Apex Domain"
          >
            {urlBreakdown.host}
          </span>

          {/* Path */}
          {urlBreakdown.pathname && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded",
                features.login_keyword === 1 || features.verify_keyword === 1 || features.password_keyword === 1
                  ? "bg-[var(--risk-med-bg)] text-[var(--risk-med)] border border-[var(--risk-med-border)]"
                  : "text-[var(--text-2)]"
              )}
              title="Path Directory Hierarchy"
            >
              {urlBreakdown.pathname}
            </span>
          )}

          {/* Query */}
          {urlBreakdown.search && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded",
                urlBreakdown.search.length > 40
                  ? "bg-[var(--risk-med-bg)] text-[var(--risk-med)] border border-[var(--risk-med-border)]"
                  : "text-[var(--text-3)]"
              )}
              title="HTTP Query Parameters"
            >
              {urlBreakdown.search}
            </span>
          )}
        </div>

        {/* Structural Indicators Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-3)]">Protocol:</span>
            <span className={urlBreakdown.hasSSL ? "text-[var(--risk-low)]" : "text-[var(--risk-critical)]"}>
              {urlBreakdown.protocol.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-3)]">IP Host:</span>
            <span className={features.has_ip === 1 ? "text-[var(--risk-critical)]" : "text-[var(--risk-low)]"}>
              {features.has_ip === 1 ? "Yes (Raw IP)" : "No (DNS)"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-3)]">Shortener:</span>
            <span className={features.is_shortener === 1 ? "text-[var(--risk-med)]" : "text-[var(--risk-low)]"}>
              {features.is_shortener === 1 ? "Yes (Cloaked)" : "No (Direct)"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-3)]">Typosquat:</span>
            <span className={features.suspicious_patterns === 1 ? "text-[var(--risk-critical)]" : "text-[var(--risk-low)]"}>
              {features.suspicious_patterns === 1 ? "Flagged" : "Clean"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Structured 19-Feature Table (Feature Name | Extracted Value | Description | Status) */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-input)] overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="px-5 py-3.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent)]" />
            <h4 className="text-xs font-semibold text-[var(--text-1)] uppercase tracking-wider">
              19 Lexical Security Parameters Evaluated by Random Forest
            </h4>
          </div>
          <span className="text-xs font-mono text-[var(--text-3)]">
            19 Features
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-3)] uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-2.5 px-4">Feature Name</th>
                <th className="py-2.5 px-4">Extracted Value</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
              {featureDefinitions.map((feat) => {
                const rawVal = features[feat.key] ?? 0;
                const triggered = feat.isTriggered(rawVal);

                return (
                  <tr
                    key={feat.key}
                    className={cn(
                      "transition-colors",
                      triggered
                        ? "bg-[var(--risk-critical-bg)]/40 hover:bg-[var(--risk-critical-bg)]/60"
                        : "hover:bg-[var(--surface-2)]/60"
                    )}
                  >
                    {/* Feature Name */}
                    <td className="py-3 px-4 font-semibold text-[var(--text-1)] font-sans">
                      {feat.label}
                    </td>

                    {/* Extracted Value */}
                    <td className="py-3 px-4 tabular-nums">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-semibold",
                          triggered
                            ? "bg-[var(--risk-critical-bg)] text-[var(--risk-critical)] border border-[var(--risk-critical-border)]"
                            : "bg-[var(--surface-3)] text-[var(--text-1)] border border-[var(--border)]"
                        )}
                      >
                        {feat.formatValue(rawVal)}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-[var(--text-2)] font-sans text-[11px] leading-relaxed max-w-md">
                      {feat.description}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-right">
                      {triggered ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--risk-critical)] text-white shadow-sm">
                          <Flame className="w-3 h-3" />
                          <span>TRIGGERED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--surface-3)] text-[var(--text-3)] border border-[var(--border)]">
                          <CheckCircle2 className="w-3 h-3 text-[var(--risk-low)]" />
                          <span>NORMAL</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
