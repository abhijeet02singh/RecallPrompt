import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { Topic, DifficultyFilter } from "../../types";
import { getRandomTopicExcludingRecent } from "../../lib/randomTopic";
import { playSoftTick } from "../../lib/audio";

interface TopicSpinnerProps {
  categoryName: string;
  subcategoryName: string;
  topicPool: Topic[];
  currentTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  onContinue: () => void;
  onBack: () => void;
  continueButtonText?: string;
  modeLabel?: string;
}

export const TopicSpinner: React.FC<TopicSpinnerProps> = ({
  categoryName,
  subcategoryName,
  topicPool,
  currentTopic,
  onSelectTopic,
  onContinue,
  onBack,
  continueButtonText = "CONTINUE →",
  modeLabel = "Spin Topic",
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(Boolean(currentTopic));
  const [displayTitle, setDisplayTitle] = useState<string>(
    currentTopic ? currentTopic.title : ""
  );
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const spinIntervalRef = useRef<number | null>(null);

  // Filter pool based on difficulty
  const filteredPool =
    difficultyFilter === "All"
      ? topicPool
      : topicPool.filter((t) => t.difficulty === difficultyFilter);

  const startSpin = () => {
    if (isSpinning || filteredPool.length === 0) return;

    setIsSpinning(true);
    setHasSpun(true);
    let counter = 0;
    const maxTicks = 16;
    const intervalTime = 75; // ms

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = window.setInterval(() => {
      counter++;
      const randomCandidate =
        filteredPool[Math.floor(Math.random() * filteredPool.length)];
      if (randomCandidate) {
        setDisplayTitle(randomCandidate.title);
        playSoftTick();
      }

      if (counter >= maxTicks) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        const finalPick =
          getRandomTopicExcludingRecent(filteredPool) || filteredPool[0];
        setDisplayTitle(finalPick.title);
        onSelectTopic(finalPick);
        setIsSpinning(false);
      }
    }, intervalTime);
  };

  // Keyboard shortcuts: 'R' to spin again, 'Enter' to continue or spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        return;
      }

      if ((e.key === "r" || e.key === "R") && !isSpinning) {
        e.preventDefault();
        startSpin();
      } else if (e.key === "Enter" && !isSpinning) {
        e.preventDefault();
        if (currentTopic && hasSpun) {
          onContinue();
        } else {
          startSpin();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTopic, isSpinning, filteredPool, hasSpun]);

  return (
    <div className="w-full text-left">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-from-spinner"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] px-3.5 py-2 min-h-[44px] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] mb-6 sm:mb-8 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>&larr; Change Focus Area</span>
      </button>

      {/* Category / Subcategory Label & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-mono text-xs uppercase font-black px-2 py-0.5 border border-[#1C1917] bg-[#1E5F64] text-white">
            {categoryName}
          </span>
          <span className="font-display text-base sm:text-lg tracking-wide uppercase text-[#1C1917] dark:text-[#FAF6ED]">
            {subcategoryName === "All" ? `All ${categoryName} Topics` : subcategoryName}
          </span>
        </div>

        {/* Difficulty Retro Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[#78716C] mr-1 hidden sm:inline">Difficulty:</span>
          {(["All", "Beginner", "Intermediate", "Advanced"] as DifficultyFilter[]).map(
            (diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`cursor-pointer px-2.5 py-1.5 min-h-[36px] flex items-center text-[11px] font-bold uppercase tracking-wider border transition-all ${
                  difficultyFilter === diff
                    ? "bg-[#EBB140] text-[#1C1917] border-[#1C1917] shadow-retro-sm"
                    : "bg-transparent text-[#78716C] dark:text-[#A8A29E] border-transparent hover:border-[#1C1917]"
                }`}
              >
                {diff}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tactile Scrapbook Focal Card for Topic Roulette */}
      <div className="p-5 sm:p-8 md:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg paperclip relative mb-6 sm:mb-8 min-h-[240px] sm:min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 flex-wrap">
            <span className="font-mono text-[10px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm">
              {isSpinning ? "SPINNING ROULETTE..." : hasSpun ? "TOPIC ASSIGNED" : "STAGE READY"}
            </span>
            <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 select-none font-bold">
              {isSpinning ? "Hold tight..." : hasSpun ? "Explain without notes" : "Draw your prompt"}
            </span>
          </div>

          {/* Big Bebas Neue Topic Headline */}
          <h1
            className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.98] my-3 sm:my-4 transition-opacity duration-75 break-words ${
              isSpinning ? "opacity-70 scale-[0.99]" : "opacity-100"
            }`}
          >
            {isSpinning ? (
              displayTitle
            ) : hasSpun && currentTopic ? (
              currentTopic.title
            ) : (
              <span className="text-[#78716C] dark:text-[#A8A29E]">PRESS SPIN TO COMMENCE</span>
            )}
          </h1>
        </div>

        {/* Difficulty Meta Tag & Topic count */}
        <div className="pt-4 sm:pt-6 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {hasSpun && currentTopic && !isSpinning ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white font-bold uppercase">
                {currentTopic.difficulty}
              </span>
              {currentTopic.subcategory && (
                <span className="px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED]">
                  {currentTopic.subcategory}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[#78716C] dark:text-[#A8A29E]">
              {filteredPool.length} topics available in pool
            </span>
          )}

          <span className="font-script text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E]">
            Feynman Protocol Stage 1
          </span>
        </div>
      </div>

      {/* Retro Neobrutalist Action Controls */}
      {!hasSpun || isSpinning ? (
        /* Primary Action: SPIN */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={startSpin}
            disabled={isSpinning || filteredPool.length === 0}
            id="btn-spin-topic-primary"
            className="btn-retro w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-[#B91C4A] text-white font-display text-xl sm:text-2xl md:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer hover:bg-[#A0163E] transition-all disabled:opacity-40"
          >
            <span>{isSpinning ? "Selecting Topic..." : "SPIN ROULETTE"}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] text-center sm:text-right">
            Shortcut: Press <kbd className="px-1.5 py-0.5 border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#FAF6ED] dark:bg-[#22201D] font-bold">Enter</kbd> to spin
          </span>
        </div>
      ) : (
        /* Actions After Spinning: CONTINUE and SPIN AGAIN */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onContinue}
            id="btn-continue-topic"
            className="btn-retro w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-[#EBB140] text-[#1C1917] font-display text-xl sm:text-2xl md:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer hover:bg-[#DFC037] transition-all"
          >
            <span>{continueButtonText.replace("→", "").trim() || "CONTINUE"}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={startSpin}
            id="btn-spin-again"
            className="btn-retro w-full sm:w-auto px-5 py-3 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-display text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-[#F8F4EA] transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>Spin Again (R)</span>
          </button>
        </div>
      )}
    </div>
  );
};

