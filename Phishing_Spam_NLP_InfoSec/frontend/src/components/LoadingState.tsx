"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingState() {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* 2-Column Dashboard Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column Gauge Skeleton (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col items-center justify-between min-h-[340px]">
          <div className="w-full flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex flex-col items-center my-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-5 w-44 mt-4" />
            <Skeleton className="h-3 w-28 mt-2" />
          </div>

          <Skeleton className="h-10 w-full" />
        </div>

        {/* Right Column Indicators Skeleton (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="mt-4 space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] flex items-start gap-3">
                  <Skeleton className="w-4 h-4 rounded mt-1 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-48" />
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-8 w-full mt-4" />
        </div>
      </div>

      {/* 4 Stat Tiles Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
