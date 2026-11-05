"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const variantStyles = {
    default: "bg-[var(--surface-2)] border border-[var(--border)]",
    elevated: "bg-[var(--surface-2)] border border-[var(--border-strong)] shadow-[var(--shadow-md)]",
    interactive:
      "bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200 cursor-pointer",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 text-[var(--text-1)] backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-[var(--text-1)] tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--text-3)] mt-0.5", className)} {...props}>
      {children}
    </p>
  );
}

