"use client";

import React, { useEffect, useState } from "react";
import { Clapperboard, Cpu, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-b border-text-muted/15 shadow-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber rounded-md"
        >
          <div className="w-8 h-8 rounded bg-surface border border-accent-amber/40 flex items-center justify-center text-accent-amber group-hover:border-accent-amber transition-colors shadow-sm">
            <Clapperboard className="w-4 h-4 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-wider font-semibold text-text-primary uppercase flex items-center gap-1.5">
              Callsheet
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-accent-amber/15 text-accent-amber border border-accent-amber/20">
                PROD
              </span>
            </span>
          </div>
        </a>

        {/* Navigation Anchors for 6 Sheets */}
        <nav className="hidden lg:flex items-center gap-6 text-xs xl:text-sm font-body text-text-muted">
          <a
            href="#overview"
            className="hover:text-text-primary transition-colors hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            Overview
          </a>
          <a
            href="#pipeline"
            className="hover:text-text-primary transition-colors flex items-center gap-1 hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            <Cpu className="w-3.5 h-3.5 opacity-70" />
            Pipeline
          </a>
          <a
            href="#features"
            className="hover:text-text-primary transition-colors hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            Capabilities
          </a>
          <a
            href="#showcase"
            className="hover:text-text-primary transition-colors hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            Case Studies
          </a>
          <a
            href="#generator"
            className="hover:text-text-primary transition-colors flex items-center gap-1 hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            Studio Generator
          </a>
          <a
            href="#faq"
            className="hover:text-text-primary transition-colors hover:text-accent-amber focus:outline-none focus-visible:text-accent-amber"
          >
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Engine Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-text-muted/20 text-xs font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse" />
            <span className="text-text-primary/90">Engine Active</span>
          </div>

          {/* Jump to Generator CTA */}
          <a
            href="#generator"
            className="px-4 py-2 rounded-md bg-accent-amber text-bg font-medium text-xs sm:text-sm hover:bg-accent-amber/90 active:bg-accent-amber/80 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg shadow-sm"
          >
            <span>Launch Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
