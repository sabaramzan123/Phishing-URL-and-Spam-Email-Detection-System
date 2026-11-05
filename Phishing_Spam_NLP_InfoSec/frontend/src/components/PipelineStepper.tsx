"use client";

import React, { useState } from "react";
import { Workflow, CheckCircle2, ChevronRight, FileText, Sliders, BarChart3, Cpu, Globe } from "lucide-react";

export interface NLPPipelineStage {
  stage_id: number;
  stage_name: string;
  slide_reference?: string;
  simple_explanation?: string;
  description?: string;
  data?: any;
  steps?: any[];
  tokens?: string[];
  stemmed_tokens?: string[];
  top_words?: Array<{ word: string; count: number }>;
  feature_summary?: string;
  decision?: string;
  spam_probability?: number;
  normal_probability?: number;
  is_spam?: boolean;
  accuracy_pct?: string;
  test_results?: string;
  confusion_matrix?: {
    correct_normal: number;
    correct_spam: number;
    false_alarms: number;
    missed_spam: number;
  };
  deployment_status?: string;
}

interface PipelineStepperProps {
  stages: NLPPipelineStage[];
}

export default function PipelineStepper({ stages }: PipelineStepperProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  if (!stages || stages.length === 0) return null;

  const currentStage = stages.find((s) => s.stage_id === selectedStageId) || stages[0];

  const getStageIcon = (id: number) => {
    switch (id) {
      case 1:
        return <FileText className="w-3.5 h-3.5" />;
      case 2:
        return <Sliders className="w-3.5 h-3.5" />;
      case 3:
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 4:
        return <Cpu className="w-3.5 h-3.5" />;
      case 5:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 6:
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return <Workflow className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="pipeline-stepper-card">
      <div className="pipeline-card-title">
        <Workflow className="w-4 h-4 text-blue-400" />
        <span>6-Stage Generic NLP Pipeline</span>
      </div>

      {/* Clickable 6-Stage Stepper Navigation */}
      <div className="pipeline-steps-nav" role="tablist">
        {stages.map((stg) => {
          const isActive = stg.stage_id === selectedStageId;
          const cleanName = stg.stage_name.replace(/^\d+\.\s*/, "");

          return (
            <button
              key={stg.stage_id}
              className={`pipeline-step-btn ${isActive ? "active" : ""}`}
              onClick={() => setSelectedStageId(stg.stage_id)}
              role="tab"
              aria-selected={isActive}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="pipeline-step-num">#{stg.stage_id}</span>
                {getStageIcon(stg.stage_id)}
              </div>
              <span className="pipeline-step-name">{cleanName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Box */}
      <div className="pipeline-stage-view-box">
        <div className="pipeline-stage-view-header">
          <div>
            <h4 className="pipeline-stage-title-text">
              Stage {currentStage.stage_id} — {currentStage.stage_name.replace(/^\d+\.\s*/, "")}
            </h4>
            <p className="pipeline-stage-desc-text">
              {currentStage.simple_explanation || currentStage.description}
            </p>
          </div>
          <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Stage {currentStage.stage_id} of 6
          </span>
        </div>

        {/* Dynamic Stage Details */}
        {currentStage.stage_id === 1 && currentStage.data && (
          <div className="text-xs text-slate-300 font-mono bg-black/40 p-3 rounded-lg max-h-24 overflow-y-auto">
            {currentStage.data.raw_text || "(empty)"}
          </div>
        )}

        {currentStage.stage_id === 2 && currentStage.steps && (
          <div className="text-xs text-slate-300 space-y-1">
            <span className="text-slate-400 block font-semibold mb-1">Includes 5 Preprocessing Steps:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStage.steps.map((st: any) => (
                <div key={st.step_number} className="bg-white/5 p-2 rounded border border-white/5">
                  <strong className="text-white">Step {st.step_number}: {st.step_name}</strong>
                  <p className="text-slate-400 text-xs mt-0.5">{st.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStage.stage_id === 3 && currentStage.top_words && (
          <div className="text-xs text-slate-300">
            <span className="text-slate-400 block font-semibold mb-2">Word Frequencies & Vector Features:</span>
            <div className="flex flex-wrap gap-2">
              {currentStage.top_words.map((item, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-xs font-mono">
                  "{item.word}": <strong className="text-cyan-400">{item.count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {currentStage.stage_id === 4 && (
          <div className="text-xs text-slate-300 flex items-center justify-between bg-black/40 p-3 rounded-lg">
            <span>Model Classifier Decision: <strong className="text-white">{currentStage.decision || (currentStage.is_spam ? "SPAM" : "HAM")}</strong></span>
            <span className="font-mono text-cyan-400">Probability: {currentStage.spam_probability ?? 50}%</span>
          </div>
        )}

        {currentStage.stage_id === 5 && (
          <div className="text-xs text-slate-300 flex items-center justify-between bg-black/40 p-3 rounded-lg">
            <span>Test Set Benchmark Accuracy: <strong className="text-emerald-400">{currentStage.accuracy_pct || "97.8%"}</strong></span>
            <span className="text-slate-400">{currentStage.test_results || "Held-out test validation"}</span>
          </div>
        )}

        {currentStage.stage_id === 6 && (
          <div className="text-xs text-slate-300 flex items-center gap-2 bg-black/40 p-3 rounded-lg">
            <span className="status-indicator-dot text-emerald-400" />
            <span>Deployed Live in Application: <strong>FastAPI Backend + Next.js UI</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
