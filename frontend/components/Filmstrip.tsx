"use client";

import React from "react";
import { Scene } from "@/lib/api";

interface FilmstripProps {
  scenes: Scene[];
}

function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatSceneNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

export default function Filmstrip({ scenes }: FilmstripProps) {
  if (!scenes || scenes.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-12 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl text-text-primary font-normal tracking-tight">
          Production Contact Sheet
        </h2>
        <span className="font-mono text-xs text-text-muted">
          {scenes.length} {scenes.length === 1 ? "Scene" : "Scenes"}
        </span>
      </div>

      {/* Horizontally scrollable filmstrip with snap scrolling and touch friendly margins */}
      <div className="relative w-full">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          {scenes.map((scene, index) => {
            const staggerDelay = `${index * 100}ms`;

            return (
              <div
                key={scene.scene_number || index}
                style={{ animationDelay: staggerDelay }}
                className="animate-film-pull flex-none w-56 sm:w-60 snap-start group"
              >
                {/* Film-Frame Card (Sharp corners, thin text-muted border) */}
                <div className="relative bg-surface rounded-none border border-text-muted/30 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-text-muted/60">
                  {/* Top Sprocket Perforations */}
                  <div className="flex justify-between items-center px-2 py-2 bg-surface border-b border-text-muted/20">
                    {[...Array(6)].map((_, holeIdx) => (
                      <div
                        key={holeIdx}
                        className="w-2 h-3 rounded-[1px] bg-bg border border-text-muted/40 shadow-inner"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* 9:16 Visual Container */}
                  <div className="relative aspect-[9/16] w-full bg-bg/80 overflow-hidden flex items-center justify-center">
                    {scene.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={scene.image_url}
                        alt={`Scene ${scene.scene_number}`}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="font-mono text-xs text-text-muted/60">
                          SCENE {formatSceneNumber(scene.scene_number)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Sprocket Perforations */}
                  <div className="flex justify-between items-center px-2 py-2 bg-surface border-t border-text-muted/20">
                    {[...Array(6)].map((_, holeIdx) => (
                      <div
                        key={holeIdx}
                        className="w-2 h-3 rounded-[1px] bg-bg border border-text-muted/40 shadow-inner"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                {/* Metadata Below Each Frame */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="font-mono text-xs text-text-primary font-medium tracking-wider">
                    {formatSceneNumber(scene.scene_number)}
                  </span>
                  <span className="font-mono text-xs text-accent-amber font-medium">
                    {formatTimecode(scene.duration_seconds || 5)}
                  </span>
                </div>

                {/* Voiceover preview line if available */}
                {scene.voiceover_line && (
                  <p className="font-body text-xs text-text-muted/80 line-clamp-2 mt-1 px-1 leading-snug">
                    &ldquo;{scene.voiceover_line}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
