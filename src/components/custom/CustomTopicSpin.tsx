import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Play } from "lucide-react";
import { CustomCollection, Topic } from "../../types";
import { customTopicToTopic, saveRecentTopic } from "../../lib/storage";
import { getRandomTopicExcludingRecent } from "../../lib/randomTopic";
import { playSoftTick } from "../../lib/audio";

interface CustomTopicSpinProps {
  collection: CustomCollection;
  onContinue: (topic: Topic) => void;
  onBack: () => void;
  modeLabel?: string;
}

export const CustomTopicSpin: React.FC<CustomTopicSpinProps> = ({
  collection,
  onContinue,
  onBack,
  modeLabel = "Understand & Explain",
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [displayTitle, setDisplayTitle] = useState<string>("");
  const [hasSpunAtLeastOnce, setHasSpunAtLeastOnce] = useState(false);
  const spinIntervalRef = useRef<number | null>(null);

  // Convert custom topics to unified Topic objects
  const unifiedTopics: Topic[] = collection.topics.map((ct) =>
    customTopicToTopic(ct, collection.name)
  );

  const startSpin = () => {
    if (isSpinning || unifiedTopics.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const maxTicks = 14;
    const intervalTime = 75;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = window.setInterval(() => {
      counter++;
      const randomCandidate =
        unifiedTopics[Math.floor(Math.random() * unifiedTopics.length)];
      if (randomCandidate) {
        setDisplayTitle(randomCandidate.title);
        playSoftTick();
      }

      if (counter >= maxTicks) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        const finalPick =
          getRandomTopicExcludingRecent(unifiedTopics) || unifiedTopics[0];
        setDisplayTitle(finalPick.title);
        setSelectedTopic(finalPick);
        saveRecentTopic(finalPick.title);
        setIsSpinning(false);
        setHasSpunAtLeastOnce(true);
      }
    }, intervalTime);
  };

  // Keyboard shortcut: 'R' to spin again, 'Enter' to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        return;
      }

      if ((e.key === "r" || e.key === "R") && !isSpinning && hasSpunAtLeastOnce) {
        e.preventDefault();
        startSpin();
      } else if (e.key === "Enter" && selectedTopic && !isSpinning) {
        e.preventDefault();
        onContinue(selectedTopic);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTopic, isSpinning, hasSpunAtLeastOnce, unifiedTopics]);

  return (
    <div className="w-full text-left py-2 sm:py-6">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-from-custom-spin"
        className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change Collection</span>
      </button>

      {/* Header Info Card */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
                ROULETTE &bull; {modeLabel.toUpperCase()}
              </span>
              <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
                Spontaneous draw
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
              {collection.name}
            </h2>
          </div>

          <div className="font-mono text-xs font-bold px-3 py-1.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm flex-shrink-0 self-start sm:self-center">
            {collection.topics.length} TOPICS IN ROTATION
          </div>
        </div>
      </div>

      {/* Roulette Focal Card */}
      <div className="min-h-[220px] sm:min-h-[300px] p-4 sm:p-10 bg-[#FAF6ED] dark:bg-[#22201D] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg tape-strip relative flex flex-col justify-between my-6 sm:my-8">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-xs uppercase font-black px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917]">
            {hasSpunAtLeastOnce ? "DRAW RESULT" : "READY TO DRAW"}
          </span>
          <span className="font-script text-sm sm:text-base text-[#1E5F64] dark:text-[#5EEAD4] -rotate-2 font-bold">
            No rehearsal allowed
          </span>
        </div>

        <div className="py-6 sm:py-8 my-auto text-center sm:text-left">
          {hasSpunAtLeastOnce ? (
            <h1
              className={`font-display text-2xl sm:text-5xl md:text-6xl uppercase tracking-wide text-[#1C1917] dark:text-[#FAF6ED] leading-[0.95] break-words transition-opacity duration-100 ${
                isSpinning ? "opacity-40" : "opacity-100"
              }`}
            >
              {displayTitle || "Drawing topic..."}
            </h1>
          ) : (
            <div className="space-y-2">
              <p className="font-display text-2xl sm:text-4xl uppercase tracking-wide text-[#1C1917] dark:text-[#FAF6ED] break-words">
                Randomly draw a topic from {collection.name}.
              </p>
              <p className="font-body text-xs sm:text-base text-[#78716C] dark:text-[#A8A29E]">
                Test your raw ability to recall and break down concepts cleanly on demand.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t-2 border-[#1C1917] dark:border-[#FAF6ED] pt-3 sm:pt-4 font-mono text-[11px] sm:text-xs text-[#78716C] dark:text-[#A8A29E] font-bold">
          <span className="break-all">COLLECTION: {collection.name.toUpperCase()}</span>
          <span>{collection.topics.length} ITEMS TOTAL</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        {!hasSpunAtLeastOnce ? (
          <button
            id="btn-custom-spin-initial"
            onClick={startSpin}
            disabled={isSpinning}
            className="btn-retro w-full py-3.5 sm:py-4 px-6 sm:px-8 min-h-[48px] bg-[#B91C4A] text-white font-display text-xl sm:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Spin Roulette Now</span>
          </button>
        ) : (
          <>
            <button
              id="btn-custom-spin-again"
              onClick={startSpin}
              disabled={isSpinning}
              className="btn-retro py-3 sm:py-3.5 px-5 sm:px-6 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-display text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <RotateCw
                className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`}
              />
              <span>Spin Again</span>
            </button>

            <button
              id="btn-custom-continue-practice"
              onClick={() => selectedTopic && onContinue(selectedTopic)}
              disabled={!selectedTopic || isSpinning}
              className="btn-retro flex-1 py-3 sm:py-3.5 px-6 sm:px-8 min-h-[44px] bg-[#1E5F64] text-white font-display text-xl sm:text-2xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Begin Session &rarr;</span>
            </button>
          </>
        )}
      </div>

      {/* Hint */}
      <div className="mt-8 text-center text-xs text-[#78716C] dark:text-[#A8A29E] font-mono flex items-center justify-center gap-3">
        <span>Press <kbd className="px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] font-bold shadow-retro-sm text-xs">R</kbd> to spin</span>
        <span>&bull;</span>
        <span><kbd className="px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] font-bold shadow-retro-sm text-xs">Enter</kbd> to continue</span>
      </div>
    </div>
  );
};
