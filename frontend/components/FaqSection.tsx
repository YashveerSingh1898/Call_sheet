"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Terminal } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "PERFORMANCE & SPEED",
    question: "How fast is the full commercial video generation pipeline?",
    answer:
      "A complete 4-scene commercial typically renders in under 60 seconds from prompt submission. The pipeline orchestrates script synthesis (~3s), 9:16 image generation (~15s), ElevenLabs voiceover recording (~8s), and MoviePy video assembly & audio ducking (~12s) concurrently.",
  },
  {
    category: "AI MODELS & ARCHITECTURE",
    question: "Which generative models power each production phase?",
    answer:
      "Callsheet utilizes Google Gemini 1.5 Pro / Flash for structured screenwriting and visual direction; high-resolution image diffusion models for vertical 1080x1920 frames; ElevenLabs Multilingual v2 for human-grade emotive voiceovers; and MoviePy 2.0 with FFmpeg for video compilation, Ken Burns motion, and audio mixing.",
  },
  {
    category: "RESILIENCE & FALLBACKS",
    question: "What happens if an external API encounters rate limits or downtime?",
    answer:
      "Callsheet is engineered with a multi-model fallback cascade. If primary endpoints are temporarily constrained, the orchestrator automatically routes to secondary models (e.g., gemini-3.1-flash-lite, edge-tts neural voiceover, and custom visual canvas renderers) ensuring uninterrupted generation.",
  },
  {
    category: "COMMERCIAL LICENSING",
    question: "Can I use the generated videos for paid ad campaigns on TikTok and Meta?",
    answer:
      "Yes. All assets produced by Callsheet—including generative scripts, rendered visuals, synthesized ElevenLabs audio tracks, and royalty-free background soundtracks—are 100% royalty-free and cleared for commercial distribution across Meta, TikTok, YouTube, and digital broadcast channels.",
  },
  {
    category: "AUDIO MIXING",
    question: "How does intelligent background music audio ducking work?",
    answer:
      "The assembly engine automatically detects spoken voiceover envelopes. It applies an acoustic attenuation filter, reducing the background score volume by -14dB during spoken dialogue to preserve vocal clarity, and smoothly ramps volume back up during transition cuts.",
  },
  {
    category: "EXPORT CODECS & SPECS",
    question: "What video formats, resolutions, and framerates are produced?",
    answer:
      "By default, Callsheet outputs standard vertical 1080x1920 MP4 files encoded in H.264 (High Profile) at 30 fps with stereo AAC audio at 320 kbps. This guarantees immediate drag-and-drop compatibility with TikTok Ads Manager, Meta Ads Manager, and Google App Campaigns.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 md:py-28 relative scroll-mt-20 border-t border-text-muted/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-amber/30 text-accent-amber text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TECHNICAL SPECIFICATIONS & FAQ</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
            Everything you need to know about the Callsheet generative engine, model architectures, 
            audio ducking, and commercial licensing.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-surface border-accent-amber/40 shadow-lg"
                    : "bg-surface/70 border-text-muted/20 hover:border-text-muted/40 hover:bg-surface"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-accent-teal-bright uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <h3 className="font-display text-base sm:text-lg text-text-primary font-medium">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full bg-bg border border-text-muted/20 flex items-center justify-center shrink-0 text-text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-accent-amber border-accent-amber/40" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm font-body text-text-muted leading-relaxed border-t border-text-muted/10 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Technical Specs Footer Callout */}
        <div className="p-6 rounded-xl bg-bg/80 border border-text-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent-amber" />
            <span>FastAPI Backend Engine v1.0.0 • MoviePy 2.0 • Three.js WebGL</span>
          </div>
          <span className="text-accent-teal-bright">● All Pipelines Operational</span>
        </div>
      </div>
    </section>
  );
}
