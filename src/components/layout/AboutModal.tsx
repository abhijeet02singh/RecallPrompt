import React, { useEffect } from "react";
import { siteConfig } from "../../config/site";
import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/70 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] p-4 sm:p-8 shadow-retro-lg paperclip relative text-left my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          id="btn-close-about"
          className="btn-retro absolute top-3 right-3 sm:top-4 sm:right-4 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center bg-[#FAF6ED] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 pr-8 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#1E5F64] text-white shadow-retro-sm">
            MANIFESTO
          </span>
          <span className="font-script text-sm sm:text-base text-[#1E5F64] dark:text-[#5EEAD4] -rotate-2 font-bold">
            Feynman Methodology
          </span>
        </div>

        <h2
          id="about-title"
          className="text-2xl sm:text-4xl font-display text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-3 break-words"
        >
          {siteConfig.name}
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed">
          <blockquote className="p-3 bg-[#F8F4EA] dark:bg-[#181715] border-l-4 border-l-[#B91C4A] border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED]/40 text-[#1C1917] dark:text-[#FAF6ED] font-body text-xs sm:text-sm font-medium italic">
            &ldquo;{siteConfig.subtext}&rdquo;
          </blockquote>

          <p>
            Passive reviewing, video courses, and skimming documentation create an illusion of competence.
            Real understanding only reveals itself when you are stripped of notes and forced to articulate concepts aloud against the clock.
          </p>

          <div className="pt-2">
            <span className="font-mono text-xs uppercase font-bold text-[#1C1917] dark:text-[#FAF6ED] block mb-2">
              The 5-Step Recall Protocol:
            </span>
            <div className="font-mono text-[11px] sm:text-xs space-y-1.5 p-3 bg-[#F8F4EA] dark:bg-[#181715] border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED]/40">
              <div className="flex items-center gap-2"><span className="text-[#B91C4A] font-bold">01</span><span>CURATE OR SPIN DRILL TOPIC</span></div>
              <div className="flex items-center gap-2"><span className="text-[#EBB140] font-bold">02</span><span>TIMED RESEARCH &amp; CONSOLIDATION</span></div>
              <div className="flex items-center gap-2"><span className="text-[#1E5F64] font-bold">03</span><span>REMOVE SUPPORT (ZERO NOTES DIRECTIVE)</span></div>
              <div className="flex items-center gap-2"><span className="text-[#1C1917] dark:text-white font-bold">04</span><span>EXPLAIN ALOUD UNDER TIME CEILING</span></div>
              <div className="flex items-center gap-2"><span className="text-[#B91C4A] font-bold">05</span><span>AUDIT BREAKDOWNS &amp; BLINDSPOTS</span></div>
            </div>
          </div>

          <p className="font-mono text-[11px] text-[#78716C] dark:text-[#A8A29E]">
            Zero accounts. Zero cloud telemetry. Everything stays stored in your browser session.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex justify-end">
          <button
            onClick={onClose}
            id="btn-about-close-cta"
            className="btn-retro px-5 py-2.5 min-h-[44px] bg-[#1C1917] text-[#FAF6ED] font-display text-base tracking-wider uppercase cursor-pointer"
          >
            DISMISS &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
