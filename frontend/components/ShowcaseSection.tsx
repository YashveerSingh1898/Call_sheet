"use client";

import React, { useState } from "react";
import { Film, Sparkles, Mic, ArrowRight, Quote } from "lucide-react";

interface SceneDetail {
  number: number;
  duration: string;
  visual: string;
  script: string;
}

interface CampaignCaseStudy {
  id: string;
  brand: string;
  industry: string;
  tagline: string;
  brief: string;
  voiceStyle: string;
  turnaround: string;
  accent: string;
  scenes: SceneDetail[];
}

const CAMPAIGNS: CampaignCaseStudy[] = [
  {
    id: "aura",
    brand: "Aura Hydrate",
    industry: "Functional Beverage",
    tagline: "Clean afternoon focus without the sugar crash",
    brief: "Sparkling electrolyte water that boosts afternoon focus and mental clarity without sugar",
    voiceStyle: "Warm, energetic lifestyle narrator",
    turnaround: "42 seconds",
    accent: "text-accent-teal-bright",
    scenes: [
      {
        number: 1,
        duration: "0:05",
        visual: "Extreme macro close-up of icy droplets condensing on a sleek matte can under warm sunlight.",
        script: "That 3 PM mental fog? It's not a lack of willpower. It's a lack of cellular hydration.",
      },
      {
        number: 2,
        duration: "0:05",
        visual: "Dynamic splash of sparkling citrus electrolyte water bursting in zero-gravity slow motion.",
        script: "Aura delivers six essential electrolytes with zero sugar and zero synthetic fillers.",
      },
      {
        number: 3,
        duration: "0:05",
        visual: "Creative professional working effortlessly at a sunlit desk, taking a refreshing sip with crisp clarity.",
        script: "Clean, jitter-free afternoon momentum that keeps your sharpest ideas flowing.",
      },
      {
        number: 4,
        duration: "0:04",
        visual: "Hero product shot of the full Aura flavor range on wet black slate with glowing logo.",
        script: "Upgrade your hydration. Drink Aura today.",
      },
    ],
  },
  {
    id: "velvet",
    brand: "Velvet Noir",
    industry: "Luxury Fragrance",
    tagline: "Midnight elegance bottled in smoked glass",
    brief: "Smoky cedar and midnight vanilla fragrance designed for seductive evening rooftop scenes",
    voiceStyle: "Intimate, sultry cinematic voice",
    turnaround: "48 seconds",
    accent: "text-accent-amber",
    scenes: [
      {
        number: 1,
        duration: "0:06",
        visual: "Cinematic night cityscape viewed from a glass rooftop terrace, illuminated by warm amber city lights.",
        script: "Some evenings aren't meant to be forgotten. They are meant to linger.",
      },
      {
        number: 2,
        duration: "0:05",
        visual: "Macro slow-motion mist spray of fragrance capturing light particles against obsidian marble.",
        script: "Velvet Noir unfolds with dark bourbon vanilla, smoky cedar, and raw amber.",
      },
      {
        number: 3,
        duration: "0:05",
        visual: "Two figures silhouetted in a high-end jazz lounge, sharing a glance of magnetic intrigue.",
        script: "A signature scent that speaks with quiet, undeniable confidence.",
      },
      {
        number: 4,
        duration: "0:04",
        visual: "Sleek faceted perfume bottle glowing under subtle spotlight with gold lettering.",
        script: "Velvet Noir. The art of presence.",
      },
    ],
  },
  {
    id: "chrono",
    brand: "ChronoFlow AI",
    industry: "Enterprise SaaS",
    tagline: "Synchronize chaotic team schedules into effortless clarity",
    brief: "Autonomous task orchestrator that turns chaotic project schedules into synchronized timeline maps",
    voiceStyle: "Confident, crisp tech narrator",
    turnaround: "39 seconds",
    accent: "text-accent-teal-bright",
    scenes: [
      {
        number: 1,
        duration: "0:05",
        visual: "Chaotic cluster of red notification badges and tangled calendar blocks flashing across a dark screen.",
        script: "Your team didn't miss the deadline because they worked slow. They missed it because of schedule friction.",
      },
      {
        number: 2,
        duration: "0:05",
        visual: "Smooth holographic timeline rearranging itself into clean, glowing horizontal streams of work.",
        script: "ChronoFlow autonomously resolves dependency bottlenecks in real time.",
      },
      {
        number: 3,
        duration: "0:05",
        visual: "Cross-functional engineering and design team celebrating a seamless product release.",
        script: "Ship 3x faster without burnout or endless sync meetings.",
      },
      {
        number: 4,
        duration: "0:04",
        visual: "ChronoFlow interactive dashboard interface on a floating glass monitor with Call to Action.",
        script: "Reclaim your team's momentum at ChronoFlow.ai.",
      },
    ],
  },
  {
    id: "aero",
    brand: "AeroPulse Cloud",
    industry: "Performance Footwear",
    tagline: "Carbon-plated velocity for road and track",
    brief: "Carbon-plate running sneakers engineered for marathon speed and zero-gravity road feel",
    voiceStyle: "Dynamic, rhythmic athletic narrator",
    turnaround: "45 seconds",
    accent: "text-accent-amber",
    scenes: [
      {
        number: 1,
        duration: "0:05",
        visual: "Runner's foot hitting wet morning asphalt in ultra high-speed slow motion, water droplets radiating outward.",
        script: "Every single millisecond on the asphalt counts.",
      },
      {
        number: 2,
        duration: "0:05",
        visual: "Deconstructed 3D view of carbon-composite plate and responsive nitrogen-infused foam midsole.",
        script: "Engineered with curved carbon-propulsion technology for 94% kinetic energy return.",
      },
      {
        number: 3,
        duration: "0:05",
        visual: "Athlete sprinting across the finish line under dusk stadium floodlights with fierce determination.",
        script: "Outrun your previous best with zero-gravity road feel.",
      },
      {
        number: 4,
        duration: "0:04",
        visual: "Studio hero floating rotation of AeroPulse Cloud sneaker in neon amber and charcoal.",
        script: "AeroPulse Cloud. Defy your limits.",
      },
    ],
  },
];

