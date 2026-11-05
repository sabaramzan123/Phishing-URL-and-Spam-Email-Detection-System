"use client";

import React from "react";
import { FileText, Cpu, Key, Link2 } from "lucide-react";
import { Stat } from "@/components/ui/Stat";

export interface NLPSummaryProps {
  wordCount: number;
  tokensCount: number;
  keywordsCount: number;
  urlsCount?: number;
  type: "email" | "url";
}

export default function NLPSummary({
  wordCount,
  tokensCount,
  keywordsCount,
  urlsCount,
  type,
}: NLPSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
      <Stat
        label={type === "email" ? "Document Word Count" : "URL String Length"}
        value={wordCount}
        subtext={type === "email" ? "Raw words analyzed" : "Total characters evaluated"}
        icon={<FileText className="w-4 h-4" />}
      />

      <Stat
        label={type === "email" ? "Preprocessed Tokens" : "Lexical Features"}
        value={tokensCount}
        subtext={type === "email" ? "Informative tokens after cleaning" : "Security vectors extracted"}
        icon={<Cpu className="w-4 h-4" />}
      />

      <Stat
        label={type === "email" ? "Urgent / Intent Triggers" : "Security Indicator Flags"}
        value={keywordsCount}
        subtext={type === "email" ? "Detected high-risk patterns" : "Active risk flags"}
        trend={keywordsCount > 0 ? "threat" : "safe"}
        icon={<Key className="w-4 h-4" />}
      />

      <Stat
        label={type === "email" ? "Embedded URLs" : "Structural Entropy Score"}
        value={urlsCount ?? 0}
        subtext={type === "email" ? "Scanned nested hyperlinks" : "URL randomness / obfuscation"}
        trend={type === "email" && (urlsCount ?? 0) > 0 ? "threat" : "neutral"}
        icon={<Link2 className="w-4 h-4" />}
      />
    </div>
  );
}
