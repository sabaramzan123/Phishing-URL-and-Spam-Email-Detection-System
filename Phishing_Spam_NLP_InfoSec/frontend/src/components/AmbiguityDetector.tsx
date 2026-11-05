"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2 } from "lucide-react";

export interface AmbiguityItem {
  word: string;
  type: string;
  explanation: string;
}

interface AmbiguityDetectorProps {
  ambiguities?: AmbiguityItem[];
}

export default function AmbiguityDetector({ ambiguities = [] }: AmbiguityDetectorProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(
    ambiguities.length > 0 ? ambiguities[0].word : null
  );

  const activeItem = ambiguities.find((a) => a.word === selectedWord);

  return (
    <div className="ambiguity-section-card">
      <div className="ambiguity-card-title">
        <HelpCircle className="w-4 h-4 text-amber-400" />
        <span>🧩 Ambiguity Detected</span>
      </div>

      {ambiguities.length > 0 ? (
        <div>
          <span className="text-xs text-slate-400 block mb-2">
            Click a detected word to see multiple meanings:
          </span>

          <div className="ambiguity-chips-list">
            {ambiguities.map((item, idx) => {
              const isSelected = item.word === selectedWord;
              return (
                <button
                  key={idx}
                  type="button"
                  className="ambiguity-click-chip"
                  style={{
                    background: isSelected ? "rgba(245, 158, 11, 0.28)" : undefined,
                    borderColor: isSelected ? "#f59e0b" : undefined,
                  }}
                  onClick={() => setSelectedWord(item.word)}
                >
                  "{item.word}"
                </button>
              );
            })}
          </div>

          {activeItem && (
            <div className="ambiguity-detail-card">
              <div className="ambiguity-detail-word">
                Word: <span className="text-white">"{activeItem.word}"</span> ({activeItem.type})
              </div>
              <p className="ambiguity-detail-expl">
                {activeItem.explanation}
              </p>
              <span className="text-xs text-slate-400 block mt-2">
                *The computer algorithm must use the surrounding sentence context to resolve the correct meaning.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="ambiguity-clean-state">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>✓ No notable ambiguous terms detected.</span>
        </div>
      )}
    </div>
  );
}
