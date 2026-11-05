"use client";

import React, { useState } from "react";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";

export interface LinguisticData {
  syntax?: {
    sentence_structure?: string;
    url_structure?: string;
    word_count?: number;
    sentence_count?: number;
    shouting_words_count?: number;
    special_chars_count?: number;
    syntax_summary?: string;
  };
  semantics?: {
    literal_topic?: string;
    semantic_keywords_found?: string[];
    meaning_summary?: string;
  };
  pragmatics?: {
    speaker_intent?: string;
    contextual_reading?: string;
  };
}

interface LinguisticAnalysisProps {
  linguistics?: LinguisticData;
}

export default function LinguisticAnalysis({ linguistics }: LinguisticAnalysisProps) {
  const [openLayer, setOpenLayer] = useState<string | null>(null);

  if (!linguistics) return null;
  const { syntax, semantics, pragmatics } = linguistics;

  const toggleLayer = (layer: string) => {
    setOpenLayer(openLayer === layer ? null : layer);
  };

  return (
    <div className="linguistics-container-card">
      <div className="linguistics-main-title">
        <Layers className="w-4 h-4 text-purple-400" />
        <span>🔬 Linguistic Analysis</span>
      </div>

      <div className="linguistics-trio-grid">
        {/* Layer 1: Syntax */}
        <div className="linguistic-layer-accordion syntax">
          <div
            className="linguistic-layer-header"
            onClick={() => toggleLayer("syntax")}
          >
            <div>
              <div className="linguistic-layer-name">Syntax</div>
              <div className="linguistic-layer-sub">Structure & Grammar</div>
            </div>
            {openLayer === "syntax" ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {openLayer === "syntax" && (
            <div className="linguistic-layer-body">
              <div className="space-y-1 mb-2">
                <div className="linguistic-row-stat">
                  <span>Words / Tokens:</span>
                  <span className="linguistic-stat-num">{syntax?.word_count ?? 0}</span>
                </div>
                {syntax?.sentence_count !== undefined && (
                  <div className="linguistic-row-stat">
                    <span>Sentences:</span>
                    <span className="linguistic-stat-num">{syntax.sentence_count}</span>
                  </div>
                )}
                {syntax?.shouting_words_count !== undefined && (
                  <div className="linguistic-row-stat">
                    <span>Shouting Words:</span>
                    <span className={`linguistic-stat-num ${syntax.shouting_words_count > 0 ? "text-amber-400" : ""}`}>
                      {syntax.shouting_words_count}
                    </span>
                  </div>
                )}
                {syntax?.url_structure && (
                  <div className="linguistic-row-stat">
                    <span>Structure:</span>
                    <span className="linguistic-stat-num">{syntax.url_structure}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-2 rounded">
                {syntax?.syntax_summary || "Analyzes sentence structure and token boundaries without looking at meaning."}
              </p>
            </div>
          )}
        </div>

        {/* Layer 2: Semantics */}
        <div className="linguistic-layer-accordion semantics">
          <div
            className="linguistic-layer-header"
            onClick={() => toggleLayer("semantics")}
          >
            <div>
              <div className="linguistic-layer-name">Semantics</div>
              <div className="linguistic-layer-sub">Literal Meaning</div>
            </div>
            {openLayer === "semantics" ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {openLayer === "semantics" && (
            <div className="linguistic-layer-body">
              <div className="space-y-1 mb-2">
                <div className="linguistic-row-stat">
                  <span>Literal Topic:</span>
                  <span className="linguistic-stat-num">{semantics?.literal_topic || "General Topic"}</span>
                </div>
                <div className="linguistic-row-stat">
                  <span>Key Terms:</span>
                  <span className="linguistic-stat-num">
                    {semantics?.semantic_keywords_found?.length ? semantics.semantic_keywords_found.join(", ") : "None"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-2 rounded">
                {semantics?.meaning_summary || "Analyzes the literal dictionary meaning of the words."}
              </p>
            </div>
          )}
        </div>

        {/* Layer 3: Pragmatics */}
        <div className="linguistic-layer-accordion pragmatics">
          <div
            className="linguistic-layer-header"
            onClick={() => toggleLayer("pragmatics")}
          >
            <div>
              <div className="linguistic-layer-name">Pragmatics</div>
              <div className="linguistic-layer-sub">Intent in Context</div>
            </div>
            {openLayer === "pragmatics" ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {openLayer === "pragmatics" && (
            <div className="linguistic-layer-body">
              <div className="space-y-1 mb-2">
                <div className="linguistic-row-stat">
                  <span>Inferred Intent:</span>
                  <span className={`linguistic-stat-num ${pragmatics?.speaker_intent?.includes("Threat") || pragmatics?.speaker_intent?.includes("Urgency") || pragmatics?.speaker_intent?.includes("Phish") ? "text-rose-400" : "text-emerald-400"}`}>
                    {pragmatics?.speaker_intent || "Neutral Communication"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-2 rounded">
                {pragmatics?.contextual_reading || "Reading between the lines: How the context and intent differ from literal words."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
