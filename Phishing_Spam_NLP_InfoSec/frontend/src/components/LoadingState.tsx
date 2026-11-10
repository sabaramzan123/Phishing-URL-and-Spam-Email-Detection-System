"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="w-full py-12 px-6 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] flex flex-col items-center justify-center text-center shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2.5 text-[var(--accent-primary)] mb-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-[15px] font-medium text-[var(--text-primary)]">
          Executing Analysis...
        </span>
      </div>
      <p className="text-[13px] text-[var(--text-secondary)] max-w-sm">
        Processing text normalization, feature extraction, and model inference.
      </p>

      {/* Subtle compact progress bars */}
      <div className="w-full max-w-xs mt-4 space-y-2">
        <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent-primary)] rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}
