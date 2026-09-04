"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Lightbulb, ArrowRight } from "lucide-react";

interface InputPanelProps {
  onGenerate: (productName: string, brief: string) => void;
  isLoading?: boolean;
}

interface Preset {
  label: string;
  name: string;
  brief: string;
}

const PRESETS: Preset[] = [
  {
    label: "⚡ Electrolyte Drink",
    name: "Aura Hydrate",
    brief: "Sparkling electrolyte water that boosts afternoon focus and mental clarity without sugar",
  },
  {
    label: "🌙 Luxury Fragrance",
    name: "Velvet Noir",
    brief: "Smoky cedar and midnight vanilla fragrance designed for seductive evening rooftop scenes",
  },
  {
    label: "👟 Performance Runners",
    name: "AeroPulse Cloud",
    brief: "Carbon-plate running sneakers engineered for marathon speed and zero-gravity road feel",
  },
  {
    label: "💻 AI Workflow App",
    name: "ChronoFlow",
    brief: "Autonomous task orchestrator that turns chaotic project schedules into synchronized timeline maps",
  },
];

export default function InputPanel({
  onGenerate,
  isLoading = false,
}: InputPanelProps) {
  const [productName, setProductName] = useState("");
  const [brief, setBrief] = useState("");
  const [errors, setErrors] = useState<{
    productName?: string;
    brief?: string;
  }>({});

  const handleApplyPreset = (preset: Preset) => {
    if (isLoading) return;
    setProductName(preset.name);
    setBrief(preset.brief);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { productName?: string; brief?: string } = {};

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

    if (validate()) {
      onGenerate(productName.trim(), brief.trim());
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Preset Prompt Suggestions */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <Lightbulb className="w-3.5 h-3.5 text-accent-amber" />
          <span>TRY SAMPLE CREATIVE BRIEFS:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-full bg-surface border border-text-muted/20 hover:border-accent-amber/50 text-xs font-body text-text-muted hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>{preset.label}</span>
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
                <span>Generate Broadcast Ad</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
