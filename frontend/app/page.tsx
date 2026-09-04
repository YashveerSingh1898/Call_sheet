"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Preloader from "@/components/Preloader";
import ThreeScrollCanvas from "@/components/ThreeScrollCanvas";
import DeckNavigator from "@/components/DeckNavigator";
import PipelineSection from "@/components/PipelineSection";
import FeaturesSection from "@/components/FeaturesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import InputPanel from "@/components/InputPanel";
import StatusIndicator from "@/components/StatusIndicator";
import Filmstrip from "@/components/Filmstrip";
import FinalCut from "@/components/FinalCut";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { Scene, getResult, pollStatus, startGeneration } from "@/lib/api";
import { Sparkles } from "lucide-react";

export default function Home() {
  // Production State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stage, setStage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Asset Output State
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Polling interval ref for cleanup
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearPolling();
  }, []);

  const handleGenerate = async (productName: string, brief: string) => {
    clearPolling();
    setIsGenerating(true);
    setStage("script");
    setErrorMessage(null);
    setScenes([]);
    setVideoUrl(null);

    try {
      const { job_id } = await startGeneration(productName, brief);

      pollTimerRef.current = setInterval(async () => {
        try {
          const status = await pollStatus(job_id);
          setStage(status.stage);

          if (status.stage === "done") {
            clearPolling();
            setIsGenerating(false);
            const result = await getResult(job_id);
            setScenes(result.scenes || []);
            setVideoUrl(result.video_url || null);
          } else if (status.stage === "error") {
            clearPolling();
            setIsGenerating(false);
            setErrorMessage(
              status.error_message || "An unexpected error occurred during production."
            );
          }
        } catch (pollError: unknown) {
          console.error("Status polling failed:", pollError);
        }
      }, 2000);
    } catch (err: unknown) {
      clearPolling();
      setIsGenerating(false);
      setStage("error");
      const message =
        err instanceof Error ? err.message : "Unable to communicate with the backend server.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-accent-amber/30 selection:text-text-primary bg-bg text-text-primary">
      {/* 0. Minimalist Studio Preloader */}
      <Preloader />

      {/* 1. Global Persistent Three.js Background (Single 3D Ball with following lights moving top-to-bottom) */}
      <ThreeScrollCanvas />

      {/* 2. Global Navigation Bar */}
      <Navbar />

      {/* 3. Interactive Deck Navigator HUD */}
      <DeckNavigator />

      {/* 4. Main 6-Sheet Content Flow (Flowing continuously from up to down) */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* ========================================================================= */}
        {/* SHEET 01: HERO & STRATEGIC OVERVIEW */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* SHEET 02: 4-STAGE AUTONOMOUS PIPELINE */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* SHEET 03: DIRECTOR CAPABILITIES */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* SHEET 04: COMMERCIAL CAMPAIGN CASE STUDIES */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* SHEET 05: AI PRODUCTION STUDIO GENERATOR */}
        {/* ========================================================================= */}
        <section
          id="generator"
          className="w-full min-h-[95vh] flex flex-col justify-center items-center px-4 sm:px-8 py-20 border-t border-text-muted/15"
        >
          <div className="w-full max-w-5xl space-y-8">
            <div className="flex items-center gap-2 font-mono text-xs text-accent-amber tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse shadow-sm shadow-accent-amber" />
              <span>SHEET 05 / 06 • AI PRODUCTION STUDIO</span>
            </div>

            {/* Section Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-amber/30 text-accent-amber text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI PRODUCTION WORKSPACE</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
                Create Your Commercial
              </h2>
              <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                Provide your product details or click a sample brief. Our autonomous pipeline will
                synthesize the script, generate cinematic scenes, record voiceovers, and compile your video.
              </p>
            </div>

            {/* Input Form Panel */}
            <div className="pt-2 max-w-3xl mx-auto">
              <InputPanel onGenerate={handleGenerate} isLoading={isGenerating} />
            </div>

            {/* Status Telemetry Indicator */}
            {(isGenerating || stage === "error") && (
              <div className="max-w-3xl mx-auto">
                <StatusIndicator stage={stage} errorMessage={errorMessage} />
              </div>
            )}

            {/* Generated Scenes Contact Sheet (Filmstrip) */}
            {scenes.length > 0 && (
              <div className="pt-6">
                <Filmstrip scenes={scenes} />
              </div>
            )}

            {/* Final Rendered Video Player */}
            {videoUrl && (
              <div className="pt-4">
                <FinalCut videoUrl={videoUrl} />
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SHEET 06: TECHNICAL SPECIFICATIONS & FAQ */}
        {/* ========================================================================= */}
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
