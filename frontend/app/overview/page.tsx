"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Preloader from "@/components/Preloader";
import ThreeScrollCanvas from "@/components/ThreeScrollCanvas";
import DeckNavigator from "@/components/DeckNavigator";
import PipelineSection from "@/components/PipelineSection";
import FeaturesSection from "@/components/FeaturesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Sparkles, ArrowRight, Clapperboard, Film, ShieldCheck, Zap, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OverviewPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-accent-amber/30 selection:text-text-primary bg-bg text-text-primary">
      {/* 0. Minimalist Studio Preloader */}
      <Preloader />

      {/* 1. Global Persistent Three.js Background */}
      <ThreeScrollCanvas />

      {/* 2. Global Navigation Bar */}
      <Navbar />

      {/* 3. Interactive Deck Navigator HUD */}
      <DeckNavigator />

      {/* 4. Main 6-Sheet Content Flow */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* SHEET 01: HERO & STRATEGIC OVERVIEW */}
        <section
          id="overview"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 pt-8 pb-16"
        >
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-accent-amber tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse shadow-sm shadow-accent-amber" />
              <span>SHEET 01 / 06 • OVERVIEW & VISION</span>
            </div>
            <Hero />
          </div>
        </section>

        {/* SHEET 02: 4-STAGE AUTONOMOUS PIPELINE */}
        <section
          id="pipeline"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 py-16 border-t border-text-muted/15"
        >
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-accent-teal-bright tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse shadow-sm shadow-accent-teal-bright" />
              <span>SHEET 02 / 06 • 4-STAGE ENGINE ARCHITECTURE</span>
            </div>
            <PipelineSection />
          </div>
        </section>

        {/* SHEET 03: DIRECTOR CAPABILITIES */}
        <section
          id="features"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 py-16 border-t border-text-muted/15"
        >
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-accent-amber tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse shadow-sm shadow-accent-amber" />
              <span>SHEET 03 / 06 • DIRECTOR-GRADE CAPABILITIES</span>
            </div>
            <FeaturesSection />
          </div>
        </section>

        {/* SHEET 04: COMMERCIAL CAMPAIGN CASE STUDIES */}
        <section
          id="showcase"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 py-16 border-t border-text-muted/15"
        >
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-accent-teal-bright tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse shadow-sm shadow-accent-teal-bright" />
              <span>SHEET 04 / 06 • CAMPAIGN CASE STUDIES</span>
            </div>
            <ShowcaseSection />
          </div>
        </section>

        {/* SHEET 05: AI PRODUCTION STUDIO GATEWAY */}
        <section
          id="studio-gateway"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 py-20 border-t border-text-muted/15"
        >
          <div className="w-full max-w-5xl space-y-8">
            <div className="flex items-center gap-2 font-mono text-xs text-accent-amber tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse shadow-sm shadow-accent-amber" />
              <span>SHEET 05 / 06 • AI PRODUCTION STUDIO GATEWAY</span>
            </div>

            <div className="relative p-8 sm:p-14 rounded-3xl bg-surface/90 backdrop-blur-xl border border-accent-amber/40 shadow-2xl overflow-hidden text-center space-y-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-amber/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-teal-bright/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg border border-accent-amber/30 text-accent-amber text-xs font-mono">
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>DEDICATED PRODUCTION WORKSPACE</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
                  Ready to Direct Your Commercial?
                </h2>

                <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                  Step inside our dedicated AI Studio. Provide your creative brief and watch the autonomous pipeline synthesize the script, generate 9:16 commercial visuals, record crystal-clear voiceovers, and assemble your final broadcast video.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/studio"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 active:bg-accent-amber/80 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent-amber/25 hover:scale-105 active:scale-95 group"
                >
                  <Sparkles className="w-4 h-4 text-bg group-hover:rotate-12 transition-transform" />
                  <span>LAUNCH AI STUDIO WORKSPACE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {!isAuthenticated && (
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-surface-raised hover:bg-surface border border-text-muted/30 text-text-primary font-mono text-sm font-medium transition-all flex items-center justify-center gap-2 hover:border-accent-amber/40"
                  >
                    <User className="w-4 h-4 text-accent-amber" />
                    <span>DIRECTOR SIGN IN</span>
                  </Link>
                )}
              </div>

              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-text-muted/15 text-left">
                <div className="p-3 rounded-lg bg-bg/60 border border-text-muted/15">
                  <div className="font-mono text-[11px] text-accent-amber font-semibold flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-accent-amber" />
                    <span>SCRIPT ENGINE</span>
                  </div>
                  <span className="font-body text-xs text-text-muted">Multi-Model Gemini</span>
                </div>

                <div className="p-3 rounded-lg bg-bg/60 border border-text-muted/15">
                  <div className="font-mono text-[11px] text-accent-teal-bright font-semibold flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-accent-teal-bright" />
                    <span>VISUAL FRAMES</span>
                  </div>
                  <span className="font-body text-xs text-text-muted">9:16 Vertical 8K</span>
                </div>

                <div className="p-3 rounded-lg bg-bg/60 border border-text-muted/15">
                  <div className="font-mono text-[11px] text-accent-amber font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-accent-amber" />
                    <span>VOICE NARRATION</span>
                  </div>
                  <span className="font-body text-xs text-text-muted">Ultra-Crisp Speech</span>
                </div>

                <div className="p-3 rounded-lg bg-bg/60 border border-text-muted/15">
                  <div className="font-mono text-[11px] text-accent-teal-bright font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-accent-teal-bright" />
                    <span>MASTER OUTPUT</span>
                  </div>
                  <span className="font-body text-xs text-text-muted">1080p MP4 + Captions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHEET 06: TECHNICAL SPECIFICATIONS & FAQ */}
        <section
          id="faq"
          className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-8 py-20 border-t border-text-muted/15"
        >
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-accent-teal-bright tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse shadow-sm shadow-accent-teal-bright" />
              <span>SHEET 06 / 06 • TECHNICAL SPECIFICATIONS & FAQ</span>
            </div>
            <FaqSection />
          </div>
        </section>
      </main>

      {/* 5. Production Footer */}
      <Footer />
    </div>
  );
}
