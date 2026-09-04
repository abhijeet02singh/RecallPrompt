import React, { useState, useEffect } from "react";
import { X, Plus, ChevronDown, ChevronUp, AlertCircle, Trash2, Edit3, Check } from "lucide-react";
import { CustomCollection, CustomTopic } from "../../types";
import { generateLocalId, getCustomCollections } from "../../lib/storage";

interface CreateEditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: CustomCollection) => void;
  collectionToEdit?: CustomCollection | null;
}

export const CreateEditCollectionModal: React.FC<CreateEditCollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collectionToEdit,
}) => {
  const isEditing = Boolean(collectionToEdit);

  const [name, setName] = useState("");
  const [topics, setTopics] = useState<CustomTopic[]>([]);
  const [singleTopicInput, setSingleTopicInput] = useState("");
  
  // Method 2: Paste list
  const [isPasteExpanded, setIsPasteExpanded] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [detectedTopics, setDetectedTopics] = useState<string[]>([]);
  const [showPastePreview, setShowPastePreview] = useState(false);

  // Inline edit state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicText, setEditingTopicText] = useState("");

  // Validation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate data when opening
  useEffect(() => {
    if (collectionToEdit) {
      setName(collectionToEdit.name);
      setTopics([...collectionToEdit.topics]);
    } else {
      setName("");
      setTopics([]);
    }
    setSingleTopicInput("");
    setPasteText("");
    setDetectedTopics([]);
    setShowPastePreview(false);
    setIsPasteExpanded(false);
    setErrorMessage(null);
    setEditingTopicId(null);
  }, [collectionToEdit, isOpen]);

  if (!isOpen) return null;

  // Add single topic
  const handleAddSingleTopic = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = singleTopicInput.trim();
    if (!trimmed) return;

    // Check duplicate
    if (topics.some((t) => t.title.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`"${trimmed}" is already in this collection.`);
      return;
    }

    setErrorMessage(null);
    const newTopic: CustomTopic = {
      id: generateLocalId("topic"),
      title: trimmed,
      createdAt: new Date().toISOString(),
    };
    setTopics((prev) => [...prev, newTopic]);
    setSingleTopicInput("");
  };

  // Remove topic
  const handleRemoveTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (editingTopicId === id) {
      setEditingTopicId(null);
    }
  };

  // Inline topic rename
  const handleStartEditTopic = (topic: CustomTopic) => {
    setEditingTopicId(topic.id);
    setEditingTopicText(topic.title);
  };

  const handleSaveTopicEdit = (id: string) => {
    const trimmed = editingTopicText.trim();
    if (!trimmed) {
      handleRemoveTopic(id);
      return;
    }
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
    setEditingTopicId(null);
  };

  // Method 2: Process paste text into detected topics
  const handleDetectPasteTopics = () => {
    if (!pasteText.trim()) return;

    // Split topics by line, remove empty lines, trim whitespace, remove duplicates
    const rawLines = pasteText.split(/\r?\n/);
    const cleaned = rawLines
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Filter duplicates within the pasted text
    const uniqueInPaste: string[] = [];
    cleaned.forEach((item) => {
      const lower = item.toLowerCase();
      if (!uniqueInPaste.some((p) => p.toLowerCase() === lower)) {
        uniqueInPaste.push(item);
      }
    });

    // Filter out items that are already in the topics list
    const filteredAgainstExisting = uniqueInPaste.filter(
      (item) => !topics.some((t) => t.title.toLowerCase() === item.toLowerCase())
    );

    if (filteredAgainstExisting.length === 0) {
      setErrorMessage("No new topics detected or all pasted topics are already added.");
      return;
    }

    setErrorMessage(null);
    setDetectedTopics(filteredAgainstExisting);
    setShowPastePreview(true);
  };

  // Import detected topics
  const handleConfirmAddAllPasted = () => {
    const newItems: CustomTopic[] = detectedTopics.map((title) => ({
      id: generateLocalId("topic"),
      title,
      createdAt: new Date().toISOString(),
    }));

    setTopics((prev) => [...prev, ...newItems]);
    setPasteText("");
    setDetectedTopics([]);
    setShowPastePreview(false);
    setIsPasteExpanded(false);
  };

  // Final submit
  const handleSubmitCollection = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Please enter a collection name.");
      return;
    }

    // Check duplicate collection name if creating new or renaming
    const existingCollections = getCustomCollections();
    const isDuplicateName = existingCollections.some(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() &&
        c.id !== collectionToEdit?.id
    );
    if (isDuplicateName) {
      setErrorMessage(`A collection named "${trimmedName}" already exists.`);
      return;
    }

    if (topics.length < 2) {
      setErrorMessage("Please add at least 2 topics to your collection.");
      return;
    }

    const now = new Date().toISOString();
    const finalCollection: CustomCollection = {
      id: collectionToEdit ? collectionToEdit.id : generateLocalId("collection"),
      name: trimmedName,
      topics,
      createdAt: collectionToEdit ? collectionToEdit.createdAt : now,
      updatedAt: now,
    };

    onSave(finalCollection);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-[#1C1917]/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-[#FAF6ED] dark:bg-[#22201D] text-[#1C1917] dark:text-[#FAF6ED] w-full max-w-xl border-[3px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-lg p-4 sm:p-8 text-left relative my-auto max-h-[92vh] flex flex-col paperclip">
        {/* Close button */}
        <button
          onClick={onClose}
          id="btn-close-collection-modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 btn-retro p-2 min-h-[40px] min-w-[40px] flex items-center justify-center bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 sm:mb-6 flex-shrink-0 pr-10">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#B91C4A] text-white shadow-retro-sm">
              {isEditing ? "REVISE DECK" : "NEW DECK"}
            </span>
            <span className="font-script text-sm sm:text-base text-[#B91C4A] dark:text-[#E11D48] -rotate-2 font-bold">
              Personal syllabus
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide break-words">
            {isEditing ? "Edit Collection." : "Curate Collection."}
          </h2>
        </div>

        {/* Error notice if any */}
        {errorMessage && (
          <div className="mb-4 sm:mb-5 p-3 text-xs font-mono font-bold text-[#B91C4A] border-2 border-[#B91C4A] bg-[#B91C4A]/10 flex items-center gap-2 shadow-retro-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 sm:space-y-6">
          {/* Step 1: Collection Name */}
          <div className="space-y-2">
            <label
              htmlFor="collection-name-input"
              className="text-xs font-mono uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] block"
            >
              Collection Title
            </label>
            <input
              id="collection-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. Distributed Systems Exam, Senior SWE Interview..."
              maxLength={100}
              className="w-full p-2.5 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F64] font-body"
              autoFocus
            />
          </div>

          {/* Step 2: Add Topics */}
          <div className="space-y-3 pt-1 sm:pt-2">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-mono uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] block">
                Topics ({topics.length} added &bull; min 2 required)
              </label>
            </div>

            {/* Method 1: Add Single Topic */}
            <form
              onSubmit={handleAddSingleTopic}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                id="input-single-topic"
                type="text"
                value={singleTopicInput}
                onChange={(e) => setSingleTopicInput(e.target.value)}
                placeholder="Enter a topic title..."
                maxLength={200}
                className="flex-1 p-2 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F64] font-body"
              />
              <button
                type="submit"
                id="btn-add-single-topic"
                disabled={!singleTopicInput.trim()}
                className="btn-retro px-4 py-2 min-h-[44px] bg-[#1E5F64] text-white font-display text-sm uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </button>
            </form>

            {/* Method 2: Paste Multiple Topics (Expandable) */}
            <div className="border-[2px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#F8F4EA] dark:bg-[#181715] p-3 shadow-retro-sm">
              <button
                type="button"
                id="btn-toggle-paste-topics"
                onClick={() => setIsPasteExpanded(!isPasteExpanded)}
                className="w-full min-h-[36px] flex items-center justify-between text-left text-xs font-mono uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer"
              >
                <span className="pr-2">Or batch paste multiple topics (one per line)</span>
                {isPasteExpanded ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {isPasteExpanded && (
                <div className="mt-3 pt-3 border-t-2 border-[#1C1917] dark:border-[#FAF6ED] space-y-3">
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body">
                    Enter one topic per line. Blank lines and duplicate items are automatically filtered.
                  </p>

                  <textarea
                    id="textarea-paste-topics"
                    rows={4}
                    value={pasteText}
                    onChange={(e) => {
                      setPasteText(e.target.value);
                      setShowPastePreview(false);
                    }}
                    placeholder={`Paxos Consensus\nTwo-Phase Commit\nVector Clocks\nCAP Theorem`}
                    maxLength={10000}
                    className="w-full p-2.5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] text-xs font-mono text-[#1C1917] dark:text-[#FAF6ED] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E5F64] resize-none leading-relaxed"
                  />

                  {!showPastePreview ? (
                    <button
                      type="button"
                      id="btn-import-topics-preview"
                      onClick={handleDetectPasteTopics}
                      disabled={!pasteText.trim()}
                      className="btn-retro px-3.5 py-2 min-h-[40px] bg-[#EBB140] text-[#1C1917] font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                    >
                      Import Topics
                    </button>
                  ) : (
                    <div className="p-3 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] space-y-2 shadow-retro-sm">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1C1917] dark:text-[#FAF6ED]">
                        <span>{detectedTopics.length} topics detected:</span>
                      </div>
                      <ul className="text-xs text-[#78716C] dark:text-[#A8A29E] font-mono space-y-0.5 max-h-28 overflow-y-auto pl-2 list-disc list-inside">
                        {detectedTopics.map((dt, idx) => (
                          <li key={idx} className="truncate">
                            {dt}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          id="btn-confirm-add-all-pasted"
                          onClick={handleConfirmAddAllPasted}
                          className="btn-retro px-3 py-2 min-h-[40px] bg-[#1E5F64] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Add All Topics
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPastePreview(false)}
                          className="btn-retro px-3 py-1.5 bg-[#F8F4EA] dark:bg-[#181715] text-[#78716C] font-mono text-xs uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* List of Added Topics */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] block">
                Topics in collection:
              </span>

              {topics.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono font-bold text-[#78716C] dark:text-[#A8A29E] border-2 border-dashed border-[#1C1917]/30 dark:border-[#FAF6ED]/30">
                  No topics added yet. Add at least 2 topics above.
                </div>
              ) : (
                <div className="border-[2px] border-[#1C1917] dark:border-[#FAF6ED] divide-y-2 divide-[#1C1917] dark:divide-[#FAF6ED] bg-[#F8F4EA] dark:bg-[#181715] max-h-48 overflow-y-auto shadow-retro-sm">
                  {topics.map((t, idx) => {
                    const isEditingThis = editingTopicId === t.id;

                    return (
                      <div
                        key={t.id}
                        className="py-2 px-3 flex items-center justify-between gap-3 text-xs font-mono group"
                      >
                        {isEditingThis ? (
                          <div className="flex-1 flex items-center gap-2 mr-2">
                            <input
                              type="text"
                              value={editingTopicText}
                              onChange={(e) => setEditingTopicText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTopicEdit(t.id);
                                if (e.key === "Escape") setEditingTopicId(null);
                              }}
                              maxLength={200}
                              className="w-full py-0.5 px-1 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED] text-xs text-[#1C1917] dark:text-[#FAF6ED] focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveTopicEdit(t.id)}
                              className="btn-retro p-1 bg-[#1E5F64] text-white cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#EBB140] text-[#1C1917] border border-[#1C1917]">
                              {(idx + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="text-[#1C1917] dark:text-[#FAF6ED] font-semibold truncate">
                              {t.title}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!isEditingThis && (
                            <button
                              type="button"
                              onClick={() => handleStartEditTopic(t)}
                              className="btn-retro p-2 min-h-[36px] min-w-[36px] flex items-center justify-center bg-[#FAF6ED] dark:bg-[#22201D] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                              title="Edit topic name"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(t.id)}
                            className="btn-retro p-2 min-h-[36px] min-w-[36px] flex items-center justify-center bg-[#FAF6ED] dark:bg-[#22201D] text-[#78716C] hover:text-[#B91C4A] cursor-pointer"
                            title="Remove topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-[#1C1917] dark:border-[#FAF6ED] flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            id="btn-cancel-create-collection"
            className="btn-retro px-4 py-2.5 min-h-[44px] bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-submit-collection"
            onClick={handleSubmitCollection}
            disabled={!name.trim() || topics.length < 2}
            className="btn-retro px-5 sm:px-6 py-2.5 min-h-[44px] bg-[#B91C4A] text-white font-display text-base sm:text-lg uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isEditing ? "Save Deck &rarr;" : "Create Deck &rarr;"}
          </button>
        </div>
      </div>
    </div>
  );
};
