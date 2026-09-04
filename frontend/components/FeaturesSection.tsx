"use client";

import React, { useState } from "react";
import {
  Volume2,
  Film,
  Activity,
  Video,
  ShieldCheck,
  Sparkles,
  Sliders,
  Compass,
  ChevronDown,
} from "lucide-react";

interface CapabilityItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBorder: string;
  badgeBg: string;
  specs: string[];
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: "audio-ducking",
    number: "01",
    title: "Smart Audio Ducking & Mixing",
    category: "ACOUSTIC INTELLIGENCE",
    tag: "Studio Mixing",
    description:
      "Automatically analyzes spoken frequency bands and attenuates background soundtracks by -14dB during dialogue, restoring full dynamic volume during cinematic scene transitions.",
    icon: Volume2,
    accentColor: "text-accent-amber",
    accentBorder: "border-accent-amber/40",
    badgeBg: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
    specs: ["-14dB dynamic speech ducking", "Dynamic speech envelope detection", "Stereo AAC 320kbps master"],
  },
  {
    id: "ken-burns",
    number: "02",
    title: "Ken Burns Dynamic Motion Curves",
    category: "CINEMATOGRAPHY",
    tag: "Motion Synthesis",
    description:
      "Calculates organic sub-pixel camera zooms and pan vectors per scene. Transforms high-resolution still frames into flowing, video-like visual narratives with continuous motion.",
    icon: Film,
    accentColor: "text-accent-teal-bright",
    accentBorder: "border-accent-teal-bright/40",
    badgeBg: "bg-accent-teal-bright/10 text-accent-teal-bright border-accent-teal-bright/30",
    specs: ["Sub-pixel continuous zoom curves", "Organic pan vector calculation", "Zero jitter cinematic motion"],
  },
  {
    id: "cadence-sync",
    number: "03",
    title: "Cadence & Pacing Synchronization",
    category: "TEMPORAL ALIGNMENT",
    tag: "Sub-Second Sync",
    description:
      "Synchronizes spoken syllable count with exact visual durations (130-150 words/min), guaranteeing crisp voice-to-cut alignment without awkward audio cutoffs or silence.",
    icon: Activity,
    accentColor: "text-accent-amber",
    accentBorder: "border-accent-amber/40",
    badgeBg: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
    specs: ["130-150 WPM cadence alignment", "Sub-second syllable matching", "Natural conversational pauses"],
  },
  {
    id: "multi-format",
    number: "04",
    title: "Multi-Format Aspect Ratios",
    category: "DISTRIBUTION READY",
    tag: "9:16 & 16:9",
    description:
      "Renders native 9:16 vertical masters for TikTok, Instagram Reels, and YouTube Shorts, with automatic framing adaptation for 16:9 widescreen broadcast and 1:1 square feeds.",
    icon: Video,
    accentColor: "text-accent-teal-bright",
    accentBorder: "border-accent-teal-bright/40",
    badgeBg: "bg-accent-teal-bright/10 text-accent-teal-bright border-accent-teal-bright/30",
    specs: ["Vertical 1080x1920 9:16 native", "16:9 broadcast framing", "1:1 square feed compliance"],
  },
  {
    id: "fallback-resilience",
    number: "05",
    title: "Multi-Model Fallback Resilience",
    category: "INFRASTRUCTURE",
    tag: "Zero Downtime",
    description:
      "Robust failover cascade across Google Gemini models, ElevenLabs/Edge-TTS audio synthesis, and distributed image rendering pipelines ensuring 99.9% generation uptime.",
    icon: ShieldCheck,
    accentColor: "text-accent-amber",
    accentBorder: "border-accent-amber/40",
    badgeBg: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
    specs: ["Multi-model cascade architecture", "Automatic API failover routing", "99.9% operational availability"],
  },
  {
    id: "lighting-arrays",
    number: "06",
    title: "Curated Cinematic Lighting Arrays",
    category: "COLOR SCIENCE",
    tag: "Color Graded",
    description:
      "Applies warm tungsten cine lighting, anamorphic lens flares, and subtle 35mm grain emulation to create a consistent, broadcast-ready aesthetic across all scenes.",
    icon: Sparkles,
    accentColor: "text-accent-teal-bright",
    accentBorder: "border-accent-teal-bright/40",
    badgeBg: "bg-accent-teal-bright/10 text-accent-teal-bright border-accent-teal-bright/30",
    specs: ["Warm tungsten color calibration", "Subtle 35mm film grain texture", "Consistent multi-scene palettes"],
  },
];

export default function FeaturesSection() {
  const [expandedId, setExpandedId] = useState<string>("audio-ducking");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  return (
    <section id="features" className="w-full py-16 md:py-24 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-amber/30 text-accent-amber text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>DIRECTOR-GRADE CAPABILITIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
            Built for Commercial Excellence
          </h2>
          <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
            Every technical detail—from micro-timed audio ducking to sub-pixel camera zooms—is 
            engineered to deliver commercial ads that look and sound like they came from a high-end agency.
          </p>
        </div>

        {/* 6 Vertically Stacked Capability Cards ("One Down One") */}
        <div className="space-y-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isExpanded = expandedId === cap.id;

            return (
              <div
                key={cap.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                  isExpanded
                    ? "bg-surface-raised border-accent-amber/50 shadow-accent-amber/5"
                    : "bg-surface/80 border-text-muted/20 hover:border-text-muted/40 hover:bg-surface"
                }`}
              >
                {/* Clickable Header Bar */}
                <button
                  type="button"
                  onClick={() => toggleExpand(cap.id)}
                  className="w-full p-5 sm:p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-bg border border-text-muted/25 flex items-center justify-center shrink-0">
                      <Icon className={`w-6 h-6 ${cap.accentColor}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${cap.badgeBg}`}>
                          FEATURE {cap.number} / 06
                        </span>
                        <span className="font-mono text-[11px] text-accent-teal-bright uppercase tracking-wider">
                          {"// "}
                          {cap.category}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl text-text-primary font-medium">
                        {cap.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-text-muted line-clamp-1">
                        {cap.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Tag & Expand Toggle */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-text-muted/10 font-mono text-xs text-text-muted">
                    <span className="px-2.5 py-1 rounded bg-bg border border-text-muted/20 text-[11px] text-text-primary">
                      {cap.tag}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-full bg-bg border border-text-muted/20 flex items-center justify-center text-text-muted transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-accent-amber border-accent-amber/40" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Deep Dive Details */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-text-muted/15 space-y-4 animate-fadeIn">
                    <p className="font-body text-sm text-text-primary/90 leading-relaxed max-w-3xl">
                      {cap.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="font-mono text-xs text-text-muted uppercase tracking-wider block">
                        Engine Specifications:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cap.specs.map((spec, i) => (
                          <span
                            key={i}
                            className="font-mono text-xs px-3 py-1 rounded-lg bg-bg border border-text-muted/20 text-text-primary flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal-bright" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-text-muted/10 flex items-center gap-2 text-xs font-mono text-accent-amber">
                      <Sliders className="w-3.5 h-3.5 text-accent-amber" />
                      <span>Calibrated for Commercial Broadcast by Callsheet v1.0</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
