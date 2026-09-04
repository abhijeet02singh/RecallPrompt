import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteCollectionDialogProps {
  isOpen: boolean;
  collectionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCollectionDialog: React.FC<DeleteCollectionDialogProps> = ({
  isOpen,
  collectionName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] w-full max-w-md border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg p-4 sm:p-8 text-left relative paperclip">
        <button
          onClick={onCancel}
          id="btn-close-delete-dialog"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 btn-retro p-2 min-h-[40px] min-w-[40px] flex items-center justify-center bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
            CONFIRM ACTION
          </span>
          <span className="font-script text-sm sm:text-base text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
            Irreversible
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-9 h-9 border-2 border-[#1C1917] bg-[#B91C4A] text-white flex items-center justify-center shadow-retro-sm flex-shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide break-words">
            Delete &ldquo;{collectionName}&rdquo;?
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-body text-[#78716C] dark:text-[#A8A29E] mb-6">
          This operation cannot be undone. All topic cards inside this collection will be permanently expunged from your local storage.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            id="btn-cancel-delete-collection"
            className="btn-retro px-4 py-2.5 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            id="btn-confirm-delete-collection"
            className="btn-retro px-5 py-2.5 min-h-[44px] bg-[#B91C4A] text-white font-display text-base uppercase tracking-wider cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
