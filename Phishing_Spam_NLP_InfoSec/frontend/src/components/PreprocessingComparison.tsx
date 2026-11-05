"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Layers, CheckCircle, ArrowRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PreprocessingStep {
  step_number: number;
  step_name: string;
  slide_reference?: string;
  description: string;
  before_text: string;
  after_text: string;
  tokens?: string[];
  removed_words?: string[];
}

export interface PreprocessingComparisonProps {
  rawText: string;
  cleanedText: string;
  steps?: PreprocessingStep[];
}

export default function PreprocessingComparison({
  rawText,
  cleanedText,
  steps = [],
}: PreprocessingComparisonProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (num: number) => {
    setExpandedStep(expandedStep === num ? null : num);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Before & After Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-3)] mb-2 uppercase tracking-wider">
            <span>Original Input Stream</span>
            <span className="font-mono">{rawText.length} characters</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[var(--surface-input)] border border-[var(--border)] font-mono text-xs text-[var(--text-2)] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap break-words">
            {rawText || "(empty)"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--accent)] mb-2 uppercase tracking-wider">
            <span>Cleaned & Normalized Document</span>
            <span className="font-mono">{cleanedText.split(/\s+/).filter(Boolean).length} tokens</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[var(--surface-input)] border border-[var(--accent-border)] font-mono text-xs text-[var(--text-1)] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap break-words">
            {cleanedText || "(empty)"}
          </div>
        </div>
      </div>

      {/* 2. Vertical 5-Step Stepper */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <span>5-Stage NLP Preprocessing Pipeline Walkthrough</span>
          </h4>
          <span className="text-xs text-[var(--text-3)]">
            Click step to inspect token transformations
          </span>
        </div>

        <div className="space-y-2">
          {steps.map((st) => {
            const isOpen = expandedStep === st.step_number;

            return (
              <div
                key={st.step_number}
                className={cn(
                  "rounded-xl border transition-all duration-150 overflow-hidden",
                  isOpen
                    ? "bg-[var(--surface-2)] border-[var(--border-strong)] shadow-sm"
                    : "bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-strong)]"
                )}
              >
                {/* Stepper Header Button */}
                <button
                  type="button"
                  onClick={() => toggleStep(st.step_number)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors",
                        isOpen
                          ? "bg-[var(--accent)] text-white shadow-sm"
                          : "bg-[var(--surface-3)] text-[var(--text-2)] border border-[var(--border)]"
                      )}
                    >
                      {st.step_number}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-1)]">
                          {st.step_name}
                        </span>
                        {st.slide_reference && (
                          <span className="hidden sm:inline-block text-[10px] text-[var(--text-3)] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-3)] border border-[var(--border)]">
                            {st.slide_reference}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-3)] mt-0.5 line-clamp-1">
                        {st.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-[var(--text-3)] shrink-0 ml-2">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Step Content Drawer */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-[var(--border-subtle)] space-y-3.5 animate-in fade-in-50 duration-150">
                    <p className="text-xs text-[var(--text-2)] leading-relaxed">
                      {st.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-lg bg-[var(--surface-input)] border border-[var(--border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-3)] block mb-1">
                          Before Transformation
                        </span>
                        <div className="text-[var(--text-2)] break-all max-h-28 overflow-y-auto leading-relaxed">
                          {st.before_text}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[var(--surface-input)] border border-[var(--accent-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--accent)] block mb-1">
                          After Transformation
                        </span>
                        <div className="text-[var(--text-1)] break-all max-h-28 overflow-y-auto leading-relaxed">
                          {st.after_text}
                        </div>
                      </div>
                    </div>

                    {/* Removed Stopwords list if available */}
                    {st.removed_words && st.removed_words.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] text-[var(--risk-med)] font-medium flex items-center gap-1.5 mb-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Filtered Stopwords ({st.removed_words.length}):</span>
                        </span>
                        <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border)]">
                          {st.removed_words.map((w, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono line-through text-[var(--text-3)] bg-[var(--surface-input)] border border-[var(--border)]"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Tokens Cloud if available */}
                    {st.tokens && st.tokens.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] text-[var(--text-2)] font-medium block mb-1.5">
                          Retained Informative Tokens ({st.tokens.length}):
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2.5 rounded-lg bg-[var(--surface-3)] border border-[var(--border)]">
                          {st.tokens.map((tok, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--surface-input)] border border-[var(--border)] text-[var(--text-1)]"
                            >
                              {tok}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
