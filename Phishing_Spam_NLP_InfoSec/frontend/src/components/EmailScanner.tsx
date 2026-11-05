"use client";

import React, { useEffect, useRef } from "react";
import { Search, AlertTriangle, ShieldCheck, RotateCcw, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface EmailScannerProps {
  subject: string;
  setSubject: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  onClear: () => void;
}

export default function EmailScanner({
  subject,
  setSubject,
  body,
  setBody,
  onAnalyze,
  loading,
  onClear,
}: EmailScannerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTryPhishing = () => {
    setSubject("URGENT: Your account has been suspended");
    setBody(
      "Your account access has been restricted due to unauthorized login attempts. Please verify your identity immediately at: http://paypa1-account-verify.com/login.php?user=account to avoid permanent closure."
    );
  };

  const handleTrySafe = () => {
    setSubject("Weekly Project Sync & Agenda Deck");
    setBody(
      "Hi team, please find attached the agenda deck for our Thursday project review. Let me know if you would like to add any discussion topics before our 10:00 AM call. Thanks!"
    );
  };

  const isInputEmpty = !subject.trim() && !body.trim();
  const charCount = (subject + body).length;

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
            Inspect Email Text
          </h2>
          <p className="text-[14px] text-[var(--text-2)] leading-normal">
            NLP preprocessing, intent triggers, and embedded URL cross-analysis.
          </p>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleTryPhishing}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg text-[var(--text-2)] hover:text-[var(--risk-critical)] hover:bg-[var(--risk-critical-bg)] border border-[var(--border)] hover:border-[var(--risk-critical-border)] transition-colors cursor-pointer"
            title="Populate with a typical credential harvesting lure"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--risk-critical)] shrink-0" />
            <span>Phishing Example</span>
          </button>

          <button
            type="button"
            onClick={handleTrySafe}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg text-[var(--text-2)] hover:text-[var(--risk-low)] hover:bg-[var(--risk-low-bg)] border border-[var(--border)] hover:border-[var(--risk-low-border)] transition-colors cursor-pointer"
            title="Populate with standard workplace communication"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-low)] shrink-0" />
            <span>Safe Example</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Subject Field */}
        <div>
          <label htmlFor="email-subject-input" className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
            Subject Line
          </label>
          <input
            id="email-subject-input"
            type="text"
            className="w-full h-11 px-4 text-[15px] bg-[var(--surface-input)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            placeholder="e.g., URGENT: Action Required on Your Account"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="email-body-input" className="block text-[14px] font-medium text-[var(--text-1)]">
              Email Body Content
            </label>
            <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
              {charCount} characters
            </span>
          </div>
          <textarea
            id="email-body-input"
            ref={textareaRef}
            rows={6}
            className="w-full p-4 text-[15px] font-mono leading-relaxed bg-[var(--surface-input)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-y min-h-[160px]"
            placeholder="Paste raw email message or security alert here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
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
            onClick={onAnalyze}
            disabled={isInputEmpty}
            loading={loading}
            icon={<Search className="w-4 h-4" />}
            className="h-11 px-6 text-sm"
          >
            {loading ? "Analyzing Email..." : "Analyze Email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
