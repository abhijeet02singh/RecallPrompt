import React, { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getPracticeSessions, deletePracticeSession, clearAllSessions } from "../../lib/storage";
import { BlindSpotsView } from "./BlindSpotsView";
import { PracticeSession } from "../../types";

interface HistoryViewProps {
  onBack: () => void;
  onStartPractice: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onBack,
  onStartPractice,
}) => {
  const [sessions, setSessions] = useState<PracticeSession[]>(() =>
    getPracticeSessions()
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDelete = (id: string) => {
    deletePracticeSession(id);
    setSessions(getPracticeSessions());
  };

  const handleClearAll = () => {
    clearAllSessions();
    setSessions([]);
    setShowClearConfirm(false);
  };

  const totalSessions = sessions.length;
  const uniqueTopics = new Set(sessions.map((s) => s.topic)).size;
  const totalSeconds = sessions.reduce(
    (acc, s) => acc + (s.explanationTime || 0) + (s.researchTime || 0),
    0
  );
  const totalMinutes = Math.round(totalSeconds / 60);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full text-left py-2 sm:py-6">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-history"
        className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Deck</span>
      </button>

      {/* Screen Title Card */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#1E5F64] text-white shadow-retro-sm">
                LOGBOOK ARCHIVE
              </span>
              <span className="font-script text-base sm:text-lg text-[#1E5F64] dark:text-[#5EEAD4] -rotate-2 font-bold">
                Field documentation
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
              Memory Log.
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2">
              Chronological log of every articulation drill, rating, and identified blindspot.
            </p>
          </div>

          {sessions.length > 0 && (
            <div className="flex-shrink-0 w-full sm:w-auto">
              {showClearConfirm ? (
                <div className="p-3 bg-[#F8F4EA] dark:bg-[#181715] border-[1.5px] border-[#B91C4A] shadow-retro-sm flex flex-col gap-2 font-mono text-xs">
                  <span className="text-[#B91C4A] font-bold uppercase">Clear all logbook entries?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearAll}
                      className="px-3 py-1.5 min-h-[36px] bg-[#B91C4A] text-white font-bold border border-[#1C1917] cursor-pointer"
                    >
                      Yes, reset
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1.5 min-h-[36px] bg-[#FAF6ED] text-[#1C1917] border border-[#1C1917] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn-retro w-full sm:w-auto px-3.5 py-2 min-h-[44px] justify-center bg-[#FAF6ED] dark:bg-[#181715] text-[#78716C] hover:text-[#B91C4A] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                  title="Clear local history"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Archive</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overview Stats in Scrapbook Index Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="p-4 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm">
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#78716C] dark:text-[#A8A29E] block mb-1">
            Total Drills
          </span>
          <span className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1C1917] dark:text-[#FAF6ED]">
            {totalSessions}
          </span>
        </div>

        <div className="p-4 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm">
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#78716C] dark:text-[#A8A29E] block mb-1">
            Distinct Topics
          </span>
          <span className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1E5F64] dark:text-[#5EEAD4]">
            {uniqueTopics}
          </span>
        </div>

        <div className="p-4 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm">
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#78716C] dark:text-[#A8A29E] block mb-1">
            Total Speaking Time
          </span>
          <span className="font-display text-3xl sm:text-4xl md:text-5xl text-[#EBB140]">
            {totalMinutes}<span className="font-mono text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] ml-1">MIN</span>
          </span>
        </div>
      </div>

      {/* Sessions List or Empty State */}
      {sessions.length === 0 ? (
        <div className="p-8 sm:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro text-center my-6 sm:my-8">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-2">
            Logbook is clean.
          </p>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto mb-6 font-body">
            Your verbal explanations, ratings, and knowledge gaps will be stamped here automatically.
          </p>
          <button
            onClick={onStartPractice}
            id="btn-empty-start-practice"
            className="btn-retro w-full sm:w-auto px-6 py-3 min-h-[44px] justify-center bg-[#B91C4A] text-white font-display text-lg sm:text-xl tracking-wider uppercase cursor-pointer"
          >
            Launch First Drill &rarr;
          </button>
        </div>
      ) : (
        <div className="mb-10 sm:mb-12">
          <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] mb-4 flex flex-wrap items-center justify-between gap-2">
            <span>CHRONOLOGICAL FIELD ENTRIES ({sessions.length})</span>
            <span className="font-script text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E] -rotate-1 lowercase">
              persisted locally
            </span>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm transition-all relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <span className="px-1.5 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] font-bold text-[#1C1917] dark:text-[#FAF6ED]">
                        {formatDate(session.date)}
                      </span>
                      <span className="text-[#78716C] dark:text-[#A8A29E] font-bold uppercase">
                        &bull; {session.category}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-tight mt-1 break-words">
                      {session.topic}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-start flex-shrink-0">
                    <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 border-[1.5px] border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm text-center">
                      <span className="font-display text-lg sm:text-xl font-black block leading-none">
                        {session.confidence}/5
                      </span>
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider">
                        SCORE
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="btn-retro p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#F8F4EA] dark:bg-[#181715] text-[#78716C] hover:text-[#B91C4A] cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Gaps tags */}
                {session.knowledgeGaps && session.knowledgeGaps.length > 0 && (
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex flex-wrap gap-2">
                    {session.knowledgeGaps.map((gap, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] font-mono text-xs text-[#B91C4A] dark:text-[#E11D48] font-bold"
                      >
                        &#x2715; {gap}
                      </span>
                    ))}
                  </div>
                )}

                {/* Blind spot notes */}
                {session.blindSpotNotes && (
                  <div className="mt-3 p-2.5 bg-[#F8F4EA] dark:bg-[#181715] border-l-4 border-l-[#1E5F64] font-body text-xs sm:text-sm text-[#1C1917] dark:text-[#FAF6ED] italic">
                    &ldquo;{session.blindSpotNotes}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blind spots breakdown */}
      <BlindSpotsView onPracticeTopic={onStartPractice} />
    </div>
  );
};

