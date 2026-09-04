"use client";

import React, { useEffect, useState } from "react";

export type PipelineStage =
  | "script"
  | "images"
  | "voiceover"
  | "editing"
  | "done"
  | "error"
  | string;

interface StatusIndicatorProps {
  stage: PipelineStage;
  errorMessage?: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  script: "Writing your script",
  images: "Generating scenes",
  voiceover: "Recording voiceover",
  editing: "Cutting the final edit",
  done: "Production complete",
};

export default function StatusIndicator({
  stage,
  errorMessage,
}: StatusIndicatorProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Elapsed time timer in IBM Plex Mono
  useEffect(() => {
    if (stage === "done" || stage === "error") {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isError = stage === "error";
  const statusText = STAGE_LABELS[stage] || "Processing ad production";

  if (isError) {
    return (
      <div className="w-full max-w-2xl mt-6 p-4 rounded-md bg-surface border border-red-900/30 space-y-1.5 animate-fadeIn">
        <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>Something went wrong during production</span>
        </div>
        <p className="text-xs text-red-300/80 pl-4 font-normal">
          {errorMessage || "Unable to complete generation. Please check your brief or API limits."}
        </p>
        <p className="text-xs text-text-muted pl-4 pt-1 font-normal">
          Try again with a different prompt or brief.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mt-6 p-4 rounded-md bg-surface border border-text-muted/15 flex items-center justify-between animate-fadeIn">
      {/* Status message with accent-teal pulsing dot */}
      <div className="flex items-center gap-3">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            stage === "done"
              ? "bg-accent-teal"
              : "bg-accent-teal animate-pulse"
          }`}
          aria-hidden="true"
        />
        <span className="font-body text-sm text-text-primary font-normal">
          {statusText}
        </span>
      </div>

      {/* Elapsed Time Counter in IBM Plex Mono */}
      <span className="font-mono text-xs text-text-muted font-normal tracking-wide">
        {formatTime(elapsedSeconds)}
      </span>
    </div>
  );
}
