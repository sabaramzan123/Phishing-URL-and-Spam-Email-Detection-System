"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "sample" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[9px] select-none cursor-pointer border transition-all duration-180 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary-focus)] focus-visible:ring-offset-1";

    const variantStyles = {
      primary:
        "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-none hover:bg-[var(--accent-primary-hover)] hover:border-[#104D45] hover:-translate-y-[1px] hover:shadow-[var(--shadow-btn-hover)] active:bg-[var(--accent-primary-active)] active:translate-y-0 active:scale-[0.98]",
      secondary:
        "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-secondary-hover)] active:translate-y-0 active:scale-[0.98]",
      sample:
        "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-hover)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
      outline:
        "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-hover)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
      ghost:
        "bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
      danger:
        "bg-[var(--risk-critical)] border-[var(--risk-critical)] text-white hover:opacity-95 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-[14px] gap-2",
      lg: "h-11 px-5 text-[15px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" /> : icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
