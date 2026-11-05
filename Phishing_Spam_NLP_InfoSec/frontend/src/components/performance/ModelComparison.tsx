"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ModelComparisonItem {
  name: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  samples: number;
}

export interface ModelComparisonProps {
  models: ModelComparisonItem[];
  selectedModel: string;
  onSelectModel: (name: string) => void;
}

export default function ModelComparison({
  models,
  selectedModel,
  onSelectModel,
}: ModelComparisonProps) {
  return (
    <div className="rounded-xl p-5 bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-1)] uppercase tracking-wider">
              Classifier Benchmark Comparison
            </h3>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">
              Side-by-side comparison of F1-Score & Accuracy across project models.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-3)]">
            4 Evaluated Classifiers
          </span>
        </div>

        {/* Model Comparative Bars */}
        <div className="space-y-4">
          {models.map((m) => {
            const accPct = m.accuracy * 100;
            const f1Pct = m.f1_score * 100;
            const isSelected = selectedModel === m.name;

            return (
              <div
                key={m.name}
                onClick={() => onSelectModel(m.name)}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer",
                  isSelected
                    ? "bg-[var(--surface-3)] border-[var(--accent)] shadow-sm"
                    : "bg-[var(--surface-input)] border-[var(--border)] hover:border-[var(--border-strong)]"
                )}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", isSelected ? "text-[var(--accent)]" : "text-[var(--text-1)]")}>
                      {m.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-2)] text-[var(--text-3)]">
                      {m.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
                    <span className="text-[var(--text-3)]">Acc: {accPct.toFixed(1)}%</span>
                    <span className="text-[var(--text-1)] font-bold">F1: {f1Pct.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Accuracy & F1 Bar Tracks */}
                <div className="space-y-1">
                  <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isSelected ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
                      )}
                      style={{ width: `${f1Pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-3)]">
        <span>Click any classifier above to inspect its confusion matrix and metrics.</span>
      </div>
    </div>
  );
}

