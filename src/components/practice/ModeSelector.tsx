import React from "react";
import { ArrowRight } from "lucide-react";
import { PracticeMode } from "../../types";

interface ModeSelectorProps {
  onSelectMode: (mode: PracticeMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  const modes: {
    id: PracticeMode;
    number: string;
    title: string;
    description: string;
    badge: string;
    accentColor: string;
    tagBg: string;
    tagText: string;
  }[] = [
     {
    id: "quick-think",
    number: "01",
    title: "Quick Think",
    description:
      "Get a random topic and explain what you already know. No notes. No research.",
    badge: "Test Your Memory",
    accentColor: "#EBB140",
    tagBg: "bg-[#EBB140]",
    tagText: "text-[#1C1917]",
  },
      {
    id: "understand-explain",
    number: "02",
    title: "Learn & Explain",
    description:
      "Pick a new topic, understand it first, then close everything and explain it in your own words.",
    badge: "Learn by Explaining",
    accentColor: "#B91C4A",
    tagBg: "bg-[#B91C4A]",
    tagText: "text-white",
  },
    {
    id: "interview",
    number: "03",
    title: "Interview Practice",
    description:
      "Practice answering real interview questions under time pressure and improve your responses.",
    badge: "Real-World Simulation",
    accentColor: "#1E5F64",
    tagBg: "bg-[#1E5F64]",
    tagText: "text-white",
  },
  ];

  return (
    <div className="w-full text-left">
      {/* Presentation Slide Cover Header */}
      <div className="pt-2 sm:pt-6 pb-8 sm:pb-12 relative">
        {/* Top of Slide 1 attribution */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm">
            <span className="w-2 h-2 rounded-full bg-[#B91C4A] border border-[#1C1917]" />
            <span className="font-mono text-xs font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]">
              made by{" "}
              <a
                href="https://instagram.com/ankiit_singhh16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B91C4A] dark:text-[#E11D48] underline underline-offset-2 hover:opacity-80 transition-opacity font-black"
                id="author-credit-ankiit"
              >
                @ankiit_singhh16
              </a>
            </span>
          </div>

          <span className="font-script text-sm sm:text-base text-[#1E5F64] dark:text-[#5EEAD4] -rotate-2 font-bold select-none">
            Curated Edition
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm">
            SLIDE 01 &bull; PROTOCOL SELECTION
          </span>
          <span className="font-script text-base sm:text-xl text-[#B91C4A] dark:text-[#E11D48] -rotate-3 select-none">
            Choose your practice archetype
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#1C1917] dark:text-[#FAF6ED] leading-[0.95] uppercase tracking-wide my-3 break-words">
          Master Any Topic<br />
          Through Recall.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#78716C] dark:text-[#A8A29E] max-w-xl font-body leading-relaxed mt-3">
         Pick a topic, think it through, and explain it in your own words—without notes or help.
        </p>
      </div>

      {/* Scrapbook Cards with Metallic Paperclip & Hard Shadows */}
      <div className="space-y-4 sm:space-y-6">
        {modes.map((mode, idx) => (
          <button
            key={mode.id}
            id={`mode-${mode.id}`}
            onClick={() => onSelectMode(mode.id)}
            className={`group w-full text-left p-5 sm:p-7 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer relative block ${
              idx === 0 ? "paperclip" : idx === 1 ? "tape-strip" : "paperclip-right"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 pr-0 sm:pr-4 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="font-mono text-xs font-black text-[#1C1917] dark:text-[#FAF6ED] px-2 py-0.5 border border-[#1C1917] dark:border-[#FAF6ED] bg-[#F8F4EA] dark:bg-[#181715]">
                    {mode.number}
                  </span>

                  <span className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1C1917] ${mode.tagBg} ${mode.tagText} shadow-retro-sm`}>
                    {mode.badge}
                  </span>

                  <span className="font-script text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E] -rotate-2 hidden sm:inline-block">
                    {mode.id === "quick-think" ? "no research delay" : mode.id === "understand-explain" ? "deep synthesis" : "timed mock"}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide group-hover:text-[#B91C4A] dark:group-hover:text-[#E11D48] transition-colors leading-tight">
                  {mode.title}
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed max-w-xl">
                  {mode.description}
                </p>
              </div>

              {/* Action trigger button */}
              <div className="w-full sm:w-auto mt-1 sm:mt-0 flex-shrink-0">
                <div className="btn-retro w-full sm:w-auto justify-center px-4 py-2.5 min-h-[44px] bg-[#FAF6ED] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-display text-sm tracking-wider uppercase flex items-center gap-2 group-hover:bg-[#1C1917] group-hover:text-white dark:group-hover:bg-[#FAF6ED] dark:group-hover:text-[#1C1917] transition-colors">
                  <span>Enter Stage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Scrapbook Bottom Annotations */}
      <div className="mt-12 pt-6 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#78716C]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1E5F64]" />
          <span>Local Storage Persistence &bull; Zero Backend Telemetry</span>
        </div>
        <div className="font-script text-base text-[#1C1917] dark:text-[#FAF6ED] -rotate-1 mt-2 sm:mt-0">
          The true test of understanding is articulation.
        </div>
      </div>
    </div>
  );
};

