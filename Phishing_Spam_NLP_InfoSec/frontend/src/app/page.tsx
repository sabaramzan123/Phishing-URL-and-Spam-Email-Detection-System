"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ScannerTabs from "@/components/ScannerTabs";
import EmailScanner from "@/components/EmailScanner";
import URLScanner from "@/components/URLScanner";
import ResultCard from "@/components/ResultCard";
import DetectionReasons from "@/components/DetectionReasons";
import PreprocessingComparison from "@/components/PreprocessingComparison";
import URLFeaturesView from "@/components/URLFeaturesView";
import EmbeddedURLsView from "@/components/EmbeddedURLsView";
import RawJSONViewer from "@/components/results/RawJSONViewer";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

// ==========================================
// TYPE DEFINITIONS (Matching Backend Exactly)
// ==========================================

export interface NLPStep {
  step_number: number;
  step_name: string;
  slide_reference?: string;
  description: string;
  before_text: string;
  after_text: string;
  tokens?: string[];
  removed_words?: string[];
}

export interface NLPPipelineStage {
  stage_id: number;
  stage_name: string;
  slide_reference?: string;
  simple_explanation?: string;
  description?: string;
  data?: any;
  steps?: NLPStep[];
  tokens?: string[];
  stemmed_tokens?: string[];
  top_words?: Array<{ word: string; count: number }>;
  feature_summary?: string;
  decision?: string;
  spam_probability?: number;
  normal_probability?: number;
  is_spam?: boolean;
}

export interface EmbeddedURLItem {
  url: string;
  prediction: "SUSPICIOUS" | "SAFE";
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  phishing_probability: number;
  security_indicators: string[];
}

export interface EmailAnalysisResult {
  email_prediction: string;
  is_spam: boolean;
  spam_probability: number;
  nlp_security_indicators: string[];
  urls_found_count: number;
  urls_results: EmbeddedURLItem[];
  combined_summary: string;
  preprocessed_text: string;
  nlp_pipeline?: NLPPipelineStage[];
}

export interface URLAnalysisResult {
  url: string;
  prediction: "SUSPICIOUS" | "SAFE";
  phishing_probability: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risk_level_disclaimer: string;
  security_indicators: string[];
  features: Record<string, number>;
  explanation: string;
  nlp_pipeline?: NLPPipelineStage[];
}

// ==========================================
// RESILIENT API CLIENT
// ==========================================

const getApiBaseCandidates = () => {
  if (typeof window !== "undefined") {
    return ["", "http://127.0.0.1:8000", "http://localhost:8000"];
  }
  return ["http://127.0.0.1:8000", "http://localhost:8000"];
};

