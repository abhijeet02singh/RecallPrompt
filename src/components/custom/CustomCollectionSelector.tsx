import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { CustomCollection } from "../../types";
import { getCustomCollections, saveCustomCollection, updateCustomCollection } from "../../lib/storage";
import { CreateEditCollectionModal } from "./CreateEditCollectionModal";

interface CustomCollectionSelectorProps {
  onSelectCollection: (collection: CustomCollection) => void;
  onBack: () => void;
  modeLabel: string;
}

export const CustomCollectionSelector: React.FC<CustomCollectionSelectorProps> = ({
  onSelectCollection,
  onBack,
  modeLabel,
}) => {
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const refresh = () => {
    setCollections(getCustomCollections());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSaveCollection = (newCol: CustomCollection) => {
    saveCustomCollection(newCol);
    setIsCreateModalOpen(false);
    refresh();
    // Auto-select the newly created collection
    onSelectCollection(newCol);
  };

  return (
    <div className="w-full text-left py-2 sm:py-6">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-to-categories"
        className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Categories</span>
      </button>

      {/* Screen Title Card */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
                COLLECTION SELECTOR &bull; {modeLabel.toUpperCase()}
              </span>
              <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
                Local rotation
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
              Choose A Deck.
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2">
              Select one of your custom curated topic decks to begin randomized practice.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            id="btn-create-collection-in-selector"
            className="btn-retro w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-[#B91C4A] text-white font-display text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Deck</span>
          </button>
        </div>
      </div>

      {/* Collections List or Empty */}
      {collections.length === 0 ? (
        <div className="p-6 sm:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro text-center my-6">
          <h2 className="font-display text-2xl sm:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-2">
            No collections yet.
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-sm mx-auto mb-6 font-body">
            Curate custom topics for university exams, technical interviews, or personal study syllabi.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            id="btn-create-collection-first-selector"
            className="btn-retro w-full sm:w-auto px-6 py-3 min-h-[44px] bg-[#B91C4A] text-white font-display text-lg sm:text-xl uppercase tracking-wider cursor-pointer"
          >
            + Create your first deck &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {collections.map((col, index) => (
            <button
              key={col.id}
              id={`select-custom-collection-${col.id}`}
              onClick={() => onSelectCollection(col)}
              className="group p-4 sm:p-5 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm hover:shadow-retro hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
                    DECK {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] font-bold">
                    {col.topics.length} TOPICS
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-tight mb-2 break-words">
                  {col.name}
                </h3>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-mono line-clamp-2">
                  {col.topics.map((t) => t.title).join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-4 text-xs font-display uppercase tracking-wider text-[#1E5F64] dark:text-[#5EEAD4] font-bold">
                <span>Select Deck</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}

      <CreateEditCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCollection}
      />
    </div>
  );
};
