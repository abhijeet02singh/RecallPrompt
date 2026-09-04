import React, { useEffect } from "react";
import { ArrowRight, RotateCcw, Plus } from "lucide-react";
import { TimerState } from "../../hooks/useTimer";

interface TimerDisplayProps {
  timer: TimerState;
  presetDurations: { label: string; seconds: number }[];
  currentDurationSeconds: number;
  onSelectDuration: (seconds: number) => void;
  title: string;
  subtitle?: string;
  topicTitle: string;
  categoryLabel?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isExplanationMode?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  presetDurations,
  currentDurationSeconds,
  onSelectDuration,
  title,
  subtitle,
  topicTitle,
  categoryLabel,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  isExplanationMode = false,
}) => {
  // Spacebar to pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        timer.toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timer]);

  return (
    <div className="w-full text-left">
      {/* Category / Mode Label Card */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs uppercase font-black px-2 py-0.5 border border-[#1C1917] bg-[#1E5F64] text-white">
              {title}
            </span>
            {categoryLabel && (
              <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] font-bold">
                &bull; {categoryLabel}
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-[#78716C] dark:text-[#A8A29E]">
            Shortcut: <kbd className="px-1.5 py-0.5 border border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] font-bold">Space</kbd> to {timer.isRunning ? "pause" : "resume"}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.98] my-2 break-words">
          {topicTitle}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timer Options: Retro Segmented Duration Buttons */}
      {!timer.isRunning && (
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[#78716C] dark:text-[#A8A29E] uppercase font-bold mr-1 sm:mr-2">Duration:</span>
          {presetDurations.map((p) => {
            const isActive = currentDurationSeconds === p.seconds;
            return (
              <button
                key={p.seconds}
                onClick={() => {
                  onSelectDuration(p.seconds);
                  timer.reset(p.seconds);
                }}
                className={`cursor-pointer px-3 py-1.5 min-h-[36px] font-bold uppercase tracking-wider border-[2px] transition-all ${
                  isActive
                    ? "bg-[#EBB140] text-[#1C1917] border-[#1C1917] shadow-retro-sm"
                    : "bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] border-[#1C1917] dark:border-[#FAF6ED]/60 hover:bg-[#F8F4EA]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Large Tabular Digit Timer Card */}
      <div className="p-5 sm:p-8 md:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg text-center select-none mb-6 sm:mb-8 relative">
        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1C1917] dark:text-[#FAF6ED] shadow-retro-sm mb-3 sm:mb-4">
          <span
            className={`w-2 h-2 rounded-full ${
              timer.isRunning
                ? "bg-[#B91C4A] animate-pulse"
                : timer.isPaused
                ? "bg-[#EBB140]"
                : "bg-[#1E5F64]"
            }`}
          />
          <span>
            {timer.isCompleted
              ? "Time Completed"
              : timer.isRunning
              ? isExplanationMode
                ? "Speaking in progress"
                : "Focus session active"
              : timer.isPaused
              ? "Session paused"
              : "Ready"}
          </span>
        </div>

        {/* The Digits */}
        <div
          className={`font-mono font-tabular text-6xl sm:text-8xl md:text-[104px] font-black tracking-tight leading-none my-4 sm:my-6 transition-colors ${
            timer.isCompleted
              ? "text-[#78716C]"
              : timer.secondsLeft <= 30 && timer.isRunning
              ? "text-[#B91C4A] animate-pulse"
              : "text-[#1C1917] dark:text-[#FAF6ED]"
          }`}
        >
          {timer.formattedTime}
        </div>

        {/* Retro Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={timer.toggle}
            id="btn-timer-toggle"
            className={`btn-retro w-full sm:w-auto px-6 py-3 min-h-[48px] font-display text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer ${
              timer.isRunning
                ? "bg-[#EBB140] text-[#1C1917]"
                : timer.isPaused
                ? "bg-[#1E5F64] text-white"
                : "bg-[#B91C4A] text-white"
            }`}
          >
            <span>
              {timer.isRunning
                ? "PAUSE SESSION"
                : timer.isPaused
                ? "RESUME SESSION"
                : "START TIMER"}
            </span>
          </button>

          {(timer.isRunning || timer.isPaused) && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button
                onClick={() => timer.addTime(60)}
                id="btn-timer-add-min"
                className="btn-retro flex-1 sm:flex-initial px-3.5 py-3 min-h-[44px] justify-center bg-[#FAF6ED] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#F8F4EA]"
                title="Add 1 minute"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 MIN</span>
              </button>

              <button
                onClick={() => timer.reset()}
                id="btn-timer-reset"
                className="btn-retro flex-1 sm:flex-initial px-3.5 py-3 min-h-[44px] justify-center bg-[#FAF6ED] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#F8F4EA]"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Completion Notice */}
      {timer.isCompleted && (
        <div className="p-4 bg-[#EBB140] text-[#1C1917] border-[2px] border-[#1C1917] shadow-retro-sm text-center font-display text-lg sm:text-xl tracking-wider uppercase mb-6 sm:mb-8">
          Time completed! Conclude your explanation and proceed to reflection.
        </div>
      )}

      {/* Bottom Step Actions */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t-2 border-dashed border-[#1C1917]/30 dark:border-[#FAF6ED]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            id="btn-timer-secondary-action"
            className="btn-retro w-full sm:w-auto px-4 py-2.5 min-h-[44px] justify-center bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-display text-sm tracking-wider uppercase cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        )}

        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            id="btn-timer-primary-action"
            className="btn-retro w-full sm:w-auto px-6 sm:px-8 py-3.5 min-h-[48px] bg-[#1E5F64] text-white font-display text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-3 sm:ml-auto cursor-pointer hover:bg-[#184F53]"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

