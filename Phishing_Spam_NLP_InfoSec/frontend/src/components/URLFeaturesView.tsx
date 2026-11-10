"use client";

import React, { useMemo } from "react";
import { Sliders, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface URLFeaturesViewProps {
  url: string;
  features: Record<string, number>;
}

interface FeatureRow {
  key: string;
  name: string;
  value: string | number;
  description: string;
  isTriggered: boolean;
  statusLabel: string;
}

export default function URLFeaturesView({ url, features }: URLFeaturesViewProps) {
  // Breakdown target URL components for research clarity
  const parsed = useMemo(() => {
    try {
      const hasScheme = url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://");
      const obj = new URL(hasScheme ? url : `http://${url}`);
      return {
        protocol: obj.protocol.replace(":", ""),
        host: obj.hostname,
        pathname: obj.pathname || "/",
        search: obj.search || "none",
      };
    } catch {
      return {
        protocol: url.startsWith("https") ? "https" : "http",
        host: url,
        pathname: "/",
        search: "none",
      };
    }
  }, [url]);

  // Map 19 features with exact definitions, values, descriptions and triggered checks
  const rows: FeatureRow[] = useMemo(() => {
    const getVal = (keys: string[], defaultVal = 0): number => {
      for (const k of keys) {
        if (features[k] !== undefined) return features[k];
      }
      return defaultVal;
    };

    const definitions = [
      {
        key: "suspicious_patterns",
        name: "Brand Typosquatting & Homoglyphs",
        valKeys: ["suspicious_patterns", "typosquatting"],
        description: "Checks for brand lookalikes (e.g. paypa1, micros0ft) and deceptive character swaps.",
        isTriggered: (v: number) => v === 1,
        format: (v: number) => (v === 1 ? "Detected (1)" : "Clean (0)"),
      },
      {
        key: "use_of_ip",
        name: "Raw IPv4 Host Address",
        valKeys: ["use_of_ip", "has_ip"],
        description: "Checks if the host is a raw numerical IP address rather than a verified domain.",
        isTriggered: (v: number) => v === 1,
        format: (v: number) => (v === 1 ? "Raw IP (1)" : "Domain (0)"),
      },
      {
        key: "short_url",
        name: "URL Shortener Redirection",
        valKeys: ["short_url", "is_shortener"],
        description: "Detects URL redirection services (e.g. bit.ly, tinyurl) used to conceal true destination.",
        isTriggered: (v: number) => v === 1,
        format: (v: number) => (v === 1 ? "Shortener (1)" : "Standard (0)"),
      },
      {
        key: "https",
        name: "TLS / HTTPS Protocol",
        valKeys: ["https", "count_https"],
        description: "Verifies encrypted transport security (0 indicates cleartext HTTP connection).",
        isTriggered: (v: number) => v === 0,
        format: (v: number) => (v === 1 ? "HTTPS (1)" : "HTTP No SSL (0)"),
      },
      {
        key: "url_length",
        name: "Total URL Length",
        valKeys: ["url_length"],
        description: "Total character count; URLs > 75 characters are statistically correlated with lures.",
        isTriggered: (v: number) => v > 75,
        format: (v: number) => `${v} chars`,
      },
      {
        key: "hostname_length",
        name: "Hostname Length",
        valKeys: ["hostname_length"],
        description: "Character count of the domain; excessive length indicates synthetic subdomains.",
        isTriggered: (v: number) => v > 30,
        format: (v: number) => `${v} chars`,
      },
      {
        key: "path_length",
        name: "Path Hierarchy Length",
        valKeys: ["path_length"],
        description: "Character count of resource path following domain authority.",
        isTriggered: (v: number) => v > 50,
        format: (v: number) => `${v} chars`,
      },
      {
        key: "fd_length",
        name: "First Directory Length",
        valKeys: ["fd_length"],
        description: "Length of the primary directory immediately succeeding the hostname.",
        isTriggered: (v: number) => v > 20,
        format: (v: number) => `${v} chars`,
      },
      {
        key: "tld_length",
        name: "Top-Level Domain Length",
        valKeys: ["tld_length"],
        description: "Length of the extension suffix (e.g. .com, .accountants).",
        isTriggered: (v: number) => v > 5,
        format: (v: number) => `${v} chars`,
      },
      {
        key: "count_dots",
        name: "Period (.) Count",
        valKeys: ["count_dots", "dots"],
        description: "Total dots; counts >= 3 indicate deep subdomain nesting or deceptive routing.",
        isTriggered: (v: number) => v >= 3,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_hyphens",
        name: "Hyphen (-) Count",
        valKeys: ["count_hyphens", "hyphens"],
        description: "Hyphens used to synthesize brand lookalikes (e.g. paypal-verify-login).",
        isTriggered: (v: number) => v >= 2,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_at",
        name: "@ Delimiter Count",
        valKeys: ["count_at", "has_at"],
        description: "The @ symbol instructs browsers to treat preceding characters as authentication info.",
        isTriggered: (v: number) => v >= 1,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_question",
        name: "Question Mark (?) Count",
        valKeys: ["count_question"],
        description: "Query string delimiter count; multiple occurrences indicate parameter pollution.",
        isTriggered: (v: number) => v >= 2,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_percent",
        name: "Percent (%) Symbol Count",
        valKeys: ["count_percent"],
        description: "URL hex encoding operator frequently utilized for character obfuscation.",
        isTriggered: (v: number) => v >= 1,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_equal",
        name: "Equal Sign (=) Count",
        valKeys: ["count_equal"],
        description: "Parameter assignment count; high counts accompany tracking and session tokens.",
        isTriggered: (v: number) => v >= 3,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_dir",
        name: "Directory Slash (/) Depth",
        valKeys: ["count_dir"],
        description: "Total directory traversal depth; values >= 4 represent nested resource trees.",
        isTriggered: (v: number) => v >= 4,
        format: (v: number) => `${v} levels`,
      },
      {
        key: "count_digits",
        name: "Numeric Digit Count",
        valKeys: ["count_digits"],
        description: "Total integer digits across URL; attackers use digits for dynamic ID evasion.",
        isTriggered: (v: number) => v > 15,
        format: (v: number) => `${v}`,
      },
      {
        key: "count_letters",
        name: "Alphabet Character Count",
        valKeys: ["count_letters"],
        description: "Total alphabetical characters throughout the URL string.",
        isTriggered: (v: number) => v > 80,
        format: (v: number) => `${v}`,
      },
      {
        key: "entropy",
        name: "Shannon Domain Entropy",
        valKeys: ["entropy", "domain_entropy"],
        description: "Measures domain randomness; values >= 4.0 indicate algorithmic generation (DGA).",
        isTriggered: (v: number) => v >= 4.0,
        format: (v: number) => `${Number(v).toFixed(2)} bits`,
      },
    ];

    return definitions.map((def) => {
      const rawVal = getVal(def.valKeys);
      const triggered = def.isTriggered(rawVal);
      return {
        key: def.key,
        name: def.name,
        value: def.format(rawVal),
        description: def.description,
        isTriggered: triggered,
        statusLabel: triggered ? "Triggered" : "Normal",
      };
    });
  }, [features]);

  const triggeredCount = rows.filter((r) => r.isTriggered).length;

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] space-y-4 transition-colors duration-180">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-3.5 border-b border-[var(--border-subtle)] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-[var(--text-primary)]">
              URL Lexical &amp; Structural Feature Matrix
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-normal">
            Quantitative lexical indicators evaluated by the Random Forest classifier (19 security features).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-[var(--text-secondary)] font-medium">Diagnostic Status:</span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-[5px] font-mono text-xs font-semibold border",
              triggeredCount > 0
                ? "bg-[var(--risk-high-bg)] border-[var(--risk-high-border)] text-[var(--risk-high)]"
                : "bg-[var(--risk-safe-bg)] border-[var(--risk-safe-border)] text-[var(--risk-safe)]"
            )}
          >
            {triggeredCount} of {rows.length} Triggered
          </span>
        </div>
      </div>

      {/* Target URL Structure Breakdown */}
      <div className="p-3 rounded-[8px] bg-[var(--bg-subtle)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div>
          <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] block uppercase">Protocol</span>
          <span className="font-semibold text-[var(--text-primary)] uppercase">
            {parsed.protocol}
          </span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] block uppercase">Hostname</span>
          <span className="font-semibold text-[var(--text-primary)] truncate block" title={parsed.host}>
            {parsed.host}
          </span>
        </div>
        <div>
          <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] block uppercase">Resource Path</span>
          <span className="text-[var(--text-secondary)] truncate block" title={parsed.pathname}>
            {parsed.pathname}
          </span>
        </div>
      </div>

      {/* MOBILE VIEW (< 640px): Stacked Feature Cards for Zero Horizontal Page Scroll */}
      <div className="block sm:hidden space-y-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className={cn(
              "p-3 rounded-[8px] border transition-colors duration-180 space-y-1.5",
              row.isTriggered
                ? "bg-[var(--risk-high-bg)]/30 border-[var(--risk-high-border)]"
                : "bg-[var(--bg-input)] border-[var(--border)]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 font-medium text-[13px] text-[var(--text-primary)]">
                {row.isTriggered ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-high)] shrink-0" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-safe)] shrink-0" />
                )}
                <span>{row.name}</span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-semibold border shrink-0",
                  row.isTriggered
                    ? "bg-[var(--risk-high-bg)] text-[var(--risk-high)] border-[var(--risk-high-border)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)]"
                )}
              >
                {row.statusLabel}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs pt-0.5">
              <span className="text-[11px] text-[var(--text-muted)]">Extracted Value:</span>
              <span className="font-mono font-semibold text-[var(--text-primary)] tabular-nums">
                {row.value}
              </span>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-normal pt-0.5 border-t border-[var(--border-subtle)]">
              {row.description}
            </p>
          </div>
        ))}
      </div>

      {/* DESKTOP & TABLET VIEW (>= 640px): Responsive Table */}
      <div className="hidden sm:block border border-[var(--border)] rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border)] text-[var(--text-secondary)] font-medium">
                <th className="py-2.5 px-3 w-[28%]">Feature</th>
                <th className="py-2.5 px-3 w-[16%]">Extracted Value</th>
                <th className="py-2.5 px-3 w-[42%]">Description &amp; Security Relevance</th>
                <th className="py-2.5 px-3 w-[14%] text-right">Detection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className={cn(
                    "transition-colors duration-180",
                    row.isTriggered
                      ? "bg-[var(--risk-high-bg)]/40 hover:bg-[var(--risk-high-bg)]/60"
                      : "hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">
                    <div className="flex items-center gap-1.5">
                      {row.isTriggered ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-high)] shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-safe)] shrink-0" />
                      )}
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-[var(--text-primary)] tabular-nums">
                    {row.value}
                  </td>
                  <td className="py-2.5 px-3 text-[var(--text-secondary)] leading-relaxed">
                    {row.description}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-semibold border",
                        row.isTriggered
                          ? "bg-[var(--risk-high-bg)] text-[var(--risk-high)] border-[var(--risk-high-border)]"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)]"
                      )}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
