"use client";

import React, { useState } from "react";
import { Zap, Film, Mic, Layers, Cpu, CheckCircle2, Clock, Terminal, ChevronDown } from "lucide-react";

interface PipelineStageData {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBg: string;
  borderHover: string;
  latency: string;
  model: string;
  description: string;
  deliverables: string[];
  consoleSnippet: string;
}

const STAGES: PipelineStageData[] = [
  {
    id: "script",
    stepNumber: "01",
    title: "Neural Screenwriting",
    subtitle: "Narrative synthesis, scene manifests & director prompt engineering",
    badge: "GEMINI 1.5 PRO",
    icon: Zap,
    accentColor: "text-accent-amber",
    accentBg: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber",
    borderHover: "hover:border-accent-amber/50",
    latency: "3.2s avg",
    model: "gemini-1.5-flash / gemini-3.1-flash-lite",
    description:
      "Analyzes the product brand identity, audience psychology, and unique selling proposition. Synthesizes a structured 4-scene narrative complete with shot framing, visual descriptions, actor direction, and concise spoken dialogue.",
    deliverables: [
      "Structured JSON scene manifest with exact timestamps",
      "Visual prompts tailored for 9:16 vertical cinematography",
      "Spoken dialogue timed to optimal commercial cadence (130-150 wpm)",
      "Automated scene duration estimation",
    ],
    consoleSnippet: `{
  "scenes": [
    {
      "scene_number": 1,
      "visual_description": "Cinematic extreme close-up of condensation on ice-cold can...",
      "voiceover_line": "Tired of the 3 PM crash? Meet pure clean focus.",
      "duration_seconds": 5
    }
  ]
}`,
  },
  {
    id: "visuals",
    stepNumber: "02",
    title: "Photorealistic Frame Generation",
    subtitle: "High-resolution vertical 9:16 stills with consistent lighting & color palette",
    badge: "DIFFUSION SYNTHESIS",
    icon: Film,
    accentColor: "text-accent-teal-bright",
    accentBg: "bg-accent-teal-bright/10 border-accent-teal-bright/30 text-accent-teal-bright",
    borderHover: "hover:border-accent-teal-bright/50",
    latency: "12.4s avg",
    model: "Pollinations Turbo / FLUX.1 Cinema",
    description:
      "Converts each visual prompt into an ultra-sharp 1080x1920 still frame. Applies consistent lighting palettes, cinematic depth of field, and photorealistic texture rendering engineered specifically for high-retention mobile feeds.",
    deliverables: [
      "Vertical 1080x1920 high-fidelity stills",
      "Consistent color temperature & product representation",
      "Subtle film grain pre-conditioning",
      "Automated aspect-ratio framing",
    ],
    consoleSnippet: `[Stage 2/4] Generating visuals for 4 scenes...
✓ Scene 01: output/images/aura_scene_1.jpg (1080x1920)
✓ Scene 02: output/images/aura_scene_2.jpg (1080x1920)
✓ Scene 03: output/images/aura_scene_3.jpg (1080x1920)
✓ Scene 04: output/images/aura_scene_4.jpg (1080x1920)`,
  },
  {
    id: "voiceover",
    stepNumber: "03",
    title: "Emotive Voice Synthesis",
    subtitle: "Studio-quality speech recording with precision cadence & emotion",
    badge: "ELEVENLABS MULTILINGUAL V2",
    icon: Mic,
    accentColor: "text-accent-amber",
    accentBg: "bg-accent-amber/10 border-accent-amber/30 text-accent-amber",
    borderHover: "hover:border-accent-amber/50",
    latency: "6.8s avg",
    model: "eleven_multilingual_v2 (Charlie / Custom Voice)",
    description:
      "Transforms each scene's script lines into human-like audio performances. Fine-tunes vocal cadence, emphasis, and emotional energy to match the product's premium brand tone.",
    deliverables: [
      "44.1kHz 16-bit uncompressed WAV master tracks",
      "Dynamic prosody & natural breathing pauses",
      "Accurate per-scene duration sync",
      "Edge-TTS fallback resilience for 100% uptime",
    ],
    consoleSnippet: `[Stage 3/4] Synthesizing voiceover audio tracks...
✓ Voice Archetype: "Charlie" (Deep Commercial Narrator)
✓ Generated 4 audio clips | Total spoken duration: 18.6s
✓ Peak audio levels normalized to -1.0 dBFS`,
  },
  {
    id: "assembly",
    stepNumber: "04",
    title: "Automated MoviePy Assembly",
    subtitle: "Ken Burns dynamic motion curves, background music ducking & master export",
    badge: "MOVIEPY 2.0 ENGINE",
    icon: Layers,
    accentColor: "text-accent-teal-bright",
    accentBg: "bg-accent-teal-bright/10 border-accent-teal-bright/30 text-accent-teal-bright",
    borderHover: "hover:border-accent-teal-bright/50",
    latency: "8.1s avg",
    model: "MoviePy Video Engine + FFmpeg H.264",
    description:
      "Stitches visual frames and voiceover tracks with micro-timed transitions, Ken Burns motion zooms, and royalty-free background soundtracks. Automatically applies audio ducking so dialogue remains crystal clear.",
    deliverables: [
      "Broadcast-ready MP4 (H.264 / AAC 320kbps)",
      "Ken Burns dynamic zoom curves per scene",
      "Intelligent background music audio ducking (-14dB)",
      "Zero manual video editing required",
    ],
    consoleSnippet: `[Stage 4/4] Assembling video, Ken Burns & audio mix...
- Background Score: "ambient_pulse.mp3" (Volume: 0.18)
- Applied smooth Ken Burns zoom (1.00x -> 1.08x)
- Render Target: 1080x1920 @ 30.0 fps
✓ Output Video: output/videos/callsheet_final_ad.mp4`,
  },
];

