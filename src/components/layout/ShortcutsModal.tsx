import React, { useEffect } from "react";
import { X, Command } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Start / Pause active timer" },
    { key: "Enter", desc: "Confirm / Continue to next step" },
    { key: "R", desc: "Spin again for a new topic" },
    { key: "Esc", desc: "Close dialogs / Return to overview" },
    { key: "?", desc: "Toggle this keyboard shortcuts dialog" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/70 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] border-[3px] border-[#1C1917] dark:border-[#FAF6ED] p-4 sm:p-8 shadow-retro-lg tape-strip relative text-left my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          id="btn-close-shortcuts"
          className="btn-retro absolute top-3 right-3 sm:top-4 sm:right-4 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center bg-[#FAF6ED] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer"
          aria-label="Close shortcuts dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 pr-8 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
            TERMINAL SHORTCUTS
          </span>
        </div>

        <h2
          id="shortcuts-title"
          className="text-2xl sm:text-3xl font-display text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-4 break-words"
        >
          Keyboard Controls
        </h2>

        <div className="border-t-[2px] border-b-[2px] border-[#1C1917] dark:border-[#FAF6ED]/60 divide-y divide-[#1C1917]/20 dark:divide-[#FAF6ED]/20">
          {shortcuts.map(({ key, desc }) => (
            <div key={key} className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#1C1917] dark:text-[#FAF6ED]">
                {desc}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold border-2 border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm flex-shrink-0">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-mono text-[#78716C] dark:text-[#A8A29E] mt-4">
          Key listeners are suspended while editing custom notes or blindspots.
        </p>

        <div className="mt-5 sm:mt-6 pt-3 border-t-2 border-dashed border-[#1C1917]/20 dark:border-[#FAF6ED]/20 flex justify-end">
          <button
            onClick={onClose}
            className="btn-retro px-5 py-2.5 min-h-[44px] bg-[#1C1917] text-[#FAF6ED] font-display text-sm tracking-wider uppercase cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
