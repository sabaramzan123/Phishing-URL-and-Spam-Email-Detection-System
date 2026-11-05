"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfusionMatrixProps {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
  modelName: string;
}

export default function ConfusionMatrix({ tn, fp, fn, tp, modelName }: ConfusionMatrixProps) {
  const total = tn + fp + fn + tp;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const fpr = fp + tn > 0 ? fp / (fp + tn) : 0;
  const fnr = fn + tp > 0 ? fn / (fn + tp) : 0;

  return (
    <div className="rounded-xl p-5 bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-1)] uppercase tracking-wider">
              Confusion Matrix: {modelName}
            </h3>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">
              Held-out test split of {total.toLocaleString()} validated samples.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-3)] tabular-nums">
            Total N = {total.toLocaleString()}
          </span>
        </div>

        {/* 2x2 Matrix Grid */}
        <div className="grid grid-cols-2 gap-3 text-center font-mono">
          {/* True Negatives */}
          <div className="p-4 rounded-xl bg-[var(--risk-low-bg)] border border-[var(--risk-low-border)] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-semibold text-[var(--risk-low)] tracking-wider">
              True Negatives (TN)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--risk-low)] my-2 tabular-nums">
              {tn.toLocaleString()}
            </span>
            <span className="text-[11px] text-[var(--text-2)] font-sans">
              Legitimate correctly identified
            </span>
          </div>

          {/* False Positives */}
          <div className="p-4 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-semibold text-[var(--text-3)] tracking-wider">
              False Positives (FP)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-2)] my-2 tabular-nums">
              {fp.toLocaleString()}
            </span>
            <span className="text-[11px] text-[var(--text-3)] font-sans">
              False alarms on benign items
            </span>
          </div>

          {/* False Negatives */}
          <div className="p-4 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-semibold text-[var(--text-3)] tracking-wider">
              False Negatives (FN)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-2)] my-2 tabular-nums">
              {fn.toLocaleString()}
            </span>
            <span className="text-[11px] text-[var(--text-3)] font-sans">
              Missed attacks / stealth threats
            </span>
          </div>

          {/* True Positives */}
          <div className="p-4 rounded-xl bg-[var(--risk-critical-bg)] border border-[var(--risk-critical-border)] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-semibold text-[var(--risk-critical)] tracking-wider">
              True Positives (TP)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--risk-critical)] my-2 tabular-nums">
              {tp.toLocaleString()}
            </span>
            <span className="text-[11px] text-[var(--text-2)] font-sans">
              Confirmed attacks blocked
            </span>
          </div>
        </div>
      </div>

      {/* Derived Academic Error Rates */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface-input)] border border-[var(--border)]">
          <span className="text-[var(--text-3)]">False Alarm Rate (FPR):</span>
          <span className="font-semibold text-[var(--text-1)] tabular-nums">
            {(fpr * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface-input)] border border-[var(--border)]">
          <span className="text-[var(--text-3)]">Miss Rate (FNR):</span>
          <span className="font-semibold text-[var(--text-1)] tabular-nums">
            {(fnr * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

