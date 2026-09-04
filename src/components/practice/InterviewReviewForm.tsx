import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface InterviewReviewFormProps {
  questionTitle: string;
  interviewType: string;
  onFinish: (data: {
    confidence: number;
    knowledgeGaps: string[];
    blindSpotNotes: string;
    interviewReview: {
      situation: boolean;
      task: boolean;
      action: boolean;
      result: boolean;
      specificExample: boolean;
      clearOutcome: boolean;
      personalContribution: boolean;
      whatYouLearned: boolean;
    };
  }) => void;
}

export const InterviewReviewForm: React.FC<InterviewReviewFormProps> = ({
  questionTitle,
  interviewType,
  onFinish,
}) => {
  const [confidence, setConfidence] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");

  // STAR framework checklist
  const [situation, setSituation] = useState(false);
  const [task, setTask] = useState(false);
  const [action, setAction] = useState(false);
  const [result, setResult] = useState(false);

  // Quality checks
  const [specificExample, setSpecificExample] = useState(false);
  const [clearOutcome, setClearOutcome] = useState(false);
  const [personalContribution, setPersonalContribution] = useState(false);
  const [whatYouLearned, setWhatYouLearned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gaps: string[] = [];
    if (!situation) gaps.push("Missing clear Situation context");
    if (!task) gaps.push("Task / core conflict unclear");
    if (!action) gaps.push("Action lacked specific personal steps");
    if (!result) gaps.push("Result had no measurable outcome");
    if (!specificExample) gaps.push("Answer was too theoretical without a specific example");
    if (!personalContribution) gaps.push("Used 'we' too much instead of personal ownership");
    if (!whatYouLearned) gaps.push("Forgot reflection on key takeaways");

    onFinish({
      confidence,
      knowledgeGaps: gaps,
      blindSpotNotes: notes.trim(),
      interviewReview: {
        situation,
        task,
        action,
        result,
        specificExample,
        clearOutcome,
        personalContribution,
        whatYouLearned,
      },
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
            INTERVIEW AUDIT
          </span>
          <span className="font-script text-base sm:text-lg text-[#1E5F64] dark:text-[#5EEAD4] -rotate-2 font-bold">
            {interviewType}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
          Critique Delivery.
        </h1>

        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex items-center gap-2 font-mono text-xs text-[#78716C] dark:text-[#A8A29E] flex-wrap">
          <span>Question:</span>
          <span className="px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-bold break-words">
            &ldquo;{questionTitle}&rdquo;
          </span>
        </div>
      </div>

      {/* Section 1: STAR Components (4 retro cards) */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-5 sm:mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <label className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]">
            01 &bull; STAR Framework Completeness
          </label>
          <span className="font-mono text-xs font-bold text-[#1E5F64] dark:text-[#5EEAD4]">
            Checked: {[situation, task, action, result].filter(Boolean).length} / 4
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: "Situation", val: situation, set: setSituation, desc: "Context & project", color: "#B91C4A" },
            { label: "Task", val: task, set: setTask, desc: "Core challenge", color: "#EBB140" },
            { label: "Action", val: action, set: setAction, desc: "Specific decisions", color: "#1E5F64" },
            { label: "Result", val: result, set: setResult, desc: "Quantified metric", color: "#1C1917" },
          ].map(({ label, val, set, desc }) => (
            <button
              type="button"
              key={label}
              onClick={() => set(!val)}
              className={`p-3 min-h-[44px] border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] text-left cursor-pointer transition-all ${
                val
                  ? "bg-[#F8F4EA] dark:bg-[#181715] shadow-retro-sm translate-x-[-1px] translate-y-[-1px]"
                  : "bg-[#FAF6ED] dark:bg-[#22201D] hover:bg-[#F8F4EA]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 border-[1.5px] border-[#1C1917] flex items-center justify-center flex-shrink-0 transition-colors ${
                    val
                      ? "bg-[#1E5F64] text-white"
                      : "bg-white dark:bg-[#22201D]"
                  }`}
                >
                  {val && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="font-display text-base sm:text-lg tracking-wide uppercase text-[#1C1917] dark:text-[#FAF6ED]">
                  {label}
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] font-mono leading-tight">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Delivery Checklist */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-5 sm:mb-6">
        <label className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED] block mb-3">
          02 &bull; Articulation &amp; Story Quality
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {[
            {
              label: "Grounded in a specific concrete situation",
              val: specificExample,
              set: setSpecificExample,
            },
            {
              label: "Clear outcome with measurable numbers",
              val: clearOutcome,
              set: setClearOutcome,
            },
            {
              label: "Stated personal ownership (avoided vague 'we')",
              val: personalContribution,
              set: setPersonalContribution,
            },
            {
              label: "Reflected on lessons learned & retrospectives",
              val: whatYouLearned,
              set: setWhatYouLearned,
            },
          ].map(({ label, val, set }) => (
            <button
              type="button"
              key={label}
              onClick={() => set(!val)}
              className={`p-3 min-h-[44px] border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] flex items-center gap-3 text-left cursor-pointer transition-all ${
                val
                  ? "bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm border-l-4 border-l-[#1E5F64]"
                  : "bg-[#F8F4EA] dark:bg-[#181715] hover:bg-[#FAF6ED]"
              }`}
            >
              <div
                className={`w-4 h-4 border-[1.5px] border-[#1C1917] flex items-center justify-center flex-shrink-0 transition-colors ${
                  val
                    ? "bg-[#1E5F64] text-white"
                    : "bg-white dark:bg-[#22201D]"
                }`}
              >
                {val && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span
                className={`text-xs sm:text-sm font-body ${
                  val
                    ? "text-[#1C1917] dark:text-[#FAF6ED] font-bold"
                    : "text-[#78716C] dark:text-[#A8A29E]"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Delivery Poise Rating */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-5 sm:mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <label className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]">
            03 &bull; Answer Delivery &amp; Poise
          </label>
          <span className="font-mono text-xs font-bold text-[#B91C4A] dark:text-[#E11D48]">
            {confidence === 1
              ? "Hesitant"
              : confidence === 3
              ? "Competent"
              : confidence === 5
              ? "Compelling"
              : `Rating: ${confidence} of 5`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4 py-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              id={`interview-rating-${num}`}
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

      {/* Section 4: What would you improve? */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-6 sm:mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <label
            htmlFor="interview-notes"
            className="font-mono text-xs uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED]"
          >
            04 &bull; Retrospective Notes
          </label>
          <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E]">Field Observation</span>
        </div>
        <textarea
          id="interview-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Spent too much time setting background context. Get to the action faster and quantify the 20% latency reduction..."
          rows={3}
          maxLength={2000}
          className="w-full p-3 min-h-[88px] bg-[#F8F4EA] dark:bg-[#181715] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E5F64] font-body text-sm resize-y shadow-retro-sm"
        />
      </div>

      {/* Action: FINISH SESSION */}
      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <button
          type="submit"
          id="btn-finish-interview-session"
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