export default function ShowcaseSection() {
  const [selectedId, setSelectedId] = useState<string>("aura");
  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedId) || CAMPAIGNS[0];

  return (
    <section id="showcase" className="w-full py-20 md:py-28 relative scroll-mt-20 border-t border-text-muted/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-teal/30 text-accent-teal-bright text-xs font-mono">
            <Film className="w-3.5 h-3.5" />
            <span>COMMERCIAL CAMPAIGN CASE STUDIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
            Generated with a Single Prompt
          </h2>
          <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
            See how diverse brands across beverage, fashion, enterprise software, and athletic apparel 
            generate complete commercial storyboards using FrameZero.
          </p>
        </div>

        {/* Campaign Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CAMPAIGNS.map((camp) => (
            <button
              key={camp.id}
              type="button"
              onClick={() => setSelectedId(camp.id)}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                selectedId === camp.id
                  ? "bg-accent-amber text-bg font-bold shadow-md"
                  : "bg-surface border border-text-muted/20 text-text-muted hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              <span>{camp.brand}</span>
              <span className="text-[10px] opacity-75">({camp.industry})</span>
            </button>
          ))}
        </div>

        {/* Active Campaign Case Study Container */}
        <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-surface border border-text-muted/20 shadow-2xl space-y-8">
          {/* Top Brand Header & Metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-text-muted/15">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-bg text-accent-teal-bright border border-text-muted/20">
                  {selectedCampaign.industry}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  Pipeline Render: <strong className="text-accent-amber">{selectedCampaign.turnaround}</strong>
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary font-normal">
                {selectedCampaign.brand}
              </h3>
              <p className="font-body text-sm text-text-muted italic">
                &ldquo;{selectedCampaign.tagline}&rdquo;
              </p>
            </div>

            {/* Voice & Cadence Spec Pill */}
            <div className="p-3.5 bg-bg/80 rounded-xl border border-text-muted/20 space-y-1 font-mono text-xs text-text-muted max-w-sm">
              <div className="flex items-center gap-1.5 text-accent-amber">
                <Mic className="w-3.5 h-3.5" />
                <span className="font-semibold">VOICE DIRECTION:</span>
              </div>
              <p className="text-text-primary text-[11px] font-sans">{selectedCampaign.voiceStyle}</p>
            </div>
          </div>

          {/* Original Prompt Brief Box */}
          <div className="p-4 rounded-xl bg-bg border border-accent-amber/25 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-accent-amber">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORIGINAL USER INPUT BRIEF:</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-text-primary/90 leading-relaxed pl-5 italic">
              &ldquo;{selectedCampaign.brief}&rdquo;
            </p>
          </div>

          {/* 4 Generated Scenes Grid */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider block">
              Synthesized 4-Scene Commercial Breakdown:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCampaign.scenes.map((scene) => (
                <div
                  key={scene.number}
                  className="p-4 rounded-xl bg-bg/70 border border-text-muted/20 flex flex-col justify-between space-y-3 hover:border-text-muted/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono border-b border-text-muted/15 pb-1.5">
                      <span className="text-accent-amber font-semibold">
                        SCENE 0{scene.number}
                      </span>
                      <span className="text-text-muted">{scene.duration}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-accent-teal-bright block">
                        VISUAL DIRECTION:
                      </span>
                      <p className="font-body text-xs text-text-muted leading-snug">
                        {scene.visual}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-text-muted/10 space-y-1">
                    <span className="text-[10px] font-mono text-text-muted/70 flex items-center gap-1">
                      <Quote className="w-2.5 h-2.5 text-accent-amber" />
                      SPOKEN VOICEOVER:
                    </span>
                    <p className="font-body text-xs text-text-primary font-medium leading-snug">
                      &ldquo;{scene.script}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action CTA inside Showcase */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-text-muted/15">
            <span className="text-xs font-body text-text-muted text-center sm:text-left">
              Want to generate an ad for your own product using this exact visual pipeline?
            </span>
            <a
              href="#generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-raised hover:bg-bg border border-accent-amber/40 text-accent-amber text-xs font-medium transition-all shadow-sm group"
            >
              <span>Launch Studio with this style</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
