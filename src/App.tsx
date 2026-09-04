import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { AboutModal } from "./components/layout/AboutModal";
import { ShortcutsModal } from "./components/layout/ShortcutsModal";
import { ModeSelector } from "./components/practice/ModeSelector";
import { QuickThinkFlow } from "./components/practice/QuickThinkFlow";
import { UnderstandExplainFlow } from "./components/practice/UnderstandExplainFlow";
import { InterviewFlow } from "./components/practice/InterviewFlow";
import { HistoryView } from "./components/history/HistoryView";
import { MyTopicsView } from "./components/custom/MyTopicsView";
import { CustomCollection, PracticeMode, Topic } from "./types";
import { getUserSettings, saveUserSettings, generateLocalId } from "./lib/storage";

type AppView =
  | "home"
  | "quick-think"
  | "understand-explain"
  | "interview"
  | "history"
  | "my-topics";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Custom collection or quick topic passed directly to practice flow
  const [selectedCustomCollection, setSelectedCustomCollection] = useState<CustomCollection | null>(null);
  const [quickTopicToPractice, setQuickTopicToPractice] = useState<Topic | null>(null);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return getUserSettings().soundEnabled ?? true;
  });

  // Dark/Light Theme management
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = getUserSettings().theme;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  // Apply theme to html document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    saveUserSettings({ theme });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveUserSettings({ soundEnabled: next });
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        if (isAboutOpen) setIsAboutOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAboutOpen, isShortcutsOpen]);

  const handleSelectMode = (mode: PracticeMode) => {
    setSelectedCustomCollection(null);
    setQuickTopicToPractice(null);
    setCurrentView(mode);
  };

  const handleFlowComplete = () => {
    setSelectedCustomCollection(null);
    setQuickTopicToPractice(null);
    setCurrentView("history");
  };

  const handleExitFlow = () => {
    setSelectedCustomCollection(null);
    setQuickTopicToPractice(null);
    setCurrentView("home");
  };

  // Start practice directly from a custom collection in My Topics
  const handleStartCustomCollectionPractice = (collection: CustomCollection) => {
    setSelectedCustomCollection(collection);
    setQuickTopicToPractice(null);
    setCurrentView("understand-explain");
  };

  // Start Quick Topic immediately without creating a collection
  const handleStartQuickTopicPractice = (topicTitle: string) => {
    const topic: Topic = {
      id: generateLocalId("quick-topic"),
      title: topicTitle,
      category: "Custom",
      subcategory: "Quick Topic",
      difficulty: "Intermediate",
    };
    setSelectedCustomCollection(null);
    setQuickTopicToPractice(topic);
    setCurrentView("understand-explain");
  };

  return (
    <div className="min-h-screen w-full flex flex-col paper-texture bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] transition-colors duration-200 overflow-x-hidden">
      {/* Top Navigation Dock */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedCustomCollection(null);
          setQuickTopicToPractice(null);
          setCurrentView(view as AppView);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Arena - Vintage Slide-Deck max-w-4xl */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 md:py-12">
        {currentView === "home" && (
          <ModeSelector onSelectMode={handleSelectMode} />
        )}

        {currentView === "my-topics" && (
          <MyTopicsView
            onStartCollection={handleStartCustomCollectionPractice}
            onStartQuickTopic={handleStartQuickTopicPractice}
            onBack={() => setCurrentView("home")}
          />
        )}

        {currentView === "quick-think" && (
          <QuickThinkFlow
            onFinish={handleFlowComplete}
            onExit={handleExitFlow}
            initialTopic={quickTopicToPractice}
            initialCollection={selectedCustomCollection}
          />
        )}

        {currentView === "understand-explain" && (
          <UnderstandExplainFlow
            onFinish={handleFlowComplete}
            onExit={handleExitFlow}
            initialTopic={quickTopicToPractice}
            initialCollection={selectedCustomCollection}
          />
        )}

        {currentView === "interview" && (
          <InterviewFlow
            onFinish={handleFlowComplete}
            onExit={handleExitFlow}
          />
        )}

        {currentView === "history" && (
          <HistoryView
            onBack={() => setCurrentView("home")}
            onStartPractice={() => setCurrentView("understand-explain")}
          />
        )}
      </main>

      {/* Scrapbook Section Footer with Signature & Traffic Light Bullets */}
      <footer className="w-full border-t-2 border-[#1C1917] dark:border-[#FAF6ED]/30 bg-[#FAF6ED] dark:bg-[#22201D] py-6 text-xs text-[#78716C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Corner: Cursive Signature */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-script text-xl sm:text-2xl text-[#B91C4A] dark:text-[#E11D48] -rotate-3 select-none font-bold">
              Abhijeet Singh
            </span>
            <span className="font-mono text-[11px] text-[#78716C] border-l border-[#78716C]/40 pl-2 sm:pl-3">
              Edition 2026 &bull; RecallPrompt Deck
            </span>
          </div>

          <div className="text-center sm:text-right flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <span className="font-display tracking-wider text-xs sm:text-sm uppercase text-[#1C1917] dark:text-[#FAF6ED]">
              Understand &bull; Remove Support &bull; Explain
            </span>

            {/* Right Corner: Three Vintage Traffic-Light Bullet Dots */}
            <div className="flex items-center gap-1.5" title="Retro Traffic Lights">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#B91C4A] border border-[#1C1917] inline-block" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EBB140] border border-[#1C1917] inline-block" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1E5F64] border border-[#1C1917] inline-block" />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
