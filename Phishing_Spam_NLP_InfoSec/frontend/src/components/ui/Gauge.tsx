"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface GaugeProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
}

export function Gauge({
  value,
  size = 140,
  strokeWidth = 12,
  className,
  showValue = true,
}: GaugeProps) {
  const [displayVal, setDisplayVal] = useState(0);

  // Smooth count-up animation for numbers
  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, value));
    let start = 0;
    const duration = 650; // ms
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const stepValue = clamped / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= clamped) {
        setDisplayVal(clamped);
        clearInterval(timer);
      } else {
        setDisplayVal(Math.round(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semicircle / arc: using 240 degrees (leaving a 120 degree open bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, displayVal))) / 100;

  // Determine color based on 4-tier risk model
  const getColor = (v: number) => {
    if (v >= 85) return "var(--risk-critical)";
    if (v >= 60) return "var(--risk-high)";
    if (v >= 30) return "var(--risk-med)";
    return "var(--risk-low)";
  };

  const currentColor = getColor(value);

  return (
    <div className={cn("relative inline-flex flex-col items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-135 origin-center"
      >
        {/* Background track arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface-3)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
        />
        {/* Animated active score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Center Score Display */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span
            className="text-3xl font-extrabold tracking-tight tabular-nums transition-colors duration-200"
            style={{ color: currentColor }}
          >
            {displayVal.toFixed(0)}%
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-3)] mt-0.5">
            Risk Score
          </span>
        </div>
      )}
    </div>
  );
}

