"use client";

import React from "react";

interface FinalCutProps {
  videoUrl: string;
}

export default function FinalCut({ videoUrl }: FinalCutProps) {
  if (!videoUrl) return null;

  return (
    <section className="w-full mt-16 space-y-6">
      {/* Heading in Fraunces */}
      <h2 className="font-display text-2xl sm:text-3xl font-normal text-text-primary tracking-tight">
        Final cut
      </h2>

      {/* Surface-colored container */}
      <div className="w-full p-6 sm:p-8 rounded-lg bg-surface border border-text-muted/15 flex flex-col items-center justify-center space-y-6">
        {/* Centered vertical 9:16 video player */}
        <div className="w-full max-w-xs aspect-[9/16] rounded-md overflow-hidden bg-bg shadow-2xl border border-text-muted/20">
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain rounded-md"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Plain text style download link with visible amber focus outline */}
        <a
          href={videoUrl}
          download="callsheet_final_ad.mp4"
          className="text-sm font-body text-accent-amber hover:underline hover:text-accent-amber/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm transition-colors"
        >
          Download video (.mp4)
        </a>
      </div>
    </section>
  );
}
