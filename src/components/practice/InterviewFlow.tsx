import React, { useState } from "react";
import { Topic } from "../../types";
import { interviewTopics } from "../../data/topics/interview";
import { TopicSpinner } from "./TopicSpinner";
import { TimerDisplay } from "./TimerDisplay";
import { PracticeFramework } from "./PracticeFramework";
import { InterviewReviewForm } from "./InterviewReviewForm";
import { useTimer } from "../../hooks/useTimer";
import { savePracticeSession, saveRecentTopic } from "../../lib/storage";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Step = "type" | "spin" | "prepare" | "answer" | "review";

interface InterviewFlowProps {
  onFinish: () => void;
  onExit: () => void;
}

const INTERVIEW_TYPES = [
  {
    id: "Behavioral",
    title: "Behavioral Interview",
    description: "STAR method questions evaluating conflict resolution, failures, and leadership.",
  },
  {
    id: "HR",
    title: "HR & Culture Interview",
    description: "Motivation, company alignment, career progression, and strengths / weaknesses.",
  },
  {
    id: "Technical",
    title: "Technical & Systems",
    description: "System design, distributed architectures, web internals, and concurrency.",
  },
  {
    id: "Case",
    title: "Case & Business Scenarios",
    description: "Root cause diagnostics, market sizing, and monetization strategy.",
  },
];

