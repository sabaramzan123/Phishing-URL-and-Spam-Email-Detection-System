"use client";

import React from "react";
import { Shield, BookOpen, Layers, Cpu, Server, Code, Terminal, Target, Award, CheckCircle2 } from "lucide-react";

export default function AboutView() {
  const technologies = [
    { name: "Next.js 16 (App Router)", cat: "Frontend" },
    { name: "React 19", cat: "Frontend" },
    { name: "TypeScript 5", cat: "Frontend" },
    { name: "Tailwind CSS v4", cat: "Styling" },
    { name: "Python 3.11+", cat: "Backend" },
    { name: "FastAPI", cat: "Backend" },
    { name: "Scikit-Learn", cat: "Machine Learning" },
    { name: "NLTK Toolkit", cat: "NLP" },
    { name: "TF-IDF Vectorization", cat: "NLP" },
    { name: "Random Forest Classifier", cat: "Machine Learning" },
    { name: "Linear Support Vector Machine", cat: "Machine Learning" },
    { name: "Multinomial Naive Bayes", cat: "Machine Learning" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-1)]">
          About PhishGuard
        </h2>
        <p className="text-xs text-[var(--text-2)] mt-1 max-w-3xl leading-relaxed">
          An enterprise-grade Natural Language Processing (NLP) and Information Security (InfoSec) platform
          developed for transparent, explainable detection of phishing URLs and deceptive emails.
        </p>
      </div>

      {/* Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Problem Statement */}
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-1)] mb-2 uppercase tracking-wider">
              <Target className="w-4 h-4 text-[var(--risk-critical)]" />
              <span>Problem Statement</span>
            </div>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Phishing accounts for over 80% of reported enterprise security incidents. Attackers exploit psychological
              urgency, brand homoglyphs, and zero-day redirection links to bypass static domain blacklists and
              rule-based spam filters. Traditional signature-based detection fails against dynamic, novel attack infrastructure.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-3)]">
            Focus: Detecting Zero-Day Deception Before Static Blacklisting
          </div>
        </div>

        {/* Project Objectives */}
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-1)] mb-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[var(--accent)]" />
              <span>Project Objectives</span>
            </div>
            <ul className="text-xs text-[var(--text-2)] space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--risk-low)] shrink-0 mt-0.5" />
                <span>Develop a dual-engine architecture classifying both lexical URLs and full email payloads.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--risk-low)] shrink-0 mt-0.5" />
                <span>Deliver 5-stage NLP explainability showing exact text transformations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--risk-low)] shrink-0 mt-0.5" />
                <span>Maintain $\ge 90\%$ accuracy with negligible False Positive Rates on real benchmark datasets.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-3)]">
            Academic Pedigree: Undergraduate InfoSec & NLP Final Project
          </div>
        </div>
      </div>

      {/* NLP & Machine Learning Methodologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-1)] mb-2 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <span>NLP Methodology</span>
          </div>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            The NLP pipeline processes unstructured human text through 5 rigorous preprocessing phases:
            noise removal (regex cleaning of markup and entity masking), case normalization, NLTK Punkt tokenization,
            English stopword pruning, and Porter stemming. Cleaned text is vectorized using TF-IDF n-grams (1-3)
            with sublinear term weighting across an 8,000-feature vocabulary.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-1)] mb-2 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[var(--risk-low)]" />
            <span>Machine Learning Approach</span>
          </div>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            URL analysis utilizes a 150-estimator Random Forest trained on 19 discrete lexical and structural
            features (90.9% accuracy, 0.905 F1). Email classification utilizes a Calibrated Linear Support Vector
            Machine with Platt scaling (98.4% accuracy, 0.984 F1) benchmarked against Naive Bayes and Logistic Regression.
          </p>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs font-semibold text-[var(--text-1)] uppercase tracking-wider">
              Technology Stack
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-3)]">
            Enterprise Architecture
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-[var(--text-1)]">
                {tech.name}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-3)] mt-1 uppercase">
                {tech.cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
