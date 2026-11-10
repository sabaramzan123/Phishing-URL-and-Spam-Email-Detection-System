"use client";

import React, { useState } from "react";
import { Copy, Check, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface RawJSONViewerProps {
  data: any;
  title?: string;
  defaultExpanded?: boolean;
}

export default function RawJSONViewer({
  data,
  title = "API Diagnostic Response",
  defaultExpanded = false,
}: RawJSONViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] overflow-hidden shadow-[var(--shadow-card)] transition-colors duration-180">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border)] flex items-center justify-between cursor-pointer select-none hover:bg-[var(--bg-muted)] transition-colors duration-180 gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
          <span className="text-xs font-semibold text-[var(--text-primary)] font-mono truncate">
            {title}
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 hidden sm:inline">
            ({jsonString.length.toLocaleString()} bytes)
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpanded && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              icon={
                copied ? (
                  <Check className="w-3.5 h-3.5 text-[var(--risk-safe)]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
            >
              {copied ? "Copied" : "Copy JSON"}
            </Button>
          )}

          <div className="text-[var(--text-muted)] p-1">
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-180 ease-in-out",
                isExpanded && "rotate-180 text-[var(--accent-primary)]"
              )}
            />
          </div>
        </div>
      </div>

      {/* Code Area */}
      {isExpanded && (
        <div className="p-3 sm:p-4 bg-[var(--bg-input)] max-h-96 overflow-auto font-mono text-xs leading-relaxed text-[var(--text-primary)]">
          <pre className="whitespace-pre overflow-x-auto">{jsonString}</pre>
        </div>
      )}
    </div>
  );
}
