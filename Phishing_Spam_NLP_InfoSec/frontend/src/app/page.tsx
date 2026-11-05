"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ScannerTabs from "@/components/ScannerTabs";
import EmailScanner from "@/components/EmailScanner";
import URLScanner from "@/components/URLScanner";
import ResultCard from "@/components/ResultCard";
import DetectionReasons from "@/components/DetectionReasons";
import NLPSummary from "@/components/NLPSummary";
import PreprocessingComparison from "@/components/PreprocessingComparison";
import URLFeaturesView from "@/components/URLFeaturesView";
import RawJSONViewer from "@/components/results/RawJSONViewer";
import ModelPerformanceView from "@/components/ModelPerformanceView";
import HowItWorksView from "@/components/HowItWorksView";
import AboutView from "@/components/AboutView";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import {
  AlertCircle,
  RefreshCw,
  Code2,
  Sliders,
  Layers,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  accuracy_pct?: string;
  test_results?: string;
  deployment_status?: string;
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

// ==========================================
// RESILIENT API CLIENT
// ==========================================

const getApiBaseCandidates = () => {
  if (typeof window !== "undefined") {
    // 1. Next.js proxy rewrite (same-origin /api/..., zero CORS issues)
    // 2. Direct 127.0.0.1:8000 (IPv4 direct to avoid Windows IPv6 localhost conflicts)
    // 3. Direct localhost:8000
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
  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<string>("scanner");
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

  // Result Sub-Tabs State: 1. Overview | 2. Features & NLP | 3. Threat Indicators | 4. Raw JSON
  const [activeResultTab, setActiveResultTab] = useState<"overview" | "features" | "indicators" | "raw">("overview");

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

  // Handle Tab Switch
  const handleNavChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "email" || tab === "url") {
      setScannerMode(tab);
      setActiveNavTab("scanner");
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Switch scanner mode from segmented tabs on scanner view
  const handleScannerModeChange = (mode: "email" | "url") => {
    setScannerMode(mode);
    setActiveNavTab("scanner");
  };

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
      setActiveResultTab("overview");
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
      setActiveResultTab("overview");
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

  // Helpers to clear
  const handleClearEmail = () => {
    setEmailSubject("");
    setEmailBody("");
    setEmailResult(null);
    setEmailError(null);
  };

  const handleClearUrl = () => {
    setUrlInput("");
    setUrlResult(null);
    setUrlError(null);
  };

  // Performance query callback for ModelPerformanceView
  const fetchPerformanceData = async () => {
    const res = await fetchFromApi("/api/model-performance");
    if (!res.ok) throw new Error("Could not retrieve model performance metrics.");
    return await res.json();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-1)] text-[var(--text-1)] selection:bg-[var(--accent)] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={handleNavChange}
        apiOnline={apiOnline}
        onRefreshStatus={checkBackendStatus}
      />

      {/* 2. Main Centered 1200px Container */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        {/* ============================================================== */}
        {/* VIEW 1: SCANNER DASHBOARD                                       */}
        {/* ============================================================== */}
        {activeNavTab === "scanner" && (
          <div className="w-full space-y-8">
            {/* Hero Header & Segmented Scanner Switcher */}
            <ScannerTabs
              scannerMode={scannerMode}
              setScannerMode={handleScannerModeChange}
            />

            {/* SCANNER INPUT CARD */}
            <div className="w-full">
              {scannerMode === "email" ? (
                <EmailScanner
                  subject={emailSubject}
                  setSubject={setEmailSubject}
                  body={emailBody}
                  setBody={setEmailBody}
                  onAnalyze={handleAnalyzeEmail}
                  loading={emailLoading}
                  onClear={handleClearEmail}
                />
              ) : (
                <URLScanner
                  url={urlInput}
                  setUrl={setUrlInput}
                  onAnalyze={handleAnalyzeUrl}
                  loading={urlLoading}
                  onClear={handleClearUrl}
                />
              )}
            </div>

            {/* ERROR ALERT WITH RETRY */}
            {((scannerMode === "email" && emailError) || (scannerMode === "url" && urlError)) && (
              <div
                role="alert"
                className="w-full p-4 rounded-xl bg-[var(--risk-critical-bg)] border border-[var(--risk-critical-border)] text-xs text-[var(--risk-critical)] flex items-center justify-between gap-3 animate-in fade-in-50 duration-200 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    {scannerMode === "email" ? emailError : urlError}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={scannerMode === "email" ? handleAnalyzeEmail : () => handleAnalyzeUrl()}
                  icon={<RefreshCw className="w-3 h-3" />}
                >
                  Retry Scan
                </Button>
              </div>
            )}

            {/* LOADING STATE SKELETON */}
            {((scannerMode === "email" && emailLoading) || (scannerMode === "url" && urlLoading)) && (
              <div className="w-full">
                <LoadingState />
              </div>
            )}

            {/* RESULTS SECTION: EMAIL */}
            {scannerMode === "email" && !emailLoading && emailResult && (
              <section aria-live="polite" className="w-full space-y-6 animate-in fade-in-50 duration-200">
                {/* Result Navigation Sub-Tabs (4 Tabs: Overview | Features & NLP | Threat Indicators | Raw JSON) */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] flex-wrap gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveResultTab("overview")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "overview"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Overview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("features")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "features"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <Layers className="w-4 h-4" />
                      <span>NLP Preprocessing (5 Steps)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("indicators")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "indicators"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Threat Indicators ({emailResult.nlp_security_indicators.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("raw")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "raw"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Raw JSON</span>
                    </button>
                  </div>

                  <span className="text-xs font-mono text-[var(--text-3)] hidden md:inline">
                    Classifier: Linear SVM + TF-IDF (1-3 Grams)
                  </span>
                </div>

                {/* Sub-Tab 1: Overview Dashboard */}
                {activeResultTab === "overview" && (
                  <div className="space-y-6">
                    {/* Master 2-Column Result Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Left Column: Semicircular Risk Gauge & Verdict (5 cols) */}
                      <div className="lg:col-span-5">
                        <ResultCard
                          prediction={emailResult.email_prediction}
                          isThreat={emailResult.is_spam}
                          riskScore={emailResult.spam_probability}
                          type="email"
                          explanation={emailResult.combined_summary}
                        />
                      </div>

                      {/* Right Column: Severity-Ranked Indicators (7 cols) */}
                      <div className="lg:col-span-7">
                        <DetectionReasons
                          indicators={emailResult.nlp_security_indicators}
                          explanation={emailResult.combined_summary}
                          isThreat={emailResult.is_spam}
                        />
                      </div>
                    </div>

                    {/* 4 KPI Security Statistics */}
                    <NLPSummary
                      wordCount={`${emailSubject} ${emailBody}`.trim().split(/\s+/).filter(Boolean).length}
                      tokensCount={
                        emailResult.nlp_pipeline?.find((s) => s.stage_id === 2)?.steps?.[2]?.tokens?.length ??
                        emailResult.preprocessed_text.split(/\s+/).filter(Boolean).length
                      }
                      keywordsCount={emailResult.nlp_security_indicators.length}
                      urlsCount={emailResult.urls_found_count ?? emailResult.urls_results?.length ?? 0}
                      type="email"
                    />
                  </div>
                )}

                {/* Sub-Tab 2: Features & NLP Preprocessing */}
                {activeResultTab === "features" && (
                  <div className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                    <PreprocessingComparison
                      rawText={`${emailSubject}\n\n${emailBody}`.trim()}
                      cleanedText={emailResult.preprocessed_text}
                      steps={emailResult.nlp_pipeline?.find((s) => s.stage_id === 2)?.steps || []}
                    />
                  </div>
                )}

                {/* Sub-Tab 3: Threat Indicators Deep Dive */}
                {activeResultTab === "indicators" && (
                  <div className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                    <DetectionReasons
                      indicators={emailResult.nlp_security_indicators}
                      explanation={emailResult.combined_summary}
                      isThreat={emailResult.is_spam}
                    />
                  </div>
                )}

                {/* Sub-Tab 4: Raw JSON Viewer */}
                {activeResultTab === "raw" && (
                  <RawJSONViewer
                    data={emailResult}
                    title="POST /api/analyze-email Response"
                  />
                )}
              </section>
            )}

            {/* RESULTS SECTION: URL */}
            {scannerMode === "url" && !urlLoading && urlResult && (
              <section aria-live="polite" className="w-full space-y-6 animate-in fade-in-50 duration-200">
                {/* Result Navigation Sub-Tabs (4 Tabs: Overview | Features & NLP | Threat Indicators | Raw JSON) */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] flex-wrap gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveResultTab("overview")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "overview"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Overview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("features")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "features"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <Sliders className="w-4 h-4" />
                      <span>19 Lexical Features</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("indicators")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "indicators"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Security Indicators ({urlResult.security_indicators.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveResultTab("raw")}
                      className={cn(
                        "h-10 px-4 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2",
                        activeResultTab === "raw"
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                          : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Raw JSON</span>
                    </button>
                  </div>

                  <span className="text-xs font-mono text-[var(--text-3)] hidden md:inline">
                    Classifier: Random Forest (150 Trees, 19 Features)
                  </span>
                </div>

                {/* Sub-Tab 1: Overview Dashboard */}
                {activeResultTab === "overview" && (
                  <div className="space-y-6">
                    {/* Master 2-Column Result Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Left Column: Semicircular Risk Gauge & Verdict (5 cols) */}
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

                      {/* Right Column: Severity-Ranked Indicators (7 cols) */}
                      <div className="lg:col-span-7">
                        <DetectionReasons
                          indicators={urlResult.security_indicators}
                          explanation={urlResult.explanation}
                          isThreat={urlResult.prediction === "SUSPICIOUS"}
                        />
                      </div>
                    </div>

                    {/* 4 KPI Security Statistics */}
                    <NLPSummary
                      wordCount={urlResult.url.length}
                      tokensCount={Object.keys(urlResult.features || {}).length}
                      keywordsCount={urlResult.security_indicators?.length ?? 0}
                      urlsCount={Object.keys(urlResult.features || {}).length}
                      type="url"
                    />
                  </div>
                )}

                {/* Sub-Tab 2: 19 Lexical Features Matrix */}
                {activeResultTab === "features" && (
                  <div className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                    <URLFeaturesView
                      url={urlResult.url}
                      features={urlResult.features || {}}
                    />
                  </div>
                )}

                {/* Sub-Tab 3: Threat Indicators Deep Dive */}
                {activeResultTab === "indicators" && (
                  <div className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                    <DetectionReasons
                      indicators={urlResult.security_indicators}
                      explanation={urlResult.explanation}
                      isThreat={urlResult.prediction === "SUSPICIOUS"}
                    />
                  </div>
                )}

                {/* Sub-Tab 4: Raw JSON Viewer */}
                {activeResultTab === "raw" && (
                  <RawJSONViewer
                    data={urlResult}
                    title="POST /api/analyze-url Response"
                  />
                )}
              </section>
            )}

            {/* EMPTY STATE */}
            {((scannerMode === "email" && !emailLoading && !emailResult) ||
              (scannerMode === "url" && !urlLoading && !urlResult)) && (
              <div className="w-full">
                <EmptyState />
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: HOW IT WORKS ARCHITECTURE                               */}
        {/* ============================================================== */}
        {activeNavTab === "how-it-works" && (
          <div className="w-full">
            <HowItWorksView />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: MODEL PERFORMANCE & BENCHMARKS                          */}
        {/* ============================================================== */}
        {activeNavTab === "model-performance" && (
          <div className="w-full">
            <ModelPerformanceView fetchPerformance={fetchPerformanceData} />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: ABOUT PAGE                                              */}
        {/* ============================================================== */}
        {activeNavTab === "about" && (
          <div className="w-full">
            <AboutView />
          </div>
        )}
      </main>

      {/* 3. Minimal Enterprise Footer */}
      <footer className="w-full border-t border-[var(--border)] py-6 mt-auto bg-[var(--surface-overlay)]">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-3)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-semibold text-[var(--text-2)]">PhishGuard Security Intelligence</span>
            <span>—</span>
            <span>NLP & Information Security Threat Analysis System</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>FastAPI Backend :8000</span>
            <span>•</span>
            <span>Next.js 16 App Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
