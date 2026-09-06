"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Layers } from "lucide-react";

export interface DeckInfo {
  id: string;
  number: string;
  name: string;
  subtitle: string;
}

export const DECKS: DeckInfo[] = [
  { id: "overview", number: "01", name: "OVERVIEW", subtitle: "Vision & Metrics" },
  { id: "pipeline", number: "02", name: "ENGINE", subtitle: "4-Stage Architecture" },
  { id: "features", number: "03", name: "CAPABILITIES", subtitle: "Director Specs" },
  { id: "showcase", number: "04", name: "CASE STUDIES", subtitle: "Commercial Storyboards" },
  { id: "studio-gateway", number: "05", name: "AI STUDIO", subtitle: "Launch Production" },
  { id: "faq", number: "06", name: "SPECS & FAQ", subtitle: "Technical Standards" },
];

export default function DeckNavigator() {
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const deckElements = DECKS.map((d) => document.getElementById(d.id));
      const scrollY = window.scrollY + window.innerHeight / 3;

      for (let i = deckElements.length - 1; i >= 0; i--) {
        const el = deckElements[i];
        if (el) {
          const top = el.offsetTop;
          if (scrollY >= top) {
            setActiveDeckIndex(i);
            break;
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (activeDeckIndex < DECKS.length - 1) {
          e.preventDefault();
          scrollToDeck(activeDeckIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (activeDeckIndex > 0) {
          e.preventDefault();
          scrollToDeck(activeDeckIndex - 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDeckIndex]);

  const scrollToDeck = (index: number) => {
    if (index >= 0 && index < DECKS.length) {
      const target = document.getElementById(DECKS[index].id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setActiveDeckIndex(index);
      }
    }
  };

  const currentDeck = DECKS[activeDeckIndex] || DECKS[0];

  return (
    <>
      {/* 1. Floating Top-Right Cyberpunk Deck Status Pill */}
      <div className="fixed top-20 right-4 sm:right-8 z-40 hidden md:flex items-center gap-3 bg-surface/90 backdrop-blur-md border border-accent-amber/30 px-3.5 py-1.5 rounded-full shadow-lg">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent-amber">
          <Layers className="w-3.5 h-3.5 text-accent-amber animate-pulse" />
          <span>SHEET {currentDeck.number} / 06</span>
        </div>
        <span className="text-text-muted/40">|</span>
        <span className="font-mono text-[11px] text-text-primary tracking-wider font-semibold">
          {currentDeck.name}
        </span>
        <div className="w-16 h-1 bg-bg rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-gradient-to-r from-accent-amber to-accent-teal-bright transition-all duration-300"
            style={{ width: `${((activeDeckIndex + 1) / DECKS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Floating Right Sidebar Deck Pagination Dots */}
      <nav
        aria-label="Deck Navigation"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 pointer-events-auto"
      >
        <div className="p-2 rounded-2xl bg-surface/80 backdrop-blur-md border border-text-muted/20 shadow-2xl flex flex-col items-center gap-2">
          {DECKS.map((deck, idx) => {
            const isActive = activeDeckIndex === idx;

            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => scrollToDeck(idx)}
                title={`Jump to Sheet ${deck.number}: ${deck.name} (${deck.subtitle})`}
                className={`group relative flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-8 h-8 rounded-lg bg-accent-amber text-bg font-bold font-mono text-xs shadow-md shadow-accent-amber/30"
                    : "w-7 h-7 rounded-md bg-bg/70 hover:bg-surface-raised border border-text-muted/20 text-text-muted hover:text-text-primary font-mono text-[10px]"
                }`}
              >
                <span>{deck.number}</span>

                {/* Hover Tooltip Card */}
                <div className="absolute right-10 px-3 py-1.5 rounded-lg bg-surface-raised border border-accent-amber/30 text-xs font-mono text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl flex items-center gap-2">
                  <span className="text-accent-amber font-semibold">SHEET {deck.number}:</span>
                  <span>{deck.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Floating Bottom Deck Controller Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-text-muted/25 px-3 py-1.5 rounded-full shadow-2xl">
        <button
          type="button"
          onClick={() => scrollToDeck(activeDeckIndex - 1)}
          disabled={activeDeckIndex === 0}
          className={`px-3 py-1 rounded-full font-mono text-xs flex items-center gap-1 transition-all ${
            activeDeckIndex === 0
              ? "opacity-30 cursor-not-allowed text-text-muted"
              : "hover:bg-surface-raised text-text-primary hover:text-accent-amber cursor-pointer"
          }`}
          aria-label="Previous Deck"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 font-mono text-xs text-text-muted">
          <span className="text-accent-amber font-bold">{currentDeck.number}</span>
          <span>/</span>
          <span>06</span>
          <span className="hidden md:inline text-text-primary font-medium ml-1">
            • {currentDeck.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => scrollToDeck(activeDeckIndex + 1)}
          disabled={activeDeckIndex === DECKS.length - 1}
          className={`px-3 py-1 rounded-full font-mono text-xs flex items-center gap-1 transition-all ${
            activeDeckIndex === DECKS.length - 1
              ? "opacity-30 cursor-not-allowed text-text-muted"
              : "hover:bg-surface-raised text-text-primary hover:text-accent-teal-bright cursor-pointer"
          }`}
          aria-label="Next Deck"
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
}
