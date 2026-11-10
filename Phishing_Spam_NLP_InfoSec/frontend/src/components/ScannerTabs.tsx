"use client";

import React from "react";
import { Mail, Globe } from "lucide-react";
import { SegmentedTabs } from "@/components/ui/Tabs";

export interface ScannerTabsProps {
  scannerMode: "email" | "url";
  setScannerMode: (mode: "email" | "url") => void;
}

export default function ScannerTabs({ scannerMode, setScannerMode }: ScannerTabsProps) {
  const tabOptions = [
    {
      id: "email" as const,
      label: "Email Analysis",
      icon: <Mail className="w-4 h-4 shrink-0" />,
    },
    {
      id: "url" as const,
      label: "URL Analysis",
      icon: <Globe className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <div className="w-full pt-4 sm:pt-6 pb-4 sm:pb-5 border-b border-[var(--border)] mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold tracking-tight text-[var(--text-primary)] leading-snug">
            Phishing &amp; Spam Detection
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] max-w-xl leading-normal">
            Analyze suspicious emails and URLs using Natural Language Processing and machine learning.
          </p>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="w-full sm:w-auto sm:min-w-[300px] shrink-0">
          <SegmentedTabs
            options={tabOptions}
            value={scannerMode}
            onChange={setScannerMode}
          />
        </div>
      </div>
    </div>
  );
}
