"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Lightbulb,
  ArrowRight,
  Lock,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SEED_CAMPAIGNS, SeedCampaign } from "@/lib/seedCampaigns";

interface InputPanelProps {
  onGenerate: (productName: string, brief: string) => void;
  isLoading?: boolean;
  initialProductName?: string;
  initialBrief?: string;
  onSelectPreset?: (campaign: SeedCampaign) => void;
}

export default function InputPanel({
  onGenerate,
  isLoading = false,
  initialProductName = "",
  initialBrief = "",
  onSelectPreset,
}: InputPanelProps) {
  const { user, isAuthenticated, login, openAccountSidebar } = useAuth();
  const [productName, setProductName] = useState(initialProductName);
  const [brief, setBrief] = useState(initialBrief);
  const [errors, setErrors] = useState<{
    productName?: string;
    brief?: string;
    auth?: string;
  }>({});

  useEffect(() => {
    if (initialProductName) setProductName(initialProductName);
    if (initialBrief) setBrief(initialBrief);
  }, [initialProductName, initialBrief]);

  const handleApplyPreset = (campaign: SeedCampaign) => {
    if (isLoading) return;
    setProductName(campaign.product_name);
    setBrief(campaign.brief);
    setErrors({});
    if (onSelectPreset) {
      onSelectPreset(campaign);
    }
  };

  const validate = (): boolean => {
    const newErrors: { productName?: string; brief?: string; auth?: string } = {};

    if (!isAuthenticated) {
      newErrors.auth = "Director sign-in is required before starting production.";
    }

    if (!productName.trim()) {
      newErrors.productName = "Add a product name to continue";
    }

    if (!brief.trim()) {
      newErrors.brief = "Add a one-line brief to continue";
    } else if (brief.length > 200) {
      newErrors.brief = "Keep the brief under 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isAuthenticated) {
      setErrors((prev) => ({
        ...prev,
        auth: "Sign-in required: Please authenticate or use 1-Click Demo Director below.",
      }));
      return;
    }

    if (validate()) {
      onGenerate(productName.trim(), brief.trim());
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Auth Status Notification / Banner */}
      {!isAuthenticated ? (
        <div className="p-4 sm:p-5 rounded-xl bg-surface/95 border border-accent-amber/40 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-bold text-accent-amber uppercase tracking-wider">
                  Authentication Required to Create Ads
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
                  GUEST RESTRICTED
                </span>
              </div>
              <p className="font-body text-xs text-text-muted leading-relaxed">
                You must be signed in to direct the autonomous synthesis pipeline and generate broadcast MP4 videos.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <Link
              href="/login?redirect=/studio"
              className="px-4 py-2 rounded-lg bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN / CREATE ACCOUNT</span>
            </Link>

            <button
              type="button"
              onClick={() => login("demo_director", "demo.director@framezero.ai", "Demo Director")}
              className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-surface border border-accent-teal-bright/40 text-accent-teal-bright font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>1-CLICK DEMO DIRECTOR ACCESS</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-surface/80 border border-accent-teal-bright/30 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-teal-bright animate-pulse" />
            <span className="text-text-muted">DIRECTOR ACTIVE:</span>
            <button
              type="button"
              onClick={openAccountSidebar}
              className="text-accent-teal-bright font-bold hover:underline cursor-pointer flex items-center gap-1"
              title="View Account Details in Sidebar"
            >
              <span>@{user?.username || user?.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-accent-teal-bright/40 text-accent-teal-bright ml-1">
                Profile ➔
              </span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-text-muted text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-teal-bright" />
            <span>SYNTHESIS UNLOCKED</span>
          </div>
        </div>
      )}

      {/* Preset Prompt Suggestions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-accent-amber" />
            <span>DIRECTOR SEED PROMPTS (CLICK TO LOAD & PREVIEW):</span>
          </div>
          <span className="text-[10px] text-accent-teal-bright hidden sm:inline">⚡ Instant Live Video</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEED_CAMPAIGNS.map((camp) => (
            <button
              key={camp.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset(camp)}
              className="px-3 py-1.5 rounded-full bg-surface border border-text-muted/20 hover:border-accent-amber/50 text-xs font-body text-text-muted hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>{camp.category.split(" ")[0]} {camp.product_name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full p-6 sm:p-8 rounded-xl bg-surface border border-text-muted/20 shadow-xl space-y-6"
        noValidate
      >
        {errors.auth && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errors.auth}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Product Name Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="product-name"
                className="block text-sm text-text-primary font-medium"
              >
                Product Name
              </label>
              <span className="text-xs font-mono text-text-muted/60">e.g. Brand / Model</span>
            </div>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                if (errors.productName) {
                  setErrors((prev) => ({ ...prev, productName: undefined }));
                }
              }}
              disabled={isLoading}
              placeholder="e.g. Aura Hydrate"
              className="w-full px-4 py-3.5 rounded-lg bg-bg text-text-primary placeholder:text-text-muted/40 border border-text-muted/25 focus:outline-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.productName && (
              <p className="text-xs text-amber-400 pt-1 font-normal">
                {errors.productName}
              </p>
            )}
          </div>

          {/* One-Line Creative Brief Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="brief"
                className="block text-sm text-text-primary font-medium"
              >
                Creative Premise / Value Proposition
              </label>
              <span
                className={`text-xs ${
                  brief.length > 200
                    ? "text-amber-400 font-semibold"
                    : "text-text-muted/60 font-mono"
                }`}
              >
                {brief.length}/200
              </span>
            </div>
            <textarea
              id="brief"
              rows={3}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value);
                if (errors.brief) {
                  setErrors((prev) => ({ ...prev, brief: undefined }));
                }
              }}
              disabled={isLoading}
              placeholder="e.g. Sparkling electrolyte water that boosts afternoon focus and mental clarity without sugar"
              className="w-full px-4 py-3 rounded-lg bg-bg text-text-primary placeholder:text-text-muted/40 border border-text-muted/25 focus:outline-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            {errors.brief && (
              <p className="text-xs text-amber-400 pt-1 font-normal">
                {errors.brief}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-text-muted/15">
          <p className="text-xs text-text-muted hidden sm:block">
            Generates 4-scene script, visual frames, ElevenLabs VO & final MP4
          </p>

          {isAuthenticated ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-accent-amber text-bg font-semibold text-sm hover:bg-accent-amber/90 active:bg-accent-amber/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  <span>Directing Production...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Synthesize Custom Ad</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Link
                href="/login?redirect=/studio"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>SIGN IN TO CREATE AD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