async function fetchFromApi(path: string, options: RequestInit = {}): Promise<Response> {
  const candidates = getApiBaseCandidates();
  let lastError: unknown = null;

  for (const base of candidates) {
    try {
      const url = base ? `${base}${path}` : path;
      const res = await fetch(url, options);
      return res;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Failed to connect to backend on port 8000.");
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Home() {
  // Scanner Mode: Email vs URL
  const [scannerMode, setScannerMode] = useState<"email" | "url">("email");

  // Email Scanner State
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailResult, setEmailResult] = useState<EmailAnalysisResult | null>(null);

  // URL Scanner State
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlResult, setUrlResult] = useState<URLAnalysisResult | null>(null);

  // Global Backend Status State
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Check Backend Status
  const checkBackendStatus = useCallback(async () => {
    try {
      const res = await fetchFromApi("/api/status");
      if (res.ok) {
        setApiOnline(true);
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  }, []);

  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);

  // Analyze Email
  const handleAnalyzeEmail = async () => {
    if (!emailSubject.trim() && !emailBody.trim()) return;

    setEmailLoading(true);
    setEmailError(null);
    setEmailResult(null);

    try {
      const res = await fetchFromApi("/api/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Unable to analyze this input.");
      }

      const data: EmailAnalysisResult = await res.json();
      setEmailResult(data);
      setApiOnline(true);
    } catch (err: any) {
      console.warn("Email analysis notice:", err);
      const msg = err?.message || "Failed to analyze email content.";
      setEmailError(msg);
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setApiOnline(false);
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // Analyze URL
  const handleAnalyzeUrl = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || urlInput).trim();
    if (!targetUrl) return;

    setUrlLoading(true);
    setUrlError(null);
    setUrlResult(null);

    try {
      const res = await fetchFromApi("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Unable to analyze this input.");
      }

      const data: URLAnalysisResult = await res.json();
      setUrlResult(data);
      setApiOnline(true);
    } catch (err: any) {
      console.warn("URL analysis notice:", err);
      const msg = err?.message || "Failed to analyze target URL.";
      setUrlError(msg);
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setApiOnline(false);
      }
    } finally {
      setUrlLoading(false);
    }
  };

  const handleClear = () => {
    if (scannerMode === "email") {
      setEmailSubject("");
      setEmailBody("");
      setEmailResult(null);
      setEmailError(null);
    } else {
      setUrlInput("");
      setUrlResult(null);
      setUrlError(null);
    }
  };

  // Intermediate NLP steps from email result
  const emailNlpSteps = emailResult?.nlp_pipeline?.find((s) => s.stage_id === 2)?.steps || [];
  const tfidfSummary = emailResult?.nlp_pipeline?.find((s) => s.stage_id === 3)?.feature_summary;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* 1. Header Navigation */}
      <Navbar apiOnline={apiOnline} onRefreshStatus={checkBackendStatus} />

      {/* 2. Main Content Container (max-width: 1100px) */}
      <main className="app-container flex-1 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-6">
        {/* Title & Segmented Scanner Switcher */}
        <ScannerTabs
          scannerMode={scannerMode}
          setScannerMode={(mode) => {
            setScannerMode(mode);
            setEmailError(null);
            setUrlError(null);
          }}
        />

        {/* Input Form Section */}
        <section aria-label="Input Scanner Section">
          {scannerMode === "email" ? (
            <EmailScanner
              subject={emailSubject}
              setSubject={setEmailSubject}
              body={emailBody}
              setBody={setEmailBody}
              onAnalyze={handleAnalyzeEmail}
              loading={emailLoading}
              onClear={handleClear}
            />
          ) : (
            <URLScanner
              url={urlInput}
              setUrl={setUrlInput}
              onAnalyze={handleAnalyzeUrl}
              loading={urlLoading}
              onClear={handleClear}
            />
          )}
        </section>

        {/* Error Alert Banner */}
        {((scannerMode === "email" && emailError) || (scannerMode === "url" && urlError)) && (
          <div
            role="alert"
            className="p-3.5 sm:p-4 rounded-[10px] bg-[var(--risk-critical-bg)] border border-[var(--risk-critical-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-180"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[var(--risk-critical)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[var(--risk-critical)]">
                  Analysis Failed
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-normal">
                  {scannerMode === "email" ? emailError : urlError}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={scannerMode === "email" ? handleAnalyzeEmail : () => handleAnalyzeUrl()}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="self-end sm:self-auto shrink-0"
            >
              Retry Scan
            </Button>
          </div>
        )}

        {/* Loading State */}
        {((scannerMode === "email" && emailLoading) || (scannerMode === "url" && urlLoading)) && (
          <LoadingState />
        )}

        {/* ============================================================== */}
        {/* DETECTION RESULTS: EMAIL ANALYSIS                              */}
        {/* ============================================================== */}
        {scannerMode === "email" && !emailLoading && emailResult && (
          <section aria-label="Email Analysis Results" className="space-y-5 sm:space-y-6 pt-1 sm:pt-2">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--border)] gap-1">
              <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text-primary)]">
                Email Analysis Results
              </h2>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Classifier: Linear SVM + TF-IDF (1-2 Grams)
              </span>
            </div>

            {/* A & B: Main Classification Verdict & Detection Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              {/* Classification Verdict Card (5 cols) */}
              <div className="lg:col-span-5">
                <ResultCard
                  prediction={emailResult.email_prediction}
                  isThreat={emailResult.is_spam}
                  riskScore={emailResult.spam_probability}
                  type="email"
                  explanation={emailResult.combined_summary}
                />
              </div>

              {/* Detection Findings (7 cols) */}
              <div className="lg:col-span-7">
                <DetectionReasons
                  indicators={emailResult.nlp_security_indicators}
                  explanation={emailResult.combined_summary}
                  isThreat={emailResult.is_spam}
                />
              </div>
            </div>

            {/* E: Embedded URLs (if any discovered in email) */}
            {emailResult.urls_results && emailResult.urls_results.length > 0 && (
              <EmbeddedURLsView
                urls={emailResult.urls_results}
                combinedExplanation={emailResult.combined_summary}
              />
            )}

            {/* C: 5-Stage NLP Preprocessing Pipeline */}
            <PreprocessingComparison
              rawText={`${emailSubject}\n\n${emailBody}`.trim()}
              cleanedText={emailResult.preprocessed_text}
              steps={emailNlpSteps}
              featureSummary={tfidfSummary}
            />

            {/* Diagnostic Raw JSON Payload */}
            <RawJSONViewer
              data={emailResult}
              title="POST /api/analyze-email JSON Payload"
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* DETECTION RESULTS: URL ANALYSIS                                */}
        {/* ============================================================== */}
        {scannerMode === "url" && !urlLoading && urlResult && (
          <section aria-label="URL Analysis Results" className="space-y-5 sm:space-y-6 pt-1 sm:pt-2">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--border)] gap-1">
              <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text-primary)]">
                URL Analysis Results
              </h2>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Classifier: Random Forest (150 Trees, 19 Features)
              </span>
            </div>

            {/* A & B: Main Classification Verdict & Detection Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              {/* Classification Verdict Card (5 cols) */}
              <div className="lg:col-span-5">
                <ResultCard
                  prediction={
                    urlResult.prediction === "SUSPICIOUS" ? "PHISHING / MALICIOUS" : "LEGITIMATE / SAFE"
                  }
                  isThreat={urlResult.prediction === "SUSPICIOUS"}
                  riskScore={urlResult.phishing_probability}
                  type="url"
                  explanation={urlResult.explanation}
                />
              </div>

              {/* Detection Findings (7 cols) */}
              <div className="lg:col-span-7">
                <DetectionReasons
                  indicators={urlResult.security_indicators}
                  explanation={urlResult.explanation}
                  isThreat={urlResult.prediction === "SUSPICIOUS"}
                />
              </div>
            </div>

            {/* D: 19 Lexical & Structural Features Matrix */}
            <URLFeaturesView
              url={urlResult.url}
              features={urlResult.features || {}}
            />

            {/* Diagnostic Raw JSON Payload */}
            <RawJSONViewer
              data={urlResult}
              title="POST /api/analyze-url JSON Payload"
            />
          </section>
        )}

        {/* Empty State */}
        {((scannerMode === "email" && !emailLoading && !emailResult) ||
          (scannerMode === "url" && !urlLoading && !urlResult)) && <EmptyState />}
      </main>

      {/* 3. Minimal Academic Footer */}
      <footer className="w-full border-t border-[var(--border)] py-4 mt-auto bg-[var(--bg-card)]">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
          <div>
            <span className="font-semibold text-[var(--text-primary)]">PhishGuard</span>
            <span> — Academic NLP &amp; Machine Learning Phishing Detection System</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--text-muted)]">
            <span>FastAPI :8000</span>
            <span>•</span>
            <span>Next.js 16 App Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
