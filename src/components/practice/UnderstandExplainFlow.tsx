import React, { useState, useEffect } from "react";
import { Category, CustomCollection, Topic } from "../../types";
import { CATEGORIES } from "../../data/categories";
import { getTopicsByCategory, getTopicsBySubcategory, allTopics } from "../../data/topics";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { TopicSpinner } from "./TopicSpinner";
import { TimerDisplay } from "./TimerDisplay";
import { RemoveSupportScreen } from "./RemoveSupportScreen";
import { PracticeFramework } from "./PracticeFramework";
import { ReflectionForm } from "./ReflectionForm";
import { CustomCollectionSelector } from "../custom/CustomCollectionSelector";
import { CustomTopicSpin } from "../custom/CustomTopicSpin";
import { useTimer } from "../../hooks/useTimer";
import { savePracticeSession, saveRecentTopic } from "../../lib/storage";

type Step =
  | "category"
  | "subcategory"
  | "spin"
  | "custom-collections"
  | "custom-spin"
  | "research"
  | "remove-support"
  | "explain"
  | "reflection";

interface UnderstandExplainFlowProps {
  onFinish: () => void;
  onExit: () => void;
  initialTopic?: Topic | null;
  initialCollection?: CustomCollection | null;
}

export const UnderstandExplainFlow: React.FC<UnderstandExplainFlowProps> = ({
  onFinish,
  onExit,
  initialTopic,
  initialCollection,
}) => {
  const [step, setStep] = useState<Step>(() => {
    if (initialTopic) return "research";
    if (initialCollection) return "custom-spin";
    return "category";
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [topicPool, setTopicPool] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(initialTopic || null);
  const [activeCustomCollection, setActiveCustomCollection] = useState<CustomCollection | null>(
    initialCollection || null
  );

  // Timer durations
  const [researchDuration, setResearchDuration] = useState<number>(600); // 10 min default
  const [explainDuration, setExplainDuration] = useState<number>(300); // 5 min default
  const [researchSecondsSpent, setResearchSecondsSpent] = useState<number>(0);
  const [explainSecondsSpent, setExplainSecondsSpent] = useState<number>(0);

  // Research / Understand Timer
  const researchTimer = useTimer({
    initialSeconds: researchDuration,
    onComplete: () => {
      setResearchSecondsSpent(researchDuration);
      // When research finishes, prompt to remove support
      setStep("remove-support");
    },
  });

  // Explanation Timer
  const explainTimer = useTimer({
    initialSeconds: explainDuration,
    onComplete: () => {
      setExplainSecondsSpent(explainDuration);
      setStep("reflection");
    },
  });

  // Handle initial topic on mount
  useEffect(() => {
    if (initialTopic) {
      setCurrentTopic(initialTopic);
      saveRecentTopic(initialTopic.title);
      researchTimer.reset(researchDuration);
      researchTimer.start();
      setStep("research");
    }
  }, [initialTopic]);

  // Handle initial collection on mount
  useEffect(() => {
    if (initialCollection) {
      setActiveCustomCollection(initialCollection);
      setStep("custom-spin");
    }
  }, [initialCollection]);

  // Category select
  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep("subcategory");
  };

  // Subcategory select
  const handleSelectSubcategory = (subcat: string) => {
    setSelectedSubcategory(subcat);
    if (!selectedCategory) return;

    let pool: Topic[] = [];
    if (subcat === "All") {
      pool = getTopicsByCategory(selectedCategory.name);
      if (pool.length === 0) {
        pool = allTopics.filter(
          (t) => t.category.toLowerCase() === selectedCategory.name.toLowerCase()
        );
      }
    } else {
      pool = getTopicsBySubcategory(selectedCategory.name, subcat);
    }

    if (pool.length === 0) {
      pool = allTopics;
    }

    setTopicPool(pool);
    setCurrentTopic(null);
    setStep("spin");
  };

  // Custom collection select from CategorySelector
  const handleSelectCustomCollection = (col: CustomCollection) => {
    setActiveCustomCollection(col);
    setStep("custom-spin");
  };

  // Custom spin continue
  const handleCustomSpinContinue = (topic: Topic) => {
    setCurrentTopic(topic);
    saveRecentTopic(topic.title);
    researchTimer.reset(researchDuration);
    researchTimer.start();
    setStep("research");
  };

  // Curated Spin -> Start Understanding
  const handleStartUnderstanding = () => {
    if (!currentTopic) return;
    saveRecentTopic(currentTopic.title);
    researchTimer.reset(researchDuration);
    researchTimer.start();
    setStep("research");
  };

  // Research -> Remove Support
  const handleReadyToExplain = () => {
    setResearchSecondsSpent(researchDuration - researchTimer.secondsLeft);
    researchTimer.pause();
    setStep("remove-support");
  };

  // Remove Support -> Start Speaking
  const handleConfirmSupportRemoved = () => {
    explainTimer.reset(explainDuration);
    explainTimer.start();
    setStep("explain");
  };

  // End Speaking -> Reflection
  const handleEndExplanation = () => {
    setExplainSecondsSpent(explainDuration - explainTimer.secondsLeft);
    explainTimer.pause();
    setStep("reflection");
  };

  // Save session
  const handleSaveReflection = (data: {
    confidence: number;
    knowledgeGaps: string[];
    blindSpotNotes: string;
  }) => {
    if (!currentTopic) return;

    savePracticeSession({
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      mode: "understand-explain",
      category: currentTopic.category,
      subcategory: currentTopic.subcategory,
      topic: currentTopic.title,
      difficulty: currentTopic.difficulty,
      researchTime: researchSecondsSpent,
      explanationTime: explainSecondsSpent || (explainDuration - explainTimer.secondsLeft),
      confidence: data.confidence,
      knowledgeGaps: data.knowledgeGaps,
      blindSpotNotes: data.blindSpotNotes,
    });

    onFinish();
  };

  return (
    <div>
      {step === "category" && (
        <CategorySelector
          title="Understand &amp; Explain"
          subtitle="Explore something unfamiliar. Research it deeply, then explain it without support."
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onBack={onExit}
          onSelectMyTopics={() => setStep("custom-collections")}
        />
      )}

      {step === "custom-collections" && (
        <CustomCollectionSelector
          onSelectCollection={handleSelectCustomCollection}
          onBack={() => setStep("category")}
          modeLabel="Understand &amp; Explain"
        />
      )}

      {step === "custom-spin" && activeCustomCollection && (
        <CustomTopicSpin
          collection={activeCustomCollection}
          onContinue={handleCustomSpinContinue}
          onBack={() => setStep("custom-collections")}
          modeLabel="Understand &amp; Explain"
        />
      )}

      {step === "subcategory" && selectedCategory && (
        <SubcategorySelector
          category={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={handleSelectSubcategory}
          onBack={() => setStep("category")}
        />
      )}

      {step === "spin" && selectedCategory && (
        <TopicSpinner
          categoryName={selectedCategory.name}
          subcategoryName={selectedSubcategory}
          topicPool={topicPool}
          currentTopic={currentTopic}
          onSelectTopic={(t) => setCurrentTopic(t)}
          onContinue={handleStartUnderstanding}
          onBack={() => setStep("subcategory")}
          continueButtonText="Start Understanding &rarr;"
          modeLabel="Understand &amp; Explain"
        />
      )}

      {step === "research" && currentTopic && (
        <div>
          <TimerDisplay
            timer={researchTimer}
            presetDurations={[
              { label: "5 min", seconds: 300 },
              { label: "10 min", seconds: 600 },
              { label: "20 min", seconds: 1200 },
              { label: "30 min", seconds: 1800 },
              { label: "45 min", seconds: 2700 },
              { label: "60 min", seconds: 3600 },
            ]}
            currentDurationSeconds={researchDuration}
            onSelectDuration={(secs) => {
              setResearchDuration(secs);
              researchTimer.reset(secs);
            }}
            title="Step 03 &bull; Independent Research"
            subtitle="Research and understand this concept using any documentation, papers, or articles you want."
            topicTitle={currentTopic.title}
            categoryLabel={`Understand &bull; ${currentTopic.subcategory}`}
            primaryActionLabel="I'm Ready to Remove Support &rarr;"
            onPrimaryAction={handleReadyToExplain}
            secondaryActionLabel="Change Duration"
            onSecondaryAction={() => researchTimer.reset()}
          />
          <div className="max-w-2xl mx-auto mt-6 text-left p-4 bg-[#FAF9F5] dark:bg-[#181816] border border-neutral-300 dark:border-neutral-800 rounded-sm text-xs font-mono text-neutral-500 leading-relaxed">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Guideline:
            </span>{" "}
            The timer continues accurately even if you switch browser tabs to consult external documentation. Do not memorize sentences; build a mental model of how the parts connect.
          </div>
        </div>
      )}

      {step === "remove-support" && currentTopic && (
        <RemoveSupportScreen
          topicTitle={currentTopic.title}
          onReady={handleConfirmSupportRemoved}
        />
      )}

      {step === "explain" && currentTopic && (
        <div>
          <TimerDisplay
            timer={explainTimer}
            presetDurations={[
              { label: "2 min", seconds: 120 },
              { label: "3 min", seconds: 180 },
              { label: "5 min", seconds: 300 },
              { label: "10 min", seconds: 600 },
            ]}
            currentDurationSeconds={explainDuration}
            onSelectDuration={(secs) => {
              setExplainDuration(secs);
              explainTimer.reset(secs);
            }}
            title="Step 04 &bull; Explain Aloud"
            subtitle="Speak aloud without looking at any notes. Articulate the mechanism from first principles."
            topicTitle={currentTopic.title}
            categoryLabel={`Explain &bull; ${currentTopic.subcategory}`}
            primaryActionLabel="Finish &amp; Find Gaps &rarr;"
            onPrimaryAction={handleEndExplanation}
            secondaryActionLabel="End Session Early"
            onSecondaryAction={handleEndExplanation}
            isExplanationMode={true}
          />
          <PracticeFramework type="general" />
        </div>
      )}

      {step === "reflection" && currentTopic && (
        <ReflectionForm
          topicTitle={currentTopic.title}
          categoryName={currentTopic.category}
          onFinish={handleSaveReflection}
          title="Find the gaps."
          subtitle="Where did your understanding break down while speaking aloud?"
        />
      )}
    </div>
  );
};
