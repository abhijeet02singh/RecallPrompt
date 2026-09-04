import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface ReflectionFormProps {
  topicTitle: string;
  categoryName: string;
  onFinish: (data: {
    confidence: number;
    knowledgeGaps: string[];
    blindSpotNotes: string;
  }) => void;
  title?: string;
  subtitle?: string;
}

export const KNOWLEDGE_GAP_OPTIONS = [
  "Couldn't define in plain language",
  "Couldn't explain underlying mechanism",
  "Couldn't provide a concrete analogy",
  "Couldn't explain why it matters",
  "Unsure of real-world production cases",
  "Forgot crucial edge-case details",
  "Couldn't articulate trade-offs or limits",
  "Couldn't compare with alternative tools",
];

export const ReflectionForm: React.FC<ReflectionFormProps> = ({
  topicTitle,
  categoryName,
  onFinish,
  title = "Self-reflection.",
  subtitle = "Assess where your explanation was strong and where your understanding broke down.",
}) => {
  const [confidence, setConfidence] = useState<number>(3);
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);
  const [blindSpotNotes, setBlindSpotNotes] = useState<string>("");

  const toggleGap = (gap: string) => {
    setSelectedGaps((prev) =>
      prev.includes(gap) ? prev.filter((g) => g !== gap) : [...prev, gap]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish({
      confidence,
      knowledgeGaps: selectedGaps,
      blindSpotNotes: blindSpotNotes.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full text-left py-2 sm:py-6"
    >
      {/* Header Slide Badge */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
            STAGE 04 &bull; RETROSPECTIVE
          </span>
          <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
            Audit your gaps honestly
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
          {title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex items-center gap-2 font-mono text-xs text-[#78716C] dark:text-[#A8A29E] flex-wrap">
          <span>Topic:</span>
          <span className="px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-bold break-words">
            {topicTitle}
          </span>
        </div>
      </div>

      {/* Section 1: Confidence Rating (Brutalist blocks) */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-5 sm:mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <label className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]">
            01 &bull; Articulation Confidence
          </label>
          <span className="font-mono text-xs font-bold text-[#B91C4A] dark:text-[#E11D48]">
            {confidence === 1
              ? "Struggled"
              : confidence === 3
              ? "Competent"
              : confidence === 5
              ? "Mastered"
              : `Level ${confidence} of 5`}
          </span>
        </div>

        {/* 5 Retro Numbered Blocks */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 py-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              id={`rating-${num}`}
              onClick={() => setConfidence(num)}
              className={`cursor-pointer py-3 min-h-[48px] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] font-display text-2xl sm:text-3xl transition-all ${
                confidence === num
                  ? "bg-[#EBB140] text-[#1C1917] shadow-retro font-bold translate-x-[-1px] translate-y-[-1px]"
                  : "bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] hover:bg-[#FAF6ED]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Where did you hesitate? */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-5 sm:mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label
            htmlFor="blind-spot-input"
            className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]"
          >
            02 &bull; Where did your explanation pause?
          </label>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E]">Field Observation</span>
        </div>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body mb-3">
          Capture the exact technical point or trade-off you had trouble recalling.
        </p>
        <textarea
          id="blind-spot-input"
          value={blindSpotNotes}
          onChange={(e) => setBlindSpotNotes(e.target.value)}
          placeholder="e.g. Stumbled when explaining how the B-tree rebalances during an insert..."
          rows={3}
          maxLength={2000}
          className="w-full p-3 min-h-[88px] bg-[#F8F4EA] dark:bg-[#181715] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#B91C4A] font-body text-sm resize-y shadow-retro-sm"
        />
      </div>

      {/* Section 3: Knowledge Breakdown Points */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-6 sm:mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <label className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]">
            03 &bull; Knowledge Breakdown Points
          </label>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E]">
            {selectedGaps.length} marked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {KNOWLEDGE_GAP_OPTIONS.map((gap, index) => {
            const isChecked = selectedGaps.includes(gap);
            return (
              <button
                type="button"
                key={gap}
                id={`gap-checkbox-${index}`}
                onClick={() => toggleGap(gap)}
                className={`group flex items-center gap-3 text-left p-3 min-h-[44px] border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] cursor-pointer transition-all ${
                  isChecked
                    ? "bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm border-l-4 border-l-[#B91C4A]"
                    : "bg-[#F8F4EA] dark:bg-[#181715] hover:bg-[#FAF6ED]"
                }`}
              >
                <div
                  className={`w-4 h-4 border-[1.5px] border-[#1C1917] flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#B91C4A] text-white"
                      : "bg-white dark:bg-[#22201D]"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span
                  className={`text-xs sm:text-sm font-body ${
                    isChecked
                      ? "text-[#1C1917] dark:text-[#FAF6ED] font-bold"
                      : "text-[#78716C] dark:text-[#A8A29E]"
                  }`}
                >
                  {gap}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action: FINISH SESSION */}
      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <button
          type="submit"
          id="btn-finish-session"
          className="btn-retro w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-[#1E5F64] text-white font-display text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer hover:bg-[#184F53] transition-all"
        >
          <span>ARCHIVE &amp; COMPLETE</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] text-center sm:text-right">
          Persists to local storage archive
        </span>
      </div>
    </form>
  );
};

