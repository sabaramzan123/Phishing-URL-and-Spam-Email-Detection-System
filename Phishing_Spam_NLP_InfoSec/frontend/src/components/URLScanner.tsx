"use client";

import React, { useEffect } from "react";
import { Search, AlertTriangle, ShieldCheck, RotateCcw, Link2, CornerDownLeft } from "lucide-react";
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
    const safeUrl = "https://en.wikipedia.org/wiki/Phishing";
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
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 sm:p-[28px] shadow-lg">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-5 mb-5 border-b border-[var(--border-subtle)] gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--text-1)] tracking-tight">
            Inspect Target URL
          </h2>
          <p className="text-[14px] text-[var(--text-2)] leading-normal">
            19 lexical and structural security features evaluated via Random Forest classifier.
          </p>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleTryPhishing}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg text-[var(--text-2)] hover:text-[var(--risk-critical)] hover:bg-[var(--risk-critical-bg)] border border-[var(--border)] hover:border-[var(--risk-critical-border)] transition-colors cursor-pointer"
            title="Populate with typosquatted login link"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-critical)] shrink-0" />
            <span>Phishing URL</span>
          </button>

          <button
            type="button"
            onClick={handleTrySafe}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg text-[var(--text-2)] hover:text-[var(--risk-low)] hover:bg-[var(--risk-low-bg)] border border-[var(--border)] hover:border-[var(--risk-low-border)] transition-colors cursor-pointer"
            title="Populate with legitimate destination"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-low)] shrink-0" />
            <span>Safe URL</span>
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="target-url-input" className="block text-[14px] font-medium text-[var(--text-1)]">
            Target Web URL
          </label>
          <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
            {url.length} chars
          </span>
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-4 text-[var(--text-3)] pointer-events-none">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            id="target-url-input"
            type="text"
            className="w-full h-12 pl-11 pr-4 text-[15px] font-mono bg-[var(--surface-input)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            placeholder="https://example.com/login?token=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim()) {
                onAnalyze();
              }
            }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-6 border-t border-[var(--border-subtle)] gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono">
            <kbd className="px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] text-xs text-[var(--text-2)] font-medium">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] text-xs text-[var(--text-2)] font-medium">
              Enter
            </kbd>
            <CornerDownLeft className="w-3.5 h-3.5 inline text-[var(--text-3)]" />
          </span>
          <span className="text-[var(--text-3)]">to execute model inference</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClear}
            disabled={isInputEmpty || loading}
            icon={<RotateCcw className="w-4 h-4" />}
            className="h-11 px-4 text-sm"
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
            icon={<Search className="w-4 h-4" />}
            className="h-11 px-6 text-sm"
          >
            {loading ? "Analyzing URL..." : "Analyze URL"}
          </Button>
        </div>
      </div>
    </div>
  );
}
