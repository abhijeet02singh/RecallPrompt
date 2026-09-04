import React, { useState, useEffect } from "react";
import { siteConfig } from "../../config/site";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  BookOpen,
  Layers,
  History as HistoryIcon,
  HelpCircle,
  Command,
} from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAbout: () => void;
  onOpenShortcuts: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAbout,
  onOpenShortcuts,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-[#FAF6ED] dark:bg-[#22201D] border-b-[2.5px] border-[#1C1917] dark:border-[#FAF6ED]/80 shadow-retro transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Traffic light dots & Brand */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          <div className="hidden sm:flex items-center gap-1.5" title="Retro Deck Status">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B91C4A] border border-[#1C1917]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EBB140] border border-[#1C1917]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E5F64] border border-[#1C1917]" />
          </div>

          <button
            onClick={() => handleNavClick("home")}
            id="btn-nav-home"
            className="group text-left cursor-pointer focus:outline-none flex items-baseline gap-1.5 sm:gap-2 min-h-[44px] items-center"
            title="Return to Cover Slide"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-wider text-[#1C1917] dark:text-[#FAF6ED] uppercase">
              RecallPrompt
            </span>
            <span className="font-script text-xs sm:text-sm text-[#B91C4A] dark:text-[#E11D48] -rotate-3 select-none font-bold">
              Abhi
            </span>
          </button>
        </div>

        {/* Right Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2 sm:space-x-3 text-xs">
          <button
            onClick={() => handleNavClick("home")}
            id="btn-nav-deck"
            className={`px-2.5 sm:px-3 py-1.5 min-h-[44px] flex items-center font-display text-sm tracking-wider uppercase border-2 transition-all cursor-pointer ${
              currentView === "home"
                ? "bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm font-bold"
                : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-transparent hover:border-[#1C1917] dark:hover:border-[#FAF6ED]"
            }`}
          >
            Deck
          </button>

          <button
            onClick={() => handleNavClick("my-topics")}
            id="btn-nav-my-topics"
            className={`px-2.5 sm:px-3 py-1.5 min-h-[44px] flex items-center font-display text-sm tracking-wider uppercase border-2 transition-all cursor-pointer ${
              currentView === "my-topics"
                ? "bg-[#EBB140] text-[#1C1917] border-[#1C1917] shadow-retro-sm font-bold"
                : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-transparent hover:border-[#1C1917] dark:hover:border-[#FAF6ED]"
            }`}
          >
            My Topics
          </button>

          <button
            onClick={() => handleNavClick("history")}
            id="btn-nav-history"
            className={`px-2.5 sm:px-3 py-1.5 min-h-[44px] flex items-center font-display text-sm tracking-wider uppercase border-2 transition-all cursor-pointer ${
              currentView === "history"
                ? "bg-[#1E5F64] text-white border-[#1C1917] shadow-retro-sm font-bold"
                : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-transparent hover:border-[#1C1917] dark:hover:border-[#FAF6ED]"
            }`}
          >
            History
          </button>

          <button
            onClick={onOpenAbout}
            id="btn-nav-about"
            className="px-2.5 sm:px-3 py-1.5 min-h-[44px] flex items-center font-display text-sm tracking-wider uppercase border-2 border-transparent hover:border-[#1C1917] dark:hover:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] transition-all cursor-pointer"
          >
            About
          </button>

          {/* Quick utility controls with hard borders */}
          <div className="flex items-center space-x-1.5 pl-2 border-l-2 border-[#1C1917]/20 dark:border-[#FAF6ED]/20">
            <button
              onClick={onToggleSound}
              id="btn-toggle-sound"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
              title={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#78716C]" />
              )}
            </button>

            <button
              onClick={onToggleTheme}
              id="btn-toggle-theme"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#EBB140]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onOpenShortcuts}
              id="btn-toggle-shortcuts"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer font-mono text-xs font-bold"
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
            >
              ?
            </button>
          </div>
        </nav>

        {/* Mobile Header Controls: Compact sound, theme, and hamburger button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={onToggleSound}
            id="btn-mobile-toggle-sound"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5"
            aria-label={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#78716C]" />
            )}
          </button>

          <button
            onClick={onToggleTheme}
            id="btn-mobile-toggle-theme"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5"
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#EBB140]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="btn-mobile-hamburger"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down / Overlay Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 top-16 z-50 md:hidden bg-[#1C1917]/70 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-[#FAF6ED] dark:bg-[#22201D] border-b-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg p-5 max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info badge inside mobile menu */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 font-mono text-xs">
              <span className="px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white font-bold tracking-widest uppercase">
                SYSTEM MENU
              </span>
            </div>

            {/* Navigation links with min 48px height */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick("home")}
                id="btn-mobile-nav-deck"
                className={`w-full min-h-[48px] px-4 py-3 flex items-center justify-between border-2 font-display text-lg tracking-wider uppercase transition-all cursor-pointer ${
                  currentView === "home"
                    ? "bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm font-bold"
                    : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917]/30 dark:border-[#FAF6ED]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-[#B91C4A]" />
                  <span>Practice Deck</span>
                </div>
                {currentView === "home" && (
                  <span className="font-mono text-xs px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] font-bold">
                    ACTIVE
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick("my-topics")}
                id="btn-mobile-nav-my-topics"
                className={`w-full min-h-[48px] px-4 py-3 flex items-center justify-between border-2 font-display text-lg tracking-wider uppercase transition-all cursor-pointer ${
                  currentView === "my-topics"
                    ? "bg-[#EBB140] text-[#1C1917] border-[#1C1917] shadow-retro-sm font-bold"
                    : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917]/30 dark:border-[#FAF6ED]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#1E5F64] dark:text-[#5EEAD4]" />
                  <span>My Topics &amp; Custom Decks</span>
                </div>
                {currentView === "my-topics" && (
                  <span className="font-mono text-xs px-2 py-0.5 border border-[#1C1917] bg-white text-[#1C1917] font-bold">
                    ACTIVE
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick("history")}
                id="btn-mobile-nav-history"
                className={`w-full min-h-[48px] px-4 py-3 flex items-center justify-between border-2 font-display text-lg tracking-wider uppercase transition-all cursor-pointer ${
                  currentView === "history"
                    ? "bg-[#1E5F64] text-white border-[#1C1917] shadow-retro-sm font-bold"
                    : "bg-transparent text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917]/30 dark:border-[#FAF6ED]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HistoryIcon className="w-5 h-5 text-[#EBB140]" />
                  <span>History &amp; Blindspots</span>
                </div>
                {currentView === "history" && (
                  <span className="font-mono text-xs px-2 py-0.5 border border-[#1C1917] bg-[#FAF6ED] text-[#1C1917] font-bold">
                    ACTIVE
                  </span>
                )}
              </button>

              <div className="pt-2 border-t border-[#1C1917]/20 dark:border-[#FAF6ED]/20 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAbout();
                  }}
                  id="btn-mobile-nav-about"
                  className="min-h-[44px] px-3 py-2 border-2 border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-retro-sm cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Manifesto</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShortcuts();
                  }}
                  id="btn-mobile-nav-shortcuts"
                  className="min-h-[44px] px-3 py-2 border-2 border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-retro-sm cursor-pointer"
                >
                  <Command className="w-4 h-4" />
                  <span>Shortcuts</span>
                </button>
              </div>
            </div>

            {/* Bottom attribution in menu */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 text-center font-mono text-[11px] text-[#78716C] dark:text-[#A8A29E]">
              Recall Prompt Protocol &bull; Handcrafted for verbal mastery
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


