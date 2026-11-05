"use client";

import React from "react";
import {
  Binary,
  Layers,
  Cpu,
  Flame,
  Globe,
  ArrowDown,
  CheckCircle2,
  FileCheck,
  Brain,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function HowItWorksView() {
  const workflowStages = [
    {
      step: 1,
      title: "1. User Input Ingestion",
      icon: <Search className="w-4 h-4 text-[var(--accent)]" />,
      tag: "Raw Stream",
      description: "User submits an email subject and body or a target URL string into the web interface or API endpoint.",
    },
    {
      step: 2,
      title: "2. Input Validation & Telemetry",
      icon: <FileCheck className="w-4 h-4 text-[var(--accent)]" />,
      tag: "RFC Validation",
      description: "Sanitizes characters, validates URI RFC 3986 compliance, calculates character distributions, and recursively unmasks embedded links.",
    },
    {
      step: 3,
      title: "3. NLP Preprocessing / Lexical Decomposition",
      icon: <Layers className="w-4 h-4 text-[var(--accent)]" />,
      tag: "De-noising",
      description: "Emails undergo 5-step NLP cleaning (HTML stripping, entity masking, lowercase, tokenization, stopwords, stemming). URLs are parsed into scheme, host, path, and query hierarchy.",
    },
    {
      step: 4,
      title: "4. Feature Extraction & Vectorization",
      icon: <Binary className="w-4 h-4 text-[var(--accent)]" />,
      tag: "Numbers to Vectors",
      description: "Transforms text into 8,000-dimensional TF-IDF unigrams & bigrams. Computes Shannon entropy, subdomain nesting, and delimiter frequencies across 19 lexical dimensions.",
    },
    {
      step: 5,
      title: "5. Machine Learning Classification",
      icon: <Brain className="w-4 h-4 text-[var(--accent)]" />,
      tag: "Model Inference",
      description: "Trained Random Forest (150 trees) and Calibrated Linear SVM evaluate class posterior probabilities across stratified decision boundaries.",
    },
    {
      step: 6,
      title: "6. Heuristic Threat Assessment & Overlays",
      icon: <Flame className="w-4 h-4 text-[var(--risk-med)]" />,
      tag: "Rule Defense",
      description: "Hybrid defense overlays check for typosquatting/homoglyphs, raw IP hosts, and nested URL threats, while safeguarding verified official apex domains.",
    },
    {
      step: 7,
      title: "7. Final Detection Result & Explainability",
      icon: <ShieldCheck className="w-4 h-4 text-[var(--risk-low)]" />,
      tag: "Verdict & KPIs",
      description: "Maps final probability to 4-tier risk classification (Low, Medium, High, Critical) and delivers human-readable threat indicators.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-1)]">
          PhishGuard Architectural Methodology & Workflow
        </h2>
        <p className="text-xs text-[var(--text-2)] mt-1 max-w-2xl leading-relaxed">
          How our dual-engine cybersecurity platform converts raw unstructured text into explainable,
          high-confidence threat classifications.
        </p>
      </div>

      {/* 7-Step Vertical Flow Pipeline */}
      <div className="rounded-xl p-6 bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <h3 className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider mb-6">
          End-to-End Threat Processing Workflow
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border-strong)]">
          {workflowStages.map((stage, idx) => (
            <div key={stage.step} className="relative flex items-start gap-4 group">
              {/* Timeline Connector Dot */}
              <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-[var(--surface-2)] border-2 border-[var(--accent)] flex items-center justify-center text-[11px] font-mono font-bold text-[var(--accent)] shrink-0 shadow-sm">
                {stage.step}
              </div>

              {/* Stage Card */}
              <div className="flex-1 p-4 rounded-xl bg-[var(--surface-3)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {stage.icon}
                    <h4 className="text-sm font-semibold text-[var(--text-1)]">
                      {stage.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-input)] text-[var(--accent)] border border-[var(--accent-border)] font-semibold uppercase">
                    {stage.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-2)] leading-relaxed mt-1">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between shadow-[var(--shadow-sm)]">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-3">
              <Binary className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">
              Lexical URL Parsing (RFC 3986)
            </h3>
            <p className="text-xs text-[var(--text-3)] mt-2 leading-relaxed">
              Syntactically isolates scheme, netloc, path, query, and fragments. Evaluates 19 parameters including
              character entropy, subdomain counts, delimiter density, and top-level domain abuse.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-3)]">
            Model: Random Forest (90.9% Test Acc)
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between shadow-[var(--shadow-sm)]">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">
              5-Stage NLP Preprocessing
            </h3>
            <p className="text-xs text-[var(--text-3)] mt-2 leading-relaxed">
              Cleans text through HTML entity stripping, lowercasing, Punkt word tokenization, English stopword
              removal, and Porter stemming to map words to root semantic lemmas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-3)]">
            Vector: TF-IDF Unigrams & Bigrams (8k dims)
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between shadow-[var(--shadow-sm)]">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-3">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">
              Heuristic Defense Overlays
            </h3>
            <p className="text-xs text-[var(--text-3)] mt-2 leading-relaxed">
              Protects against edge-case classification errors. Catches typosquatted homoglyphs (e.g. <code>paypa1</code>)
              and raw IP credentials, while whitelisting verified apex corporate domains.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-3)]">
            Classifier: Linear SVM (98.4% Test Acc)
          </div>
        </div>
      </div>
    </div>
  );
}
