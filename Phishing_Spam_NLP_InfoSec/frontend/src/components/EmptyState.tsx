"use client";

import React from "react";
import { Shield } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="w-full py-12 px-6 rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--bg-card)] flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-primary)] mb-3">
        <Shield className="w-5 h-5" />
      </div>

      <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
        Ready to Analyze
      </h3>

      <p className="text-[14px] text-[var(--text-secondary)] max-w-sm mt-1">
        Enter an email or URL to begin security analysis.
      </p>
    </div>
  );
}
