"use client";

import React from "react";
import { Mail, Link2, ShieldCheck, Binary, Cpu } from "lucide-react";
import { SegmentedTabs } from "@/components/ui/Tabs";

export interface ScannerTabsProps {
  scannerMode: "email" | "url";
  setScannerMode: (mode: "email" | "url") => void;
}

export default function ScannerTabs({ scannerMode, setScannerMode }: ScannerTabsProps) {
  const tabOptions = [
    {
      id: "email" as const,
      label: "Email Intelligence",
      mobileLabel: "Email",
      icon: <Mail className="w-4 h-4 shrink-0" />,
    },
    {
      id: "url" as const,
      label: "URL Lexical Scanner",
      mobileLabel: "URL Scanner",
      icon: <Link2 className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center text-center pt-2 sm:pt-4 pb-2">
      {/* 3 Informational Trust Badges */}
      <div className="hidden sm:inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-3)] mb-4 shadow-sm">
        <span className="flex items-center gap-1.5 text-[var(--text-2)] font-medium">
          <Binary className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>19 Lexical Features</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
        <span className="flex items-center gap-1.5 text-[var(--text-2)] font-medium">
          <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>5-Stage NLP Preprocessing</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
        <span className="flex items-center gap-1.5 text-[var(--text-2)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-low)]" />
          <span>Explainable Threat Detection</span>
        </span>
      </div>

      {/* Hero Heading: 42px to 48px on desktop per spec */}
      <h1 className="text-[22px] sm:text-3xl md:text-[44px] lg:text-[46px] font-bold tracking-tight text-[var(--text-1)] leading-[1.2] px-1 max-w-4xl">
        Intelligent Phishing &amp; Spam Detection
      </h1>

      {/* Subtitle */}
      <p className="text-[14px] sm:text-[16px] text-[var(--text-2)] max-w-2xl mt-2.5 sm:mt-3 mb-6 sm:mb-8 leading-relaxed px-4">
        Detect malicious URLs and suspicious emails using machine learning, lexical intelligence,
        and NLP-based text analysis.
      </p>

      {/* Segmented Switcher Control */}
      <SegmentedTabs
        options={tabOptions}
        value={scannerMode}
        onChange={setScannerMode}
        className="w-full max-w-md sm:max-w-lg shadow-sm"
      />
    </div>
  );
}
