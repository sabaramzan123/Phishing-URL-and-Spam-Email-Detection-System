"use client";

import React, { useEffect, useRef } from "react";
import { Search, RotateCcw, AlertTriangle, ShieldCheck, CornerDownLeft } from "lucide-react";
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
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] transition-colors duration-180">
      {/* Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[var(--border-subtle)]">
        <h2 className="text-[17px] sm:text-[18px] font-semibold text-[var(--text-primary)]">
          Email Analysis
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5 leading-normal">
          Evaluate email headers, body linguistics, and embedded hyperlinks through NLP feature extraction.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Subject Line Input */}
        <div>
          <label
            htmlFor="email-subject-input"
            className="block text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)] mb-1.5"
          >
            Subject Line
          </label>
          <input
            id="email-subject-input"
            type="text"
            className="w-full h-10 sm:h-11 px-3.5 text-[14px] bg-[var(--bg-input)] border border-[var(--border)] rounded-[8px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-card)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-focus)] focus:outline-none transition-all duration-180 ease-in-out"
            placeholder="e.g. Action Required: Verification Notice"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Email Content Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="email-body-input"
              className="block text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)]"
            >
              Email Content
            </label>
            <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              {charCount} characters
            </span>
          </div>
          <textarea
            id="email-body-input"
            ref={textareaRef}
            rows={5}
            className="w-full p-3.5 text-[14px] font-mono leading-relaxed bg-[var(--bg-input)] border border-[var(--border)] rounded-[8px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-card)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-focus)] focus:outline-none transition-all duration-180 ease-in-out resize-y min-h-[130px] sm:min-h-[150px]"
            placeholder="Paste raw email body text or message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
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
            Phishing Example
          </Button>

          <Button
            type="button"
            variant="sample"
            size="sm"
            onClick={handleTrySafe}
            icon={<ShieldCheck className="w-3.5 h-3.5 text-[var(--risk-safe)]" />}
          >
            Safe Example
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
            onClick={onAnalyze}
            disabled={isInputEmpty}
            loading={loading}
            icon={<Search className="w-3.5 h-3.5" />}
            className="flex-2 sm:flex-initial h-11 sm:h-10 min-w-[140px]"
          >
            {loading ? "Analyzing..." : "Analyze Email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
