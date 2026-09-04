import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Trash2, Edit3, Plus, Play } from "lucide-react";
import { CustomCollection } from "../../types";
import {
  getCustomCollections,
  saveCustomCollection,
  updateCustomCollection,
  deleteCustomCollection,
} from "../../lib/storage";
import { CreateEditCollectionModal } from "./CreateEditCollectionModal";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";

interface MyTopicsViewProps {
  onStartCollection: (collection: CustomCollection) => void;
  onStartQuickTopic: (topicTitle: string) => void;
  onBack: () => void;
}

export const MyTopicsView: React.FC<MyTopicsViewProps> = ({
  onStartCollection,
  onStartQuickTopic,
  onBack,
}) => {
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CustomCollection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<CustomCollection | null>(null);

  // Quick topic input state
  const [quickTopicText, setQuickTopicText] = useState("");

  const refreshCollections = () => {
    setCollections(getCustomCollections());
  };

  useEffect(() => {
    refreshCollections();
  }, []);

  const handleSaveCollection = (collection: CustomCollection) => {
    if (editingCollection) {
      updateCustomCollection(collection);
    } else {
      saveCustomCollection(collection);
    }
    setIsCreateModalOpen(false);
    setEditingCollection(null);
    refreshCollections();
  };

  const handleConfirmDelete = () => {
    if (!deletingCollection) return;
    deleteCustomCollection(deletingCollection.id);
    setDeletingCollection(null);
    refreshCollections();
  };

  const handleQuickTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTopicText.trim();
    if (!trimmed) return;
    onStartQuickTopic(trimmed);
  };

  return (
    <div className="w-full text-left py-2 sm:py-6">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-from-my-topics"
        className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Deck</span>
      </button>

      {/* Header Slide Card */}
      <div className="p-4 sm:p-6 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro paperclip relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
                LOCAL CUSTOM LIBRARY
              </span>
              <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
                Custom decks
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-[0.95] my-2 break-words">
              My Topics.
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body mt-2">
              Create your own practice collections for university exams, interviews, and deep work syllabi.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCollection(null);
              setIsCreateModalOpen(true);
            }}
            id="btn-create-collection-primary"
            className="btn-retro w-full sm:w-auto px-5 py-2.5 min-h-[44px] justify-center bg-[#B91C4A] text-white font-display text-base sm:text-lg uppercase tracking-wider flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* QUICK TOPIC ENTRY IN VINTAGE INDEX CARD */}
      <div className="p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm mb-6 sm:mb-8 tape-strip relative">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917]">
            AD-HOC DRILL
          </span>
          <span className="font-script text-sm sm:text-base text-[#1E5F64] dark:text-[#5EEAD4] -rotate-1 font-bold">
            Instant spontaneous test
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body mb-3">
          Explain an immediate custom topic without configuring a collection first.
        </p>

        <form onSubmit={handleQuickTopicSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <input
            type="text"
            id="input-quick-topic"
            value={quickTopicText}
            onChange={(e) => setQuickTopicText(e.target.value)}
            placeholder="e.g. Raft Consensus Algorithm, Microservices..."
            className="flex-1 p-2.5 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F64] font-body"
          />
          <button
            type="submit"
            id="btn-start-quick-topic"
            disabled={!quickTopicText.trim()}
            className="btn-retro w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-[#1E5F64] text-white font-display text-base uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Begin Drill</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* COLLECTIONS LIST OR EMPTY STATE */}
      {collections.length === 0 ? (
        <div className="p-8 sm:p-12 bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro text-center my-6">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide mb-2">
            No collections yet.
          </p>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-md mx-auto mb-6 font-body">
            Group your university syllabus, interview questions, or personal reading list into targeted recall decks.
          </p>
          <button
            onClick={() => {
              setEditingCollection(null);
              setIsCreateModalOpen(true);
            }}
            id="btn-create-first-collection"
            className="btn-retro w-full sm:w-auto px-6 py-3 min-h-[44px] justify-center bg-[#B91C4A] text-white font-display text-lg sm:text-xl tracking-wider uppercase cursor-pointer"
          >
            Create your first deck &rarr;
          </button>
        </div>
      ) : (
        <div>
          <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] mb-4 flex flex-wrap items-center justify-between gap-2">
            <span>SAVED RECALL DECKS ({collections.length})</span>
            <span className="font-script text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E] -rotate-1">
              stored locally
            </span>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {collections.map((col, idx) => (
              <div
                key={col.id}
                className="p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all"
              >
                {/* Left: Info */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] font-mono text-xs font-black">
                      DECK {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-mono text-xs text-[#78716C] dark:text-[#A8A29E] font-bold">
                      {col.topics.length} TOPICS
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide leading-tight mt-1 break-words">
                    {col.name}
                  </h3>
                  {col.topics.length > 0 && (
                    <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-mono line-clamp-1 pt-0.5">
                      Preview: {col.topics.slice(0, 4).map((t) => t.title).join(", ")}
                      {col.topics.length > 4 ? "..." : ""}
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingCollection(col);
                      setIsCreateModalOpen(true);
                    }}
                    id={`btn-edit-collection-${col.id}`}
                    className="btn-retro px-3.5 py-2 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
                    title="Edit Collection"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeletingCollection(col)}
                    id={`btn-delete-collection-${col.id}`}
                    className="btn-retro p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#F8F4EA] dark:bg-[#181715] text-[#78716C] hover:text-[#B91C4A] cursor-pointer"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onStartCollection(col)}
                    id={`btn-start-collection-${col.id}`}
                    className="btn-retro px-4 py-2 min-h-[44px] bg-[#1E5F64] text-white font-display text-sm tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <CreateEditCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCollection(null);
        }}
        onSave={handleSaveCollection}
        collectionToEdit={editingCollection}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCollectionDialog
        isOpen={Boolean(deletingCollection)}
        collectionName={deletingCollection?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCollection(null)}
      />
    </div>
  );
};