export const InterviewFlow: React.FC<InterviewFlowProps> = ({
  onFinish,
  onExit,
}) => {
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<string>("Behavioral");
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Durations
  const [prepDuration, setPrepDuration] = useState<number>(60); // 1 min default
  const [answerDuration, setAnswerDuration] = useState<number>(120); // 2 min default
  const [prepSecondsSpent, setPrepSecondsSpent] = useState<number>(0);
  const [answerSecondsSpent, setAnswerSecondsSpent] = useState<number>(0);

  // Preparation timer
  const prepTimer = useTimer({
    initialSeconds: prepDuration,
    onComplete: () => {
      setPrepSecondsSpent(prepDuration);
      setStep("answer");
    },
  });

  // Answer timer
  const answerTimer = useTimer({
    initialSeconds: answerDuration,
    onComplete: () => {
      setAnswerSecondsSpent(answerDuration);
      setStep("review");
    },
  });

  // Filter questions for the selected type
  const typeQuestions = interviewTopics.filter((q) => {
    if (selectedType === "Case") {
      return q.interviewType === "Case" || q.subcategory === "Case Interview";
    }
    return q.interviewType === selectedType || q.subcategory === selectedType;
  });

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentTopic(null);
    setStep("spin");
  };

  const handleContinueToPrepare = () => {
    if (!currentTopic) return;
    saveRecentTopic(currentTopic.title);
    prepTimer.reset(prepDuration);
    setStep("prepare");
  };

  const handleStartAnswering = () => {
    setPrepSecondsSpent(prepDuration - prepTimer.secondsLeft);
    prepTimer.pause();
    answerTimer.reset(answerDuration);
    answerTimer.start();
    setStep("answer");
  };

  const handleSkipPreparation = () => {
    setPrepSecondsSpent(0);
    prepTimer.pause();
    answerTimer.reset(answerDuration);
    answerTimer.start();
    setStep("answer");
  };

  const handleEndAnswering = () => {
    setAnswerSecondsSpent(answerDuration - answerTimer.secondsLeft);
    answerTimer.pause();
    setStep("review");
  };

  const handleSaveReview = (data: {
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
  }) => {
    if (!currentTopic) return;

    savePracticeSession({
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      mode: "interview",
      category: "Interview Preparation",
      subcategory: selectedType,
      topic: currentTopic.title,
      difficulty: currentTopic.difficulty,
      preparationTime: prepSecondsSpent,
      explanationTime: answerSecondsSpent || (answerDuration - answerTimer.secondsLeft),
      confidence: data.confidence,
      knowledgeGaps: data.knowledgeGaps,
      blindSpotNotes: data.blindSpotNotes,
      interviewReview: data.interviewReview,
    });

    onFinish();
  };

  return (
    <div>
      {step === "type" && (
        <div className="w-full text-left py-2 sm:py-6">
          <button
            onClick={onExit}
            id="btn-back-interview-home"
            className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tracks</span>
          </button>

          <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
                STAGE 01 &bull; INTERVIEW TRACK
              </span>
              <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
                Simulation drill
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
              Select Question Type.
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2">
              Practice answering authentic industry questions aloud under time constraints with zero rehearsal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {INTERVIEW_TYPES.map((t, idx) => (
              <button
                key={t.id}
                id={`interview-type-${t.id}`}
                onClick={() => handleSelectType(t.id)}
                className="group p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm hover:shadow-retro hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-left cursor-pointer relative min-h-[44px]"
              >
                <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
                  <span className="font-mono text-xs font-black px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
                    TRACK 0{idx + 1}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#1C1917] dark:text-[#FAF6ED] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-1">
                  {t.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "spin" && (
        <TopicSpinner
          categoryName="Interview Preparation"
          subcategoryName={selectedType}
          topicPool={typeQuestions.length > 0 ? typeQuestions : interviewTopics}
          currentTopic={currentTopic}
          onSelectTopic={(t) => setCurrentTopic(t)}
          onContinue={handleContinueToPrepare}
          onBack={() => setStep("type")}
          continueButtonText="Start Preparation &rarr;"
          modeLabel="Interview Question"
        />
      )}

      {step === "prepare" && currentTopic && (
        <div>
          <TimerDisplay
            timer={prepTimer}
            presetDurations={[
              { label: "30s", seconds: 30 },
              { label: "1 min", seconds: 60 },
              { label: "2 min", seconds: 120 },
            ]}
            currentDurationSeconds={prepDuration}
            onSelectDuration={(secs) => {
              setPrepDuration(secs);
              prepTimer.reset(secs);
            }}
            title="Step 03 &bull; Organize Response"
            subtitle="Structure your examples, key results, and talking points in your mind."
            topicTitle={currentTopic.title}
            categoryLabel={`${selectedType} Interview Question`}
            primaryActionLabel="Answer Aloud Now &rarr;"
            onPrimaryAction={handleStartAnswering}
            secondaryActionLabel="Skip Preparation"
            onSecondaryAction={handleSkipPreparation}
          />
          <PracticeFramework
            type={selectedType === "Behavioral" ? "behavioral" : "general"}
          />
        </div>
      )}

      {step === "answer" && currentTopic && (
        <div>
          <TimerDisplay
            timer={answerTimer}
            presetDurations={[
              { label: "1 min", seconds: 60 },
              { label: "2 min", seconds: 120 },
              { label: "3 min", seconds: 180 },
              { label: "5 min", seconds: 300 },
            ]}
            currentDurationSeconds={answerDuration}
            onSelectDuration={(secs) => {
              setAnswerDuration(secs);
              answerTimer.reset(secs);
            }}
            title="Step 04 &bull; Answer Aloud"
            subtitle="Speak aloud with conviction. Focus on concise structure and measurable impact."
            topicTitle={currentTopic.title}
            categoryLabel={`${selectedType} Interview Question`}
            primaryActionLabel="Finish &amp; Review &rarr;"
            onPrimaryAction={handleEndAnswering}
            secondaryActionLabel="End Answer Early"
            onSecondaryAction={handleEndAnswering}
            isExplanationMode={true}
          />
          <PracticeFramework
            type={selectedType === "Behavioral" ? "behavioral" : "general"}
          />
        </div>
      )}

      {step === "review" && currentTopic && (
        <InterviewReviewForm
          questionTitle={currentTopic.title}
          interviewType={selectedType}
          onFinish={handleSaveReview}
        />
      )}
    </div>
  );
};
