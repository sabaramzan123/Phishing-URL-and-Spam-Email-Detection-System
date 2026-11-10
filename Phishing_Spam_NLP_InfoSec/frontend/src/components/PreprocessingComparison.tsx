"use client";

import React, { useState } from "react";
import { ChevronDown, Layers, CheckCircle2 } from "lucide-react";
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
  featureSummary?: string;
}

export default function PreprocessingComparison({
  rawText,
  cleanedText,
  steps = [],
  featureSummary,
}: PreprocessingComparisonProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (num: number) => {
    setExpandedStep(expandedStep === num ? null : num);
  };

  const stageMeta: Record<number, { title: string; desc: string }> = {
    1: {
      title: "Text Normalization",
      desc: "Strips HTML tags, hyperlinks, and punctuation noise; standardizes character casing.",
    },
    2: {
      title: "Regex Tokenization",
      desc: "Segments normalized text into discrete alphanumeric word tokens.",
    },
    3: {
      title: "Stopword Elimination",
      desc: "Prunes high-frequency English functional words (e.g. 'the', 'is', 'at') to retain threat keywords.",
    },
    4: {
      title: "Porter Stemming",
      desc: "Reduces inflected words to linguistic base roots (e.g. 'suspended' → 'suspend').",
    },
    5: {
      title: "TF-IDF Vectorization",
      desc: "Projects stemmed tokens into numerical vector space using unigrams and bigrams.",
    },
  };

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-4 sm:p-6 shadow-[var(--shadow-card)] space-y-4 sm:space-y-5 transition-colors duration-180">
      {/* Header */}
      <div className="pb-3 sm:pb-3.5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[var(--text-primary)]">
            Natural Language Processing Pipeline
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-normal">
          Step-by-step transformation from unstructured email text to weighted numerical vectors.
        </p>
      </div>

      {/* 1. Before & After Text Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {/* Before: Raw Text */}
        <div className="p-3 sm:p-3.5 rounded-[8px] bg-[var(--bg-input)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mb-1.5 sm:mb-2">
            <span>Raw Input Text</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {rawText.length} characters
            </span>
          </div>
          <div className="p-2.5 rounded-[6px] bg-[var(--bg-card)] border border-[var(--border)] font-mono text-xs text-[var(--text-secondary)] leading-relaxed max-h-28 sm:max-h-32 overflow-y-auto whitespace-pre-wrap break-words">
            {rawText || "(empty input)"}
          </div>
        </div>

        {/* After: Cleaned Tokens */}
        <div className="p-3 sm:p-3.5 rounded-[8px] bg-[var(--bg-input)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--accent-primary)] mb-1.5 sm:mb-2">
            <span>Cleaned &amp; Normalized Text</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {cleanedText.split(/\s+/).filter(Boolean).length} tokens
            </span>
          </div>
          <div className="p-2.5 rounded-[6px] bg-[var(--bg-card)] border border-[var(--accent-primary-border)] font-mono text-xs text-[var(--text-primary)] leading-relaxed max-h-28 sm:max-h-32 overflow-y-auto whitespace-pre-wrap break-words">
            {cleanedText || "(empty output)"}
          </div>
        </div>
      </div>

      {/* 2. Educational Vertical Stepper (5 Stages) */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          5-Stage Pipeline Breakdown
        </div>

        {steps && steps.length > 0 ? (
          steps.map((st) => {
            const isOpen = expandedStep === st.step_number;
            const meta = stageMeta[st.step_number] || {
              title: st.step_name,
              desc: st.description,
            };

            return (
              <div
                key={st.step_number}
                className="border border-[var(--border)] rounded-[9px] bg-[var(--bg-card)] transition-colors duration-180 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleStep(st.step_number)}
                  aria-expanded={isOpen}
                  className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--bg-subtle)] transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary-focus)]"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                    <span className="w-6 h-6 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center font-mono text-xs font-semibold text-[var(--accent-primary)] shrink-0">
                      {st.step_number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)] leading-tight truncate">
                        {meta.title}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 leading-normal line-clamp-1 sm:line-clamp-none">
                        {meta.desc}
                      </div>
                    </div>
                  </div>

                  <div className="text-[var(--text-muted)] shrink-0 pl-1">
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-180 ease-in-out",
                        isOpen && "rotate-180 text-[var(--accent-primary)]"
                      )}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-3 sm:p-3.5 bg-[var(--bg-input)] border-t border-[var(--border)] space-y-2.5 text-xs">
                    {/* Before & After for this specific step */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                      <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-[6px]">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">
                          Step Input
                        </span>
                        <div className="text-[var(--text-secondary)] max-h-24 overflow-y-auto break-words leading-relaxed">
                          {st.before_text || "(none)"}
                        </div>
                      </div>
                      <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-[6px]">
                        <span className="text-[10px] text-[var(--accent-primary)] uppercase block mb-1">
                          Step Output
                        </span>
                        <div className="text-[var(--text-primary)] max-h-24 overflow-y-auto break-words leading-relaxed">
                          {st.after_text || "(none)"}
                        </div>
                      </div>
                    </div>

                    {/* Token list tags if available */}
                    {st.tokens && st.tokens.length > 0 && (
                      <div>
                        <span className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                          Extracted Tokens ({st.tokens.length}):
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[6px]">
                          {st.tokens.slice(0, 80).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-[4px] bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--text-primary)] border border-[var(--border)]"
                            >
                              {t}
                            </span>
                          ))}
                          {st.tokens.length > 80 && (
                            <span className="text-[11px] font-mono text-[var(--text-muted)] self-center px-1">
                              +{st.tokens.length - 80} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((stageNum) => {
              const meta = stageMeta[stageNum];
              return (
                <div
                  key={stageNum}
                  className="p-3 rounded-[8px] border border-[var(--border)] bg-[var(--bg-input)] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-[6px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center font-mono text-xs font-semibold text-[var(--accent-primary)] shrink-0 mt-0.5">
                    {stageNum}
                  </span>
                  <div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)]">
                      {meta.title}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {meta.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stage 5: TF-IDF & Classifier Info */}
        <div className="p-3 rounded-[8px] bg-[var(--bg-subtle)] border border-[var(--border)] text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span className="leading-normal">
              <strong>Model Inference:</strong> Linear Support Vector Machine (Linear SVM) evaluated against TF-IDF unigram &amp; bigram features.
            </span>
          </div>
          {featureSummary && (
            <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
              {featureSummary}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