export default function PipelineSection() {
  const [expandedStage, setExpandedStage] = useState<string>("script");

  const toggleStage = (id: string) => {
    setExpandedStage(expandedStage === id ? "" : id);
  };

  return (
    <section id="pipeline" className="w-full py-16 md:py-24 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-teal/30 text-accent-teal-bright text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>4-STAGE AUTONOMOUS PIPELINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
            How Callsheet Generates Broadcast Ads
          </h2>
          <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
            Our multi-model orchestration pipeline eliminates traditional video editing overhead, 
            executing 4 autonomous stages in vertical sequence in under a minute.
          </p>
        </div>

        {/* Vertical Stacked Stage Decks ("One Down One") */}
        <div className="space-y-5">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isExpanded = expandedStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                  isExpanded
                    ? "bg-surface-raised border-accent-amber/50 shadow-accent-amber/5"
                    : "bg-surface/80 border-text-muted/20 hover:border-text-muted/40 hover:bg-surface"
                }`}
              >
                {/* Stage Header Summary Bar (Click to toggle deep dive) */}
                <button
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  className="w-full p-5 sm:p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Stage Number & Icon Badge */}
                    <div className="w-12 h-12 rounded-xl bg-bg border border-text-muted/25 flex items-center justify-center shrink-0">
                      <Icon className={`w-6 h-6 ${stage.accentColor}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${stage.accentBg}`}>
                          STAGE {stage.stepNumber}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted px-2 py-0.5 rounded bg-bg border border-text-muted/15">
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl text-text-primary font-medium">
                        {stage.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-text-muted">
                        {stage.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Latency & Expand Trigger */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-text-muted/10 font-mono text-xs text-text-muted">
                    <span className="flex items-center gap-1 bg-bg/80 px-3 py-1.5 rounded-lg border border-text-muted/15">
                      <Clock className="w-3.5 h-3.5 text-accent-amber" />
                      <span>{stage.latency}</span>
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

                {/* Expanded Stage Deep Dive & Terminal */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-text-muted/15 space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                      {/* Left Column: Description & Outputs */}
                      <div className="lg:col-span-6 space-y-4">
                        <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
                          {stage.description}
                        </p>

                        <div className="space-y-2">
                          <span className="font-mono text-xs text-text-primary uppercase tracking-wider block">
                            Key Deliverables:
                          </span>
                          <div className="space-y-1.5">
                            {stage.deliverables.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-text-muted">
                                <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal-bright shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 font-mono text-[11px] text-text-muted bg-bg/50 px-3 py-1.5 rounded-lg border border-text-muted/15 inline-flex items-center gap-2">
                          <span>Active Engine:</span>
                          <strong className="text-text-primary font-mono">{stage.model}</strong>
                        </div>
                      </div>

                      {/* Right Column: Console Telemetry */}
                      <div className="lg:col-span-6">
                        <div className="rounded-xl bg-bg border border-text-muted/25 overflow-hidden flex flex-col shadow-inner">
                          <div className="flex items-center justify-between px-3.5 py-2 bg-surface border-b border-text-muted/20 text-xs font-mono text-text-muted">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="w-3 h-3 text-accent-amber" />
                              <span>stage_{stage.stepNumber}_{stage.id}.log</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                            </div>
                          </div>
                          <pre className="p-3.5 font-mono text-xs text-text-primary/90 overflow-x-auto leading-relaxed whitespace-pre font-light">
                            {stage.consoleSnippet}
                          </pre>
                        </div>
                      </div>
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
