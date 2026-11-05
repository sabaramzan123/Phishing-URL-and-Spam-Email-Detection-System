"use client";

import React from "react";
import { Shield, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="w-full py-10 px-8 sm:p-[36px] rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]/40 flex flex-col items-center justify-center text-center shadow-sm">
      {/* Centered Shield Icon with 16px bottom margin */}
      <div className="w-14 h-14 rounded-2xl bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4 shadow-sm">
        <Shield className="w-7 h-7" />
      </div>

      {/* Heading with clear separation */}
      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-1)] tracking-tight mb-2">
        Awaiting Security Inspection
      </h3>

      {/* Description with proper max-width and line-height */}
      <p className="text-[14px] text-[var(--text-2)] max-w-md mb-6 leading-relaxed">
        Submit an email message or target URL above to execute the dual machine learning
        classifiers and NLP feature extractors.
      </p>

      {/* Hint Pill */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-3)] px-3.5 py-2 rounded-xl bg-[var(--surface-3)] border border-[var(--border)]">
        <span>Tip: Press</span>
        <kbd className="px-2 py-0.5 rounded bg-[var(--surface-input)] border border-[var(--border)] text-xs text-[var(--text-2)] font-medium">
          Ctrl
        </kbd>
        <span>+</span>
        <kbd className="px-2 py-0.5 rounded bg-[var(--surface-input)] border border-[var(--border)] text-xs text-[var(--text-2)] font-medium">
          Enter
        </kbd>
        <span>to scan immediately</span>
      </div>
    </div>
  );
}
