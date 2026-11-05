"use client";

import React, { useState } from "react";
import { Sliders, ChevronDown, ChevronUp } from "lucide-react";
import PreprocessingComparison from "./PreprocessingComparison";
import { Button } from "@/components/ui/Button";

export interface DetailedNLPViewProps {
  rawText: string;
  cleanedText: string;
  preprocessingSteps?: any[];
}

export default function DetailedNLPView({
  rawText,
  cleanedText,
  preprocessingSteps = [],
}: DetailedNLPViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-1)]">
              NLP Text Preprocessing Pipeline
            </h3>
            <p className="text-[11px] text-[var(--text-3)]">
              5-step transformation: noise strip, case normalization, tokenization, stopwords, and stemming.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{isOpen ? "Hide Pipeline" : "Inspect 5 Steps"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </Button>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-[var(--border-subtle)] bg-[var(--surface-input)]">
          <PreprocessingComparison
            rawText={rawText}
            cleanedText={cleanedText}
            steps={preprocessingSteps}
          />
        </div>
      )}
    </div>
  );
}
