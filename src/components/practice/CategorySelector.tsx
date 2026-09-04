import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Category } from "../../types";

interface CategorySelectorProps {
  title: string;
  subtitle: string;
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (cat: Category) => void;
  onBack: () => void;
  onSelectMyTopics?: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  title,
  subtitle,
  categories,
  selectedCategory,
  onSelectCategory,
  onBack,
  onSelectMyTopics,
}) => {
  return (
    <div className="w-full text-left">
      {/* Return button */}
      <button
        onClick={onBack}
        id="btn-back-categories"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] px-3.5 py-2 min-h-[44px] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] mb-6 sm:mb-8 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>&larr; Return to Mode Cover</span>
      </button>

      {/* Screen Title */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
            STAGE 01 &bull; CURATED DOMAINS
          </span>
          <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 select-none">
            Choose your technical domain
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide my-2 break-words">
          Select Subject Domain
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body">
          {subtitle || "Select a field to test your understanding."}
        </p>
      </div>

      {/* Categories Scrapbook Grid / List */}
      <div className="space-y-3 sm:space-y-3.5">
        {categories.map((cat, index) => {
          const numberStr = (index + 1).toString().padStart(2, "0");

          return (
            <button
              key={cat.id}
              id={`cat-select-${cat.id}`}
              onClick={() => onSelectCategory(cat)}
              className="group w-full py-3.5 sm:py-4 px-3.5 sm:px-5 min-h-[56px] bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro hover:shadow-retro-lg hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center justify-between text-left transition-all cursor-pointer relative"
            >
              <div className="space-y-1 pr-2 sm:pr-4 flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs font-black text-[#1C1917] dark:text-[#FAF6ED] px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] flex-shrink-0">
                    {numberStr}
                  </span>
                  <span className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide group-hover:text-[#B91C4A] dark:group-hover:text-[#E11D48] transition-colors leading-tight">
                    {cat.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] pl-0 sm:pl-9 font-body line-clamp-2 sm:line-clamp-1 max-w-xl">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs text-[#1C1917] dark:text-[#FAF6ED] flex-shrink-0">
                <span className="hidden md:inline-block px-2.5 py-1 bg-[#F8F4EA] dark:bg-[#181715] border border-[#1C1917] dark:border-[#FAF6ED]/60 font-bold shadow-retro-sm">
                  {cat.subcategories.length} subtopics
                </span>
                <div className="w-8 h-8 rounded-none border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white dark:group-hover:bg-[#FAF6ED] dark:group-hover:text-[#1C1917] transition-colors shadow-retro-sm">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* My Topics Entry Point with Scrapbook Banner */}
      {onSelectMyTopics && (
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t-2 border-dashed border-[#1C1917]/30 dark:border-[#FAF6ED]/30">
          <button
            id="cat-select-my-topics"
            onClick={onSelectMyTopics}
            className="group w-full p-4 sm:p-5 bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro hover:shadow-retro-lg hover:translate-x-[-2px] hover:translate-y-[-2px] flex flex-col sm:flex-row sm:items-center justify-between text-left transition-all cursor-pointer tape-strip gap-3"
          >
            <div className="space-y-1 pr-0 sm:pr-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm">
                  Custom
                </span>
                <span className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide group-hover:text-[#B91C4A] dark:group-hover:text-[#E11D48] transition-colors">
                  My Topics &amp; Collections
                </span>
                <span className="font-script text-sm sm:text-base text-[#B91C4A] dark:text-[#E11D48] -rotate-3 hidden sm:inline-block">
                  Universal syllabus
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] font-body">
                Create and practice custom topic collections for exams, interviews, or course syllabi.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 font-display text-xs sm:text-sm tracking-wider uppercase text-[#1C1917] dark:text-[#FAF6ED] flex-shrink-0 border-2 border-[#1C1917] dark:border-[#FAF6ED] px-3.5 py-2 min-h-[44px] bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm group-hover:bg-[#1C1917] group-hover:text-white dark:group-hover:bg-[#FAF6ED] dark:group-hover:text-[#1C1917] transition-colors w-full sm:w-auto">
              <span>Open &rarr;</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

