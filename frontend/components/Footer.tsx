import React from "react";
import { Clapperboard, Sparkles, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-text-muted/15 py-14 bg-bg text-text-muted text-xs relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-text-muted/15">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-surface border border-accent-amber/40 flex items-center justify-center text-accent-amber">
                <Clapperboard className="w-4 h-4" />
              </div>
              <span className="font-display font-semibold text-text-primary tracking-wider text-base uppercase">
                Callsheet Studio
              </span>
            </div>
            <p className="font-body text-xs text-text-muted leading-relaxed max-w-sm">
              The autonomous generative commercial suite. Synthesize high-retention video ads from a single creative brief with Google Gemini, ElevenLabs, and MoviePy.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-accent-teal-bright pt-1">
              <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse" />
              <span>Production Engine v1.0.0 • All Systems Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="font-mono text-xs text-text-primary uppercase tracking-wider block font-medium">
              Navigation
            </span>
            <ul className="space-y-2 font-body text-xs">
              <li>
                <a href="#overview" className="hover:text-accent-amber transition-colors">
                  Overview & Metrics
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-accent-amber transition-colors">
                  4-Stage Architecture
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-accent-amber transition-colors">
                  Director Capabilities
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-accent-amber transition-colors">
                  Campaign Case Studies
                </a>
              </li>
              <li>
                <a href="#3d-studio" className="hover:text-accent-amber transition-colors">
                  3D Cine Rig Suite
                </a>
              </li>
            </ul>
          </div>

          {/* Generator & FAQ */}
          <div className="space-y-2.5">
            <span className="font-mono text-xs text-text-primary uppercase tracking-wider block font-medium">
              Studio & Docs
            </span>
            <ul className="space-y-2 font-body text-xs">
              <li>
                <a href="#generator" className="hover:text-accent-amber transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent-amber" />
                  Launch Generator
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-accent-amber transition-colors">
                  Technical Specifications
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-accent-amber transition-colors">
                  Commercial Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-amber transition-colors flex items-center gap-1 text-accent-amber">
                  <ArrowUp className="w-3 h-3" />
                  Back to Top
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-surface border border-text-muted/15">Gemini 1.5 Pro</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-text-muted/15">ElevenLabs v2</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-text-muted/15">MoviePy 2.0</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-text-muted/15">Three.js WebGL</span>
          </div>

          <p>© {new Date().getFullYear()} Callsheet Studio. Designed for broadcast-grade AI video production.</p>
        </div>
      </div>
    </footer>
  );
}
