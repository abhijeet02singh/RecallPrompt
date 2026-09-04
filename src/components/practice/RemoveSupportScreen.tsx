import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface RemoveSupportScreenProps {
  topicTitle: string;
  onReady: () => void;
}

export const RemoveSupportScreen: React.FC<RemoveSupportScreenProps> = ({
  topicTitle,
  onReady,
}) => {
  // Enter key to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onReady();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReady]);

  return (
    <div className="w-full text-left pt-2 sm:pt-6 pb-12">
      {/* Slide Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
          PROTOCOL &bull; ZERO NOTES DIRECTIVE
        </span>
        <span className="font-script text-lg sm:text-xl text-[#B91C4A] dark:text-[#E11D48] -rotate-3 select-none font-bold">
          Close every reference
        </span>
      </div>

      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-[#1C1917] dark:text-[#FAF6ED] leading-[0.95] uppercase tracking-wide my-3">
        Remove Support.
      </h1>

      <p className="text-base sm:text-lg text-[#78716C] dark:text-[#A8A29E] max-w-xl font-body leading-relaxed mb-8">
        Close all editor tabs, Google searches, cheat-sheets, and documentation. You are now testing what has actually integrated into your brain.
      </p>

      {/* Tactile Polaroid / Card Framing for the Target Topic */}
      <div className="p-8 sm:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg tape-strip relative my-8">
        <span className="font-mono text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm inline-block mb-4">
          TARGET RECALL PROMPT
        </span>

        <h2 className="font-display text-4xl sm:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95]">
          &ldquo;{topicTitle}&rdquo;
        </h2>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#78716C] dark:text-[#A8A29E]">
          <span>Speak aloud into the room or record your voice.</span>
          <span className="font-script text-base text-[#1C1917] dark:text-[#FAF6ED] -rotate-1">
            Explain to an intelligent novice.
          </span>
        </div>
      </div>

      {/* Retro Neobrutalist Action Trigger */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onReady}
          id="btn-remove-support-ready"
          className="btn-retro px-8 py-4 bg-[#B91C4A] text-white font-display text-2xl sm:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer hover:bg-[#A0163E] transition-all"
        >
          <span>BEGIN EXPLANATION</span>
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E]">
          Shortcut: Press <kbd className="px-1.5 py-0.5 border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#FAF6ED] dark:bg-[#22201D] font-bold">Enter</kbd> to start
        </span>
      </div>
    </div>
  );
};

