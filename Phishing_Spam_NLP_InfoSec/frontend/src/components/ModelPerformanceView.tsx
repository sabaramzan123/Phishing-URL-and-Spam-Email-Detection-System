"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, RefreshCw, Database, Layers, ShieldCheck, AlertTriangle } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import ConfusionMatrix from "./performance/ConfusionMatrix";
import ModelComparison, { type ModelComparisonItem } from "./performance/ModelComparison";
import { cn } from "@/lib/utils";

export interface ConfusionMatrixData {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

export interface ClassifierMetric {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: ConfusionMatrixData;
}

export interface ModelPerformanceData {
  url_model: {
    model_name: string;
    test_samples: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: ConfusionMatrixData;
  };
  nlp_classifiers: ClassifierMetric[];
  dataset_info: {
    url_dataset: string;
    email_dataset: string;
    tfidf_config: string;
    test_split: string;
  };
}

export default function ModelPerformanceView({
  fetchPerformance,
}: {
  fetchPerformance: () => Promise<ModelPerformanceData | null>;
}) {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("Linear SVM");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPerformance();
      if (res) {
        setData(res);
      } else {
        setError("Failed to load model performance metrics.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Consolidate all 4 models for comparisons
  const allModels: ModelComparisonItem[] = React.useMemo(() => {
    if (!data) return [];
    return [
      {
        name: "Random Forest (URL)",
        type: "URL Lexical",
        accuracy: data.url_model.accuracy,
        precision: data.url_model.precision,
        recall: data.url_model.recall,
        f1_score: data.url_model.f1_score,
        samples: data.url_model.test_samples,
      },
      ...data.nlp_classifiers.map((clf) => ({
        name: clf.name,
        type: "Email NLP",
        accuracy: clf.accuracy,
        precision: clf.precision,
        recall: clf.recall,
        f1_score: clf.f1_score,
        samples: clf.confusion_matrix.tn + clf.confusion_matrix.fp + clf.confusion_matrix.fn + clf.confusion_matrix.tp,
      })),
    ];
  }, [data]);

  const activeModel = allModels.find((m) => m.name === selectedModel) || allModels[0];

  // Get active model's confusion matrix
  const activeCM: ConfusionMatrixData = React.useMemo(() => {
    if (!data) return { tn: 0, fp: 0, fn: 0, tp: 0 };
    if (selectedModel.startsWith("Random Forest")) {
      return data.url_model.confusion_matrix;
    }
    const match = data.nlp_classifiers.find((c) => c.name === selectedModel);
    return match ? match.confusion_matrix : data.nlp_classifiers[0].confusion_matrix;
  }, [data, selectedModel]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-1)]">
              Model Performance & Benchmark Evaluation
            </h2>
          </div>
          <p className="text-xs text-[var(--text-2)] mt-0.5 max-w-2xl leading-relaxed">
            Evaluation on stratified 20% held-out test splits across 62,528 URLs and 50,000 processed emails.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Benchmarks
        </Button>
      </div>

      {loading && !data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {error && !data && (
        <div className="p-6 rounded-xl border border-[var(--risk-critical-border)] bg-[var(--risk-critical-bg)] text-xs text-[var(--risk-critical)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error} (Ensure FastAPI backend is running on port 8000).</span>
          </div>
          <Button variant="secondary" size="sm" onClick={loadData}>
            Retry
          </Button>
        </div>
      )}

      {data && activeModel && (
        <>
          {/* Active Model KPI Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat
              label="Test Accuracy"
              value={`${(activeModel.accuracy * 100).toFixed(2)}%`}
              subtext="Overall correct predictions"
              trend="safe"
            />
            <Stat
              label="Precision"
              value={`${(activeModel.precision * 100).toFixed(2)}%`}
              subtext="True threats / Total flagged"
              trend="safe"
            />
            <Stat
              label="Recall (Sensitivity)"
              value={`${(activeModel.recall * 100).toFixed(2)}%`}
              subtext="True threats detected"
              trend="safe"
            />
            <Stat
              label="F1-Score (Harmonic Mean)"
              value={(activeModel.f1_score * 100).toFixed(2)}
              subtext={`Evaluated on ${activeModel.samples.toLocaleString()} test samples`}
              trend="safe"
            />
          </div>

          {/* Confusion Matrix Heatmap & Comparison Chart Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 6 cols: Confusion Matrix Heatmap */}
            <div className="lg:col-span-6">
              <ConfusionMatrix
                tn={activeCM.tn}
                fp={activeCM.fp}
                fn={activeCM.fn}
                tp={activeCM.tp}
                modelName={selectedModel}
              />
            </div>

            {/* Right 6 cols: Model Comparison Bar Chart */}
            <div className="lg:col-span-6">
              <ModelComparison
                models={allModels}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
            </div>
          </div>

          {/* Dataset Provenance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
              <Database className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[var(--text-1)] block">
                  URL Training Corpus
                </span>
                <p className="text-[11px] text-[var(--text-2)] mt-0.5 leading-relaxed">
                  {data.dataset_info.url_dataset}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
              <Layers className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[var(--text-1)] block">
                  Email NLP Vectorization Pipeline
                </span>
                <p className="text-[11px] text-[var(--text-2)] mt-0.5 leading-relaxed">
                  {data.dataset_info.tfidf_config} ({data.dataset_info.test_split})
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
