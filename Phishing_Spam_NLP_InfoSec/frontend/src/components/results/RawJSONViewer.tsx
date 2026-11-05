"use client";

import React, { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface RawJSONViewerProps {
  data: any;
  title?: string;
}

export default function RawJSONViewer({ data, title = "Raw API Response Payload" }: RawJSONViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-input)] overflow-hidden shadow-[var(--shadow-sm)]">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-semibold text-[var(--text-1)] font-mono">
            {title}
          </span>
          <span className="text-[10px] font-mono text-[var(--text-3)]">
            ({jsonString.length.toLocaleString()} bytes)
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          icon={copied ? <Check className="w-3.5 h-3.5 text-[var(--risk-low)]" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? "Copied JSON" : "Copy Payload"}
        </Button>
      </div>

      {/* Formatted Code Block */}
      <div className="p-4 max-h-[460px] overflow-auto font-mono text-xs leading-relaxed text-[var(--text-1)] selection:bg-[var(--accent)] selection:text-white">
        <pre className="whitespace-pre">{jsonString}</pre>
      </div>
    </div>
  );
}

