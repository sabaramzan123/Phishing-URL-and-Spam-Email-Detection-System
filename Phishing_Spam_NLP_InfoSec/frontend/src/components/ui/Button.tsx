"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm hover:shadow active:scale-[0.98]",
      secondary:
        "bg-[var(--surface-3)] hover:bg-[var(--border-strong)] text-[var(--text-1)] border border-[var(--border)]",
      ghost:
        "bg-transparent hover:bg-[var(--surface-3)] text-[var(--text-2)] hover:text-[var(--text-1)]",
      outline:
        "bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-1)] border border-[var(--border-strong)] hover:border-[var(--accent)]",
      danger:
        "bg-[var(--risk-critical)] hover:opacity-90 text-white shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-[15px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

