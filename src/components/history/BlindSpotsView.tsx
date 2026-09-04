import React from "react";
import { ArrowRight } from "lucide-react";
import { getPracticeSessions } from "../../lib/storage";

interface BlindSpotsViewProps {
  onPracticeTopic?: (topicTitle?: string) => void;
}

export const BlindSpotsView: React.FC<BlindSpotsViewProps> = ({
  onPracticeTopic,
}) => {
  const sessions = getPracticeSessions();

  // Filter sessions that have recorded gaps or blindspot notes
  const gapSessions = sessions.filter(
    (s) =>
      (s.knowledgeGaps && s.knowledgeGaps.length > 0) ||
      (s.blindSpotNotes && s.blindSpotNotes.trim().length > 0) ||
      s.confidence <= 2
  );

  // Group by topic
  const groupedByTopic: Record<
    string,
    {
      topic: string;
      category: string;
      gaps: string[];
      notes: string[];
      lowestConfidence: number;
    }
  > = {};

  gapSessions.forEach((s) => {
    if (!groupedByTopic[s.topic]) {
      groupedByTopic[s.topic] = {
        topic: s.topic,
        category: s.category,
        gaps: [],
        notes: [],
        lowestConfidence: s.confidence,
      };
    }

    if (s.confidence < groupedByTopic[s.topic].lowestConfidence) {
      groupedByTopic[s.topic].lowestConfidence = s.confidence;
    }

    if (s.knowledgeGaps) {
      s.knowledgeGaps.forEach((g) => {
        if (!groupedByTopic[s.topic].gaps.includes(g)) {
          groupedByTopic[s.topic].gaps.push(g);
        }
      });
    }

    if (s.blindSpotNotes && s.blindSpotNotes.trim()) {
      if (!groupedByTopic[s.topic].notes.includes(s.blindSpotNotes.trim())) {
        groupedByTopic[s.topic].notes.push(s.blindSpotNotes.trim());
      }
    }
  });

  const topicsList = Object.values(groupedByTopic);

  if (topicsList.length === 0) {
    return (
      <div className="p-5 sm:p-8 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm text-left mt-6 sm:mt-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-mono text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917]">
            SYNTHESIS
          </span>
          <span className="font-script text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E] -rotate-1">
            Zero blindspots indexed
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-2">
          Knowledge gaps archive.
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body">
          No breakdown points recorded yet. Whenever you mark hesitation or incomplete recall in your self-reflection, those concepts are indexed here for re-testing.
        </p>
      </div>
    );
  }

  return (
    <div className="text-left mt-8 sm:mt-10">
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
            BLINDSPOT RE-DRILL INDEX
          </span>
          <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
            Target weak spots
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
          Gaps to Master.
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body">
          Concepts where articulation stalled or hesitation was logged. Spin these again to cement true fluency.
        </p>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        {topicsList.map((item) => (
          <div
            key={item.topic}
            className="p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3">
              <div>
                <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] uppercase font-bold block mb-1">
                  {item.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-tight break-words">
                  {item.topic}
                </h3>
              </div>

              {onPracticeTopic && (
                <button
                  onClick={() => onPracticeTopic(item.topic)}
                  className="btn-retro w-full sm:w-auto px-4 py-2.5 min-h-[44px] justify-center bg-[#1E5F64] text-white font-display text-sm uppercase tracking-wider flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <span>DRILL AGAIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Gap points */}
            {item.gaps.length > 0 && (
              <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex flex-wrap gap-2">
                {item.gaps.map((gap, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] font-mono text-xs text-[#B91C4A] dark:text-[#E11D48] font-bold"
                  >
                    &#x2715; {gap}
                  </span>
                ))}
              </div>
            )}

            {/* Personal Notes */}
            {item.notes.length > 0 && (
              <div className="mt-3 space-y-1.5 border-l-4 border-l-[#EBB140] bg-[#F8F4EA] dark:bg-[#181715] p-2.5">
                {item.notes.map((note, i) => (
                  <p key={i} className="text-xs sm:text-sm font-body text-[#1C1917] dark:text-[#FAF6ED] italic">
                    &ldquo;{note}&rdquo;
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

