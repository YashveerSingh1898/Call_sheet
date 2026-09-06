"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function Preloader() {
  const [count, setCount] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  useEffect(() => {
    // Smooth fast loading progression (01 -> 02 -> 03 -> 100)
    const timer1 = setTimeout(() => setCount(28), 180);
    const timer2 = setTimeout(() => setCount(64), 380);
    const timer3 = setTimeout(() => setCount(92), 620);
    const timer4 = setTimeout(() => setCount(100), 820);
    const timer5 = setTimeout(() => setIsLoaded(true), 980);
    const timer6 = setTimeout(() => setIsRemoved(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-bg flex flex-col justify-between p-6 sm:p-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isLoaded ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
      }`}
    >
      {/* Top Preloader Brand */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
        <div className="flex items-center gap-2 text-accent-amber">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-widest uppercase">FRAMEZERO STUDIO</span>
        </div>
        <span className="text-[11px] text-accent-teal-bright">WEBGL ENGINE INITIALIZING</span>
      </div>

      {/* Center Big Typography Counter */}
      <div className="text-center space-y-2">
        <div className="font-display text-6xl sm:text-8xl md:text-9xl text-text-primary font-light tracking-tighter">
          {count < 10 ? `0${count}` : count < 100 ? `${count}` : "100"}
          <span className="text-accent-amber text-4xl sm:text-6xl font-sans">%</span>
        </div>
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Synthesizing Real-Time Shaders & Scene Graph
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-md mx-auto space-y-2">
        <div className="w-full h-1 bg-surface-raised rounded-full overflow-hidden border border-text-muted/15">
          <div
            className="h-full bg-gradient-to-r from-accent-amber via-accent-teal-bright to-accent-amber transition-all duration-300 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted/60">
          <span>PIPELINE: ACTIVE</span>
          <span>44.1kHz • 60FPS • THREE.JS</span>
        </div>
      </div>
    </div>
  );
}
