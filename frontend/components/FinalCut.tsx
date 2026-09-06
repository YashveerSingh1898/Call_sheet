"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Film, Sparkles, CheckCircle2, RotateCcw, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Scene } from "@/lib/api";

interface FinalCutProps {
  videoUrl: string;
  productName?: string;
  scenes?: Scene[];
}

export default function FinalCut({ videoUrl, productName, scenes = [] }: FinalCutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Auto-scroll smoothly to the final video once loaded
  useEffect(() => {
    if (videoUrl && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }, [videoUrl]);

  // Safely trigger video playback on URL change or campaign switch
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            // Browsers may block un-muted autoplay without prior interaction
            console.warn("Autoplay notice:", err.message);
            setIsPlaying(false);
          });
      }
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const jumpToScene = (targetSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = targetSeconds;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  if (!videoUrl) return null;

  return (
    <section ref={containerRef} className="w-full mt-14 space-y-6 animate-film-pull">
      {/* Header with Production Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-text-muted/15 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-accent-amber uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-accent-amber animate-pulse" />
            <span>BROADCAST COMMERCIAL MASTER • READY TO AIR</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-text-primary tracking-tight">
            {productName ? `${productName} Commercial` : "Final Rendered Commercial"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-surface border border-accent-teal-bright/30 font-mono text-xs text-accent-teal-bright flex items-center gap-1.5 shadow-sm">
            <Film className="w-3.5 h-3.5" />
            <span>9:16 VERTICAL • 1080P MASTER</span>
          </span>
        </div>
      </div>

      {/* Surface Video Stage Container */}
      <div className="w-full p-6 sm:p-10 rounded-2xl bg-surface/90 backdrop-blur-xl border border-accent-amber/30 shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-amber/5 via-transparent to-accent-teal-bright/5 pointer-events-none" />

        {/* 9:16 Vertical Commercial Player */}
        <div className="relative w-full max-w-xs sm:max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-bg shadow-2xl border-2 border-accent-amber/40 group">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover rounded-2xl"
          >
            Your browser does not support HTML5 video playback.
          </video>

          {/* Quick HUD Controller Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-bg/80 backdrop-blur-md p-1.5 rounded-full border border-text-muted/30">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 rounded-full hover:bg-surface text-text-primary transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-surface text-text-primary transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-accent-teal-bright" />}
            </button>
            <button
              type="button"
              onClick={restartVideo}
              className="p-1 rounded-full hover:bg-surface text-text-primary transition-colors cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scene Jumpers / Chapter Buttons */}
        {scenes && scenes.length > 0 && (
          <div className="w-full max-w-lg space-y-2">
            <span className="font-mono text-[11px] text-text-muted/80 text-center block uppercase tracking-wider">
              Interactive Scene Chapters (Click to Jump)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scenes.map((scene, sIdx) => {
                const approxTime = sIdx * 5;
                const isActive = currentTime >= approxTime && (sIdx === scenes.length - 1 || currentTime < (sIdx + 1) * 5);

                return (
                  <button
                    key={scene.scene_number || sIdx}
                    type="button"
                    onClick={() => jumpToScene(approxTime)}
                    className={`p-2 rounded-lg border text-left transition-all font-mono text-[11px] flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? "bg-accent-amber/15 border-accent-amber text-accent-amber shadow-sm"
                        : "bg-bg/60 hover:bg-surface border-text-muted/20 text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">SCENE 0{scene.scene_number || sIdx + 1}</span>
                      <span className="text-[10px] text-text-muted">{sIdx * 5}s</span>
                    </div>
                    <span className="font-body text-[10px] line-clamp-1 mt-0.5 text-text-muted/80">
                      {scene.visual_description?.split(" ")[0] || `Cut ${sIdx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions & Specs Bar */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            <span>DIRECTOR MASTER • STEREO AUDIO</span>
          </div>

          <a
            href={videoUrl}
            download={`${productName ? productName.toLowerCase().replace(/\s+/g, "_") : "framezero"}_commercial.mp4`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 transition-all shadow-lg shadow-accent-amber/20 hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD MASTER (.MP4)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
