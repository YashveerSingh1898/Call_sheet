"use client";

import React from "react";
import { SEED_CAMPAIGNS, SeedCampaign } from "@/lib/seedCampaigns";
import { Play, Sparkles, Film, CheckCircle2, ArrowRight } from "lucide-react";

interface SeedCampaignPickerProps {
  selectedCampaignId?: string;
  onSelectCampaign: (campaign: SeedCampaign) => void;
  isLoading?: boolean;
}

export default function SeedCampaignPicker({
  selectedCampaignId,
  onSelectCampaign,
  isLoading = false,
}: SeedCampaignPickerProps) {
  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-text-muted/15 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-accent-amber uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>DIRECTOR SEED GALLERY • INSTANT PLAYBACK</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl text-text-primary font-normal">
            Broadcast Commercial Templates
          </h2>
        </div>
        <p className="font-mono text-xs text-text-muted hidden sm:block">
          Select any campaign to immediately preview the full video ad & storyboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SEED_CAMPAIGNS.map((campaign) => {
          const isSelected = selectedCampaignId === campaign.id;

          return (
            <div
              key={campaign.id}
              onClick={() => !isLoading && onSelectCampaign(campaign)}
              className={`group relative rounded-xl p-4 bg-surface/90 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${
                isSelected
                  ? "border-accent-amber ring-2 ring-accent-amber/30 bg-surface shadow-accent-amber/10"
                  : "border-text-muted/20 hover:border-accent-amber/50"
              }`}
            >
              <div className="space-y-3">
                {/* Visual Preview Thumbnail (9:16 Aspect Mini Card) */}
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-bg border border-text-muted/20 group-hover:border-accent-amber/40 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaign.thumbnail_url}
                    alt={campaign.product_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-accent-amber/90 text-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-bg/90 border border-text-muted/30 font-mono text-[10px] text-accent-amber flex items-center gap-1">
                    <Film className="w-2.5 h-2.5" />
                    <span>20s 1080p</span>
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent-teal-bright text-bg font-mono text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>LOADED</span>
                    </div>
                  )}
                </div>

                {/* Campaign Info */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-text-muted block uppercase tracking-wider">
                    {campaign.category}
                  </span>
                  <h3 className="font-display text-base text-text-primary group-hover:text-accent-amber transition-colors font-medium">
                    {campaign.product_name}
                  </h3>
                  <p className="font-body text-xs text-text-muted/80 line-clamp-2 leading-snug">
                    {campaign.brief}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-text-muted/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[11px] text-text-muted">4 Scenes Cut</span>
                <span className={`flex items-center gap-1 font-bold ${
                  isSelected ? "text-accent-teal-bright" : "text-accent-amber group-hover:translate-x-0.5 transition-transform"
                }`}>
                  <span>{isSelected ? "ACTIVE AD" : "WATCH AD"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
