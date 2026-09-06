"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="overview" className="relative w-full pt-20 pb-12 md:pt-28 md:pb-16">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[500px] h-80 bg-accent-amber/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-60 h-60 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Pre-title Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-accent-amber/30 text-accent-amber text-xs font-mono uppercase tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Autonomous Commercial Pipeline</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-text-primary leading-[1.08] text-balance">
          One single brief. <br className="hidden sm:inline" />
          <span className="italic text-accent-amber font-serif font-light">A broadcast-ready</span> production.
        </h1>

        {/* Rich Description */}
        <p className="font-body text-base sm:text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl mx-auto text-balance">
          FrameZero replaces the traditional weeks-long commercial production cycle with a 
          multimodal generative suite. Simply provide your product name and a creative premise. 
          Our autonomous orchestrator directs the narrative script, synthesizes high-fidelity 
          cinematic visuals, records studio-quality emotive voiceover, aligns audio pacing, and cuts 
          together a polished, broadcast-grade commercial in under sixty seconds.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-accent-amber text-bg font-semibold text-sm hover:bg-accent-amber/90 active:bg-accent-amber/80 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg shadow-md"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Open AI Studio & Create Ad</span>
          </Link>
          <a
            href="#pipeline"
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-surface hover:bg-surface-raised border border-text-muted/30 text-text-primary text-sm font-medium transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber shadow-sm"
          >
            <span>Explore 4-Stage Engine</span>
            <ArrowDown className="w-4 h-4 text-text-muted" />
          </a>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 max-w-3xl mx-auto border-t border-text-muted/15">
          <div className="p-4 rounded-lg bg-surface/50 border border-text-muted/15 text-left">
            <span className="block font-mono text-2xl sm:text-3xl font-bold text-accent-amber">&lt;60s</span>
            <span className="font-body text-xs text-text-muted mt-1 block">Full Render Turnaround</span>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-text-muted/15 text-left">
            <span className="block font-mono text-2xl sm:text-3xl font-bold text-text-primary">4-Stage</span>
            <span className="font-body text-xs text-text-muted mt-1 block">Multimodal Engine</span>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-text-muted/15 text-left">
            <span className="block font-mono text-2xl sm:text-3xl font-bold text-accent-teal-bright">1080p</span>
            <span className="font-body text-xs text-text-muted mt-1 block">Vertical 9:16 Master</span>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-text-muted/15 text-left">
            <span className="block font-mono text-2xl sm:text-3xl font-bold text-text-primary">100%</span>
            <span className="font-body text-xs text-text-muted mt-1 block">Automated Assembly</span>
          </div>
        </div>
      </div>
    </section>
  );
}
