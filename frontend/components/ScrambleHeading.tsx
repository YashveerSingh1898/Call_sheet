"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface ScrambleHeadingProps {
  text?: string;
  className?: string;
}

const CYBER_GLYPHS = "01#$_%&<>*~+=/\\?[]{}!XKZ";

export default function ScrambleHeading({
  text = "FRAMEZERO",
  className = "",
}: ScrambleHeadingProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [transformStyle, setTransformStyle] = useState<string>("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startScramble = useCallback(() => {
    clearScramble();
    let iteration = 0;
    const maxIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return text[index];
            }
            return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          })
          .join("");
      });

      iteration += 1;

      if (iteration >= maxIterations) {
        clearScramble();
        setDisplayText(text);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    return () => clearScramble();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    startScramble();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    clearScramble();
    setDisplayText(text);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Zoom out depth (scale 0.96) + 3D tilt
    const rotateX = (-y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 12;

    setTransformStyle(
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale(0.96)`
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={startScramble}
      className="relative group inline-block cursor-pointer select-none transition-transform duration-200 ease-out py-2"
      style={{
        transform: transformStyle || "perspective(1000px) scale(1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background ambient glowing aura on hover/zoom */}
      <div
        className={`absolute -inset-4 bg-gradient-to-r from-accent-amber/25 via-yellow-300/20 to-accent-teal-bright/25 rounded-3xl blur-2xl transition-all duration-500 pointer-events-none ${
          isHovered ? "opacity-100 scale-105" : "opacity-0 scale-90"
        }`}
      />

      {/* Cyber Grid Crosshairs on Hover */}
      <div
        className={`absolute -top-1 -left-2 text-[10px] font-mono text-accent-amber pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        [+]
      </div>
      <div
        className={`absolute -bottom-1 -right-2 text-[10px] font-mono text-accent-teal-bright pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        [SYS.AI]
      </div>

      {/* Main Scrambling Gradient Headline */}
      <h1
        className={`font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-amber via-yellow-100 to-accent-teal-bright uppercase leading-[1.08] drop-shadow-md transition-all duration-300 ${
          isHovered ? "tracking-wider text-amber-200" : ""
        } ${className}`}
      >
        {displayText}
      </h1>

      {/* Interactive Cyber Indicator Tag */}
      <div
        className={`flex items-center justify-center gap-1.5 pt-1 text-[11px] font-mono text-accent-amber/70 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-ping" />
        <span>REACTIVE MATRIX HOVER ACTIVE</span>
      </div>
    </div>
  );
}
