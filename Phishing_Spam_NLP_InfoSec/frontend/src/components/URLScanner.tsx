"use client";

import React, { useEffect } from "react";
import { Search, RotateCcw, AlertTriangle, ShieldCheck, Link2, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface URLScannerProps {
  url: string;
  setUrl: (val: string) => void;
  onAnalyze: (overrideUrl?: string) => void;
  loading: boolean;
  onClear: () => void;
}

export default function URLScanner({
  url,
  setUrl,
  onAnalyze,
  loading,
  onClear,
}: URLScannerProps) {
  const handleTryPhishing = () => {
    const phishUrl = "http://paypa1-account-verify.com/login.php?user=account";
    setUrl(phishUrl);
  };

  const handleTrySafe = () => {
    const safeUrl = "https://en.wikipedia.org/wiki/Natural_language_processing";
    setUrl(safeUrl);
  };

  const isInputEmpty = !url.trim();

  // Hotkey: Cmd/Ctrl + Enter to trigger analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (!isInputEmpty && !loading) {
          e.preventDefault();
          onAnalyze();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInputEmpty, loading, onAnalyze]);

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] transition-colors duration-180">
      {/* Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[var(--border-subtle)]">
        <h2 className="text-[17px] sm:text-[18px] font-semibold text-[var(--text-primary)]">
          URL Analysis
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5 leading-normal">
          Inspect URL structure, lexical characteristics, and suspicious patterns.
        </p>
      </div>

      {/* URL Input Field */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="target-url-input"
              className="block text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)]"
            >
              Target URL
            </label>
            <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              {url.length} characters
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              id="target-url-input"
              type="text"
              className="w-full h-10 sm:h-11 pl-10 pr-3.5 text-[14px] font-mono bg-[var(--bg-input)] border border-[var(--border)] rounded-[8px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-card)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-focus)] focus:outline-none transition-all duration-180 ease-in-out"
              placeholder="https://example.com/path?query=param"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Sample Examples */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[var(--text-muted)] mr-0.5">Load sample:</span>
          <Button
            type="button"
            variant="sample"
            size="sm"
            onClick={handleTryPhishing}
            icon={<AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-high)]" />}
          >
            Phishing URL Example
          </Button>

          <Button
            type="button"
            variant="sample"
            size="sm"
            onClick={handleTrySafe}
            icon={<ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-safe)]" />}
          >
            Safe URL Example
          </Button>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-5 border-t border-[var(--border-subtle)]">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <kbd className="px-1.5 py-0.5 rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-secondary)]">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded-[5px] bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-secondary)]">
            Enter
          </kbd>
          <CornerDownLeft className="w-3.5 h-3.5 text-[var(--text-muted)] inline ml-0.5" />
          <span className="ml-1">to analyze</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClear}
            disabled={isInputEmpty || loading}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="flex-1 sm:flex-initial h-11 sm:h-10"
          >
            Clear
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onAnalyze()}
            disabled={isInputEmpty}
            loading={loading}
            icon={<Search className="w-3.5 h-3.5" />}
            className="flex-2 sm:flex-initial h-11 sm:h-10 min-w-[140px]"
          >
            {loading ? "Analyzing..." : "Analyze URL"}
          </Button>
        </div>
      </div>
    </div>
  );
}
