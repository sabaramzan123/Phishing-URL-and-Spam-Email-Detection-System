"use client";

import React, { useState, useEffect } from "react";
import { Shield, Sun, Moon, RefreshCw, Command, Menu, X } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiOnline: boolean | null;
  onRefreshStatus: () => void;
  onOpenCommand?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  apiOnline,
  onRefreshStatus,
  onOpenCommand,
}: NavbarProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("phishguard-theme") as "dark" | "light" | null;
      const initial = saved || "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch {
      // fallback
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("phishguard-theme", next);
    } catch {}
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems = [
    { id: "scanner", label: "Scanner" },
    { id: "how-it-works", label: "How It Works" },
    { id: "model-performance", label: "Model Performance" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-[var(--border)] bg-[var(--surface-overlay)] backdrop-blur-md transition-colors">
      <div className="w-full max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => setActiveTab("scanner")}
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-[var(--text-1)]">
              PhishGuard
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-3)] border border-[var(--border)]">
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              (item.id === "scanner" && (activeTab === "email" || activeTab === "url"));
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
                  isActive
                    ? "bg-[var(--surface-3)] text-[var(--text-1)] font-semibold"
                    : "text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)]/60"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Command Shortcut Hint */}
          <button
            type="button"
            onClick={onOpenCommand}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[var(--text-3)] bg-[var(--surface-input)] border border-[var(--border)] rounded-md hover:border-[var(--border-strong)] hover:text-[var(--text-2)] transition-colors cursor-pointer"
            title="Keyboard shortcut"
          >
            <Command className="w-3 h-3 text-[var(--text-3)]" />
            <span>Cmd+Enter to Scan</span>
          </button>

          {/* API Status Dot with Tooltip */}
          <Tooltip
            content={
              <div className="flex items-center gap-2">
                <span>
                  {apiOnline === true
                    ? "FastAPI ML Backend: Online (Port 8000)"
                    : apiOnline === false
                    ? "Backend Offline: Run python server.py"
                    : "Connecting to API..."}
                </span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-1 hover:text-[var(--text-1)]"
                  title="Refresh status"
                >
                  <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                </button>
              </div>
            }
          >
            <button
              type="button"
              onClick={handleRefresh}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer",
                apiOnline === true
                  ? "bg-[var(--risk-low-bg)] text-[var(--risk-low)] border-[var(--risk-low-border)]"
                  : apiOnline === false
                  ? "bg-[var(--risk-critical-bg)] text-[var(--risk-critical)] border-[var(--risk-critical-border)]"
                  : "bg-[var(--surface-3)] text-[var(--text-3)] border-[var(--border)]"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  apiOnline === true
                    ? "bg-[var(--risk-low)] animate-pulse-subtle"
                    : apiOnline === false
                    ? "bg-[var(--risk-critical)]"
                    : "bg-[var(--text-3)]"
                )}
              />
              <span className="hidden sm:inline">
                {apiOnline === true ? "API Active" : apiOnline === false ? "Offline" : "Checking"}
              </span>
            </button>
          </Tooltip>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-3)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-2)] hover:text-[var(--text-1)] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-[var(--surface-3)] text-[var(--text-1)] font-semibold"
                  : "text-[var(--text-2)] hover:bg-[var(--surface-3)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
