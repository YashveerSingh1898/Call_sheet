"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  User,
  ShieldCheck,
  Clapperboard,
  Sparkles,
  LogOut,
  Mail,
  Calendar,
  Layers,
  Film,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountSidebar() {
  const { user, isAuthenticated, isAccountSidebarOpen, closeAccountSidebar, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAccountSidebarOpen) {
        closeAccountSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAccountSidebarOpen, closeAccountSidebar]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isAccountSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAccountSidebarOpen]);

  if (!isAuthenticated || !user) return null;

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={closeAccountSidebar}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAccountSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer */}
      <aside
        ref={drawerRef}
        aria-label="Director Account Details"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface/95 backdrop-blur-2xl border-l border-accent-amber/30 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isAccountSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-text-muted/15 flex items-center justify-between bg-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-accent-amber/40 flex items-center justify-center text-accent-amber shadow-sm">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent-amber tracking-wider uppercase">
                  DIRECTOR PROFILE
                </span>
                <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse" />
              </div>
              <p className="font-mono text-[10px] text-text-muted">FrameZero Studio Account</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-surface border border-text-muted/20">
              ESC
            </span>
            <button
              type="button"
              onClick={closeAccountSidebar}
              className="p-2 rounded-lg bg-surface hover:bg-surface-raised border border-text-muted/20 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Close Account Details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main User Profile Card */}
          <div className="p-5 rounded-2xl bg-bg/70 border border-accent-teal-bright/30 space-y-4 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal-bright/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4">
              {/* Large Avatar Badge */}
              <div className="w-14 h-14 rounded-2xl bg-surface border-2 border-accent-teal-bright/50 flex items-center justify-center text-accent-teal-bright font-display text-2xl font-bold shadow-lg relative">
                {user.avatar ? (
                  <span className="text-2xl">{user.avatar}</span>
                ) : (
                  <span>{(user.username || user.name || "D").charAt(0).toUpperCase()}</span>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent-teal-bright border-2 border-bg flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-bg" />
                </span>
              </div>

              {/* Identity Details */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-teal-bright/10 border border-accent-teal-bright/30 text-accent-teal-bright font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user.tier || "PRO STUDIO"}</span>
                </div>
                <h3 className="font-display text-lg text-text-primary truncate">
                  {user.name || user.username}
                </h3>
                <p className="font-mono text-xs text-accent-amber font-medium truncate">
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Account Metadata Rows */}
            <div className="pt-3 border-t border-text-muted/15 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Role:</span>
                </span>
                <span className="text-text-primary font-medium">{user.role || "Lead Commercial Director"}</span>
              </div>

              {user.email && (
                <div className="flex items-center justify-between text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent-teal-bright" />
                    <span>Email:</span>
                  </span>
                  <span className="text-text-primary font-medium truncate max-w-[200px]">{user.email}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent-amber" />
                  <span>Member Since:</span>
                </span>
                <span className="text-text-primary font-medium">{user.joinedAt || "September 2026"}</span>
              </div>
            </div>
          </div>

          {/* Autonomous Engine Telemetry */}
          <div className="space-y-2.5">
            <span className="font-mono text-xs text-accent-amber font-semibold uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Studio Engine Privileges</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-bg/50 border border-text-muted/15 space-y-1">
                <span className="text-text-muted text-[10px] block">AI SCRIPTING</span>
                <span className="text-accent-amber font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini Multi-Model
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bg/50 border border-text-muted/15 space-y-1">
                <span className="text-text-muted text-[10px] block">VERTICAL FRAMES</span>
                <span className="text-accent-teal-bright font-bold flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  9:16 Cinematic
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bg/50 border border-text-muted/15 space-y-1">
                <span className="text-text-muted text-[10px] block">VOICE SYNTHESIS</span>
                <span className="text-accent-amber font-bold">ElevenLabs v2</span>
              </div>

              <div className="p-3 rounded-xl bg-bg/50 border border-text-muted/15 space-y-1">
                <span className="text-text-muted text-[10px] block">VIDEO MASTER</span>
                <span className="text-accent-teal-bright font-bold">1080p MP4 Cut</span>
              </div>
            </div>
          </div>

          {/* Quick Studio Navigation */}
          <div className="space-y-2.5 pt-2">
            <span className="font-mono text-xs text-text-primary font-medium uppercase tracking-wider block">
              Quick Shortcuts
            </span>

            <div className="space-y-2">
              <Link
                href="/studio"
                onClick={closeAccountSidebar}
                className="w-full p-3 rounded-xl bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 transition-all flex items-center justify-between shadow-md group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>OPEN AI COMMERCIAL STUDIO</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/overview"
                onClick={closeAccountSidebar}
                className="w-full p-3 rounded-xl bg-surface-raised hover:bg-surface border border-text-muted/20 text-text-primary font-mono text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent-teal-bright" />
                  <span>EXPLORE OVERVIEW HOMEPAGE</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-text-muted/15 bg-bg/40 space-y-3">
          <button
            type="button"
            onClick={logout}
            className="w-full py-3 px-4 rounded-xl bg-surface hover:bg-red-500/10 border border-text-muted/20 hover:border-red-500/40 text-text-muted hover:text-red-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT / SWITCH DIRECTOR</span>
          </button>

          <p className="text-center font-mono text-[10px] text-text-muted/60">
            FrameZero Studio • Autonomous AI Commercial Synthesis
          </p>
        </div>
      </aside>
    </>
  );
}
