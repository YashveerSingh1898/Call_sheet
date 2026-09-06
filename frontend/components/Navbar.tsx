"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, ArrowUpRight, Sparkles, User, LogOut, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoaded, openAccountSidebar } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isStudio = pathname === "/studio";
  const isOverview = pathname === "/overview";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isOverview
          ? "bg-bg/90 backdrop-blur-md border-b border-text-muted/15 shadow-xl py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={isAuthenticated ? "/overview" : "/"}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber rounded-md"
        >
          <div className="w-8 h-8 rounded bg-surface border border-accent-amber/40 flex items-center justify-center text-accent-amber group-hover:border-accent-amber transition-colors shadow-sm">
            <Clapperboard className="w-4 h-4 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-wider font-semibold text-text-primary uppercase flex items-center gap-1.5">
              FrameZero
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-accent-amber/15 text-accent-amber border border-accent-amber/20">
                STUDIO
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs xl:text-sm font-body text-text-muted">
          <Link
            href="/overview"
            className={`transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:text-accent-amber ${
              isOverview
                ? "text-accent-amber font-semibold"
                : "hover:text-text-primary hover:text-accent-amber"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/studio"
            className={`transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:text-accent-amber ${
              isStudio
                ? "text-accent-amber font-semibold"
                : "hover:text-text-primary hover:text-accent-amber"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            <span>AI Studio</span>
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* User Auth Section */}
          {isLoaded && isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* Clickable Director Account Profile Trigger */}
              <button
                type="button"
                onClick={openAccountSidebar}
                title="Open Director Profile & Account Details"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-raised border border-accent-teal-bright/30 hover:border-accent-teal-bright transition-all shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-accent-teal-bright/20 border border-accent-teal-bright/40 flex items-center justify-center text-accent-teal-bright text-[10px] font-bold font-mono">
                  {(user.username || user.name || "D").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] sm:max-w-[130px] truncate text-xs font-mono text-text-primary group-hover:text-accent-teal-bright transition-colors font-medium">
                  @{user.username || user.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-teal-bright animate-pulse" />
              </button>

              {/* Quick Sign Out Button */}
              <button
                type="button"
                onClick={logout}
                title="Sign out of director account"
                className="p-1.5 rounded-md hover:bg-surface text-text-muted hover:text-red-400 border border-transparent hover:border-text-muted/20 transition-colors cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : isLoaded && !isAuthenticated ? (
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md font-mono text-xs transition-all flex items-center gap-1.5 text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-text-muted/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          ) : null}

          {/* Launch Studio CTA */}
          {!isStudio ? (
            <Link
              href="/studio"
              className="px-4 py-2 rounded-md bg-accent-amber text-bg font-medium text-xs sm:text-sm hover:bg-accent-amber/90 active:bg-accent-amber/80 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg shadow-sm"
            >
              <span>AI Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-accent-teal-bright/30 text-xs font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse" />
              <span className="text-text-primary font-medium">Studio Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
