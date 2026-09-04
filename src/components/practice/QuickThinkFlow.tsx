import React, { useState, useEffect } from "react";
import { Category, CustomCollection, Topic } from "../../types";
import { CATEGORIES } from "../../data/categories";
import { getTopicsByCategory, getTopicsBySubcategory, allTopics } from "../../data/topics";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { TopicSpinner } from "./TopicSpinner";
import { TimerDisplay } from "./TimerDisplay";
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
  | "prepare"
  | "explain"
  | "reflection";

interface QuickThinkFlowProps {
  onFinish: () => void;
  onExit: () => void;
  initialTopic?: Topic | null;
  initialCollection?: CustomCollection | null;
}

export const QuickThinkFlow: React.FC<QuickThinkFlowProps> = ({
  onFinish,
  onExit,
  initialTopic,
  initialCollection,
}) => {
  const [step, setStep] = useState<Step>(() => {
    if (initialTopic) return "prepare";
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

  // Timers configuration
  const [prepDuration, setPrepDuration] = useState<number>(60); // 1 min default
  const [explainDuration, setExplainDuration] = useState<number>(180); // 3 min default
  const [prepSecondsSpent, setPrepSecondsSpent] = useState<number>(0);
  const [explainSecondsSpent, setExplainSecondsSpent] = useState<number>(0);

  // Preparation Timer
  const prepTimer = useTimer({
    initialSeconds: prepDuration,
    onComplete: () => {
      // Auto move to explain when prep ends
      setPrepSecondsSpent(prepDuration);
      setStep("explain");
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
      prepTimer.reset(prepDuration);
      setStep("prepare");
    }
  }, [initialTopic]);

  // Handle initial collection on mount
  useEffect(() => {
    if (initialCollection) {
      setActiveCustomCollection(initialCollection);
      setStep("custom-spin");
    }
  }, [initialCollection]);

  // Step 1 -> Step 2
  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep("subcategory");
  };

  // Step 2 -> Step 3
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

    // Fallback if pool is empty
    if (pool.length === 0) {
      pool = allTopics;
    }

    setTopicPool(pool);
    setCurrentTopic(null);
    setStep("spin");
  };

  // Custom collection selection
  const handleSelectCustomCollection = (col: CustomCollection) => {
    setActiveCustomCollection(col);
    setStep("custom-spin");
  };

  // Custom spin continue
  const handleCustomSpinContinue = (topic: Topic) => {
    setCurrentTopic(topic);
    saveRecentTopic(topic.title);
    prepTimer.reset(prepDuration);
    setStep("prepare");
  };

  // Step 3 -> Step 4
  const handleContinueToPrepare = () => {
    if (!currentTopic) return;
    saveRecentTopic(currentTopic.title);
    prepTimer.reset(prepDuration);
    setStep("prepare");
  };

  // Step 4 -> Step 5
  const handleStartExplaining = () => {
    setPrepSecondsSpent(prepDuration - prepTimer.secondsLeft);
    prepTimer.pause();
    explainTimer.reset(explainDuration);
    explainTimer.start();
    setStep("explain");
  };

  // Skip Preparation
  const handleSkipPreparation = () => {
    setPrepSecondsSpent(0);
    prepTimer.pause();
    explainTimer.reset(explainDuration);
    explainTimer.start();
    setStep("explain");
  };

  // End explanation early
  const handleEndExplanation = () => {
    setExplainSecondsSpent(explainDuration - explainTimer.secondsLeft);
    explainTimer.pause();
    setStep("reflection");
  };

  // Save reflection
  const handleSaveReflection = (data: {
    confidence: number;
    knowledgeGaps: string[];
    blindSpotNotes: string;
  }) => {
    if (!currentTopic) return;

    savePracticeSession({
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      mode: "quick-think",
      category: currentTopic.category,
      subcategory: currentTopic.subcategory,
      topic: currentTopic.title,
      difficulty: currentTopic.difficulty,
      preparationTime: prepSecondsSpent,
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
          title="Quick Think"
          subtitle="Explain what you already know without prior research."
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
          modeLabel="Quick Think"
        />
      )}

      {step === "custom-spin" && activeCustomCollection && (
        <CustomTopicSpin
          collection={activeCustomCollection}
          onContinue={handleCustomSpinContinue}
          onBack={() => setStep("custom-collections")}
          modeLabel="Quick Think"
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
          onContinue={handleContinueToPrepare}
          onBack={() => setStep("subcategory")}
          continueButtonText="Prepare &amp; Explain &rarr;"
          modeLabel="Quick Think"
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
              { label: "5 min", seconds: 300 },
            ]}
            currentDurationSeconds={prepDuration}
            onSelectDuration={(secs) => {
              setPrepDuration(secs);
              prepTimer.reset(secs);
            }}
            title="Step 03 &bull; Mental Preparation"
            subtitle="Take a moment to structure your core points before speaking aloud."
            topicTitle={currentTopic.title}
            categoryLabel={`Quick Think &bull; ${currentTopic.subcategory}`}
            primaryActionLabel="Start Explaining Now &rarr;"
            onPrimaryAction={handleStartExplaining}
            secondaryActionLabel="Skip Preparation"
            onSecondaryAction={handleSkipPreparation}
          />
          <PracticeFramework type="general" />
        </div>
      )}

      {step === "explain" && currentTopic && (
        <div>
          <TimerDisplay
            timer={explainTimer}
            presetDurations={[
              { label: "1 min", seconds: 60 },
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
            subtitle="Speak clearly out loud as if teaching someone who has never heard of this."
            topicTitle={currentTopic.title}
            categoryLabel={`Quick Think &bull; ${currentTopic.subcategory}`}
            primaryActionLabel="Finish &amp; Reflect &rarr;"
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
          title="Reflect."
          subtitle="How well did you explain this concept from spontaneous memory?"
        />
      )}
    </div>
  );
};
