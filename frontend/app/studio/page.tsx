"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InputPanel from "@/components/InputPanel";
import StatusIndicator from "@/components/StatusIndicator";
import Filmstrip from "@/components/Filmstrip";
import FinalCut from "@/components/FinalCut";
import SeedCampaignPicker from "@/components/SeedCampaignPicker";
import { SEED_CAMPAIGNS, SeedCampaign } from "@/lib/seedCampaigns";
import { Scene, getResult, pollStatus, startGeneration } from "@/lib/api";
import {
  Clapperboard,
  HelpCircle,
  ArrowLeft,
  ShieldCheck,
  Zap,
  UserCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function StudioPage() {
  const { user, isAuthenticated, login, openAccountSidebar } = useAuth();

  // Production & Active Campaign State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("aura-hydrate");
  const [productName, setProductName] = useState<string>("Aura Hydrate");
  const [brief, setBrief] = useState<string>(
    "Sparkling electrolyte water that boosts afternoon focus and mental clarity without sugar"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stage, setStage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Asset Output State (defaulted to Aura Hydrate seed campaign)
  const [scenes, setScenes] = useState<Scene[]>(SEED_CAMPAIGNS[0].scenes);
  const [videoUrl, setVideoUrl] = useState<string | null>(SEED_CAMPAIGNS[0].video_url);

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

  const handleSelectCampaign = (campaign: SeedCampaign) => {
    setSelectedCampaignId(campaign.id);
    setProductName(campaign.product_name);
    setBrief(campaign.brief);
    setScenes(campaign.scenes);
    setVideoUrl(campaign.video_url);
    setStage("");
    setErrorMessage(null);
  };

  const handleGenerate = async (genProductName: string, genBrief: string) => {
    // Strict Authentication Guard
    if (!isAuthenticated) {
      setStage("error");
      setErrorMessage(
        "Authentication Required: You must be signed into your director account to synthesize video ads."
      );
      return;
    }

    clearPolling();
    setIsGenerating(true);
    setStage("script");
    setErrorMessage(null);
    setScenes([]);
    setVideoUrl(null);
    setSelectedCampaignId("");

    try {
      const { job_id } = await startGeneration(genProductName, genBrief);

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
              status.error_message || "An unexpected error occurred during commercial production."
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
      {/* Global Navigation */}
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center pt-28 pb-20 px-4 sm:px-8">
        <div className="w-full max-w-5xl space-y-10">
          {/* Breadcrumb & Navigation Back */}
          <div className="flex items-center justify-between border-b border-text-muted/15 pb-4">
            <Link
              href="/overview"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-amber transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>RETURN TO OVERVIEW</span>
            </Link>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={openAccountSidebar}
                  title="View Director Account Details"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface hover:bg-surface-raised border border-accent-teal-bright/40 hover:border-accent-teal-bright text-xs font-mono transition-all shadow-sm group cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-accent-teal-bright animate-pulse" />
                  <span className="text-text-muted">DIRECTOR:</span>
                  <span className="text-accent-teal-bright font-bold group-hover:underline">
                    @{user?.username || user?.name}
                  </span>
                  <span className="text-[10px] text-text-muted/70 group-hover:text-accent-amber transition-colors">
                    [Profile]
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => login("demo_director", "demo.director@framezero.ai", "Demo Director")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-accent-amber/30 text-accent-amber hover:border-accent-amber transition-all font-mono text-xs cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ENABLE DEMO ACCESS</span>
                </button>
              )}
            </div>
          </div>

          {/* Studio Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-amber/30 text-accent-amber text-xs font-mono">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>AUTONOMOUS PRODUCTION STUDIO</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary font-normal tracking-tight">
              AI Commercial Studio
            </h1>
            <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
              Synthesize broadcast-quality 9:16 vertical video commercials in seconds. Preview our live pre-seeded campaigns below or enter custom product details for autonomous scriptwriting, frame synthesis, and audio mixing.
            </p>
          </div>

          {/* 1. Pre-Seeded Commercial Template Gallery (Instant Playback & Load) */}
          <SeedCampaignPicker
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={handleSelectCampaign}
            isLoading={isGenerating}
          />

          {/* 2. Studio Input Workspace (Editable & Custom Synthesizer) */}
          <div className="max-w-3xl mx-auto w-full pt-4">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-accent-amber uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOMIZE BRIEF OR SYNTHESIZE NEW COMMERCIAL</span>
            </div>
            <InputPanel
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              initialProductName={productName}
              initialBrief={brief}
              onSelectPreset={handleSelectCampaign}
            />
          </div>

          {/* Telemetry Stage Indicator */}
          {(isGenerating || stage === "error") && (
            <div className="max-w-3xl mx-auto w-full">
              <StatusIndicator stage={stage} errorMessage={errorMessage} />
            </div>
          )}

          {/* 3. Final Rendered Video Player with Chapters */}
          {videoUrl && (
            <div className="pt-2">
              <FinalCut videoUrl={videoUrl} productName={productName} scenes={scenes} />
            </div>
          )}

          {/* 4. Generated Scenes Contact Sheet Filmstrip */}
          {scenes.length > 0 && (
            <div className="pt-2">
              <Filmstrip scenes={scenes} />
            </div>
          )}

          {/* Studio Tips & Pipeline Specs Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 border-t border-text-muted/15">
            <div className="p-4 rounded-xl bg-surface/60 border border-text-muted/20 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs text-accent-amber font-semibold">
                <Zap className="w-4 h-4 text-accent-amber" />
                <span>INSTANT BROADCAST PREVIEW</span>
              </div>
              <p className="font-body text-xs text-text-muted leading-snug">
                Click any template card above to immediately load its 4-scene cut, voiceover script, and master 1080p MP4.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface/60 border border-text-muted/20 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs text-accent-teal-bright font-semibold">
                <ShieldCheck className="w-4 h-4 text-accent-teal-bright" />
                <span>BROADCAST MASTER</span>
              </div>
              <p className="font-body text-xs text-text-muted leading-snug">
                Exported in vertical 1080x1920 MP4 with burned subtitle cards, stereo voiceover, and full chapter cues.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface/60 border border-text-muted/20 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs text-text-primary font-semibold">
                <HelpCircle className="w-4 h-4 text-accent-amber" />
                <span>DIRECTOR TIPS</span>
              </div>
              <p className="font-body text-xs text-text-muted leading-snug">
                Use the interactive scene chapter buttons to jump directly to any second in the commercial.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
