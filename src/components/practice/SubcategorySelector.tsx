import React from "react";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Category } from "../../types";

interface SubcategorySelectorProps {
  category: Category;
  selectedSubcategory: string | null;
  onSelectSubcategory: (subcat: string) => void;
  onBack: () => void;
}

export const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  category,
  selectedSubcategory,
  onSelectSubcategory,
  onBack,
}) => {
  return (
    <div className="w-full text-left">
      {/* Return */}
      <button
        onClick={onBack}
        id="btn-back-subcategories"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-widest text-[#1C1917] dark:text-[#FAF6ED] px-3.5 py-2 min-h-[44px] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm hover:translate-x-[-1px] hover:translate-y-[-1px] mb-6 sm:mb-8 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>&larr; Return to Domains</span>
      </button>

      {/* Screen Title */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="font-mono text-[11px] sm:text-xs uppercase font-bold tracking-widest px-2 py-0.5 border border-[#1C1917] bg-[#1E5F64] text-white shadow-retro-sm">
            STAGE 02 &bull; {category.name}
          </span>
          <span className="font-script text-base sm:text-lg text-[#B91C4A] dark:text-[#E11D48] -rotate-2 select-none">
            Focus your drill area
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide my-2 break-words">
          Choose Focus Area
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#78716C] dark:text-[#A8A29E] font-body">
          Select an exact sub-module or test yourself across all topics in {category.name}.
        </p>
      </div>

      {/* Subcategory list including "All" as first scrapbook option */}
      <div className="space-y-3 sm:space-y-3.5">
        {/* All Subcategories Option with Warm Mustard / Highlight border */}
        <button
          onClick={() => onSelectSubcategory("All")}
          id="btn-select-all-subcategories"
          className="group w-full p-3.5 sm:p-5 min-h-[56px] bg-[#FAF6ED] dark:bg-[#22201D] border-[2.5px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro hover:shadow-retro-lg hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center justify-between text-left transition-all cursor-pointer tape-strip"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 pr-2 sm:pr-4">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1C1917] bg-[#EBB140] text-[#1C1917] shadow-retro-sm flex-shrink-0">
              SHUFFLE
            </span>
            <div>
              <span className="font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide group-hover:text-[#B91C4A] dark:group-hover:text-[#E11D48] transition-colors block leading-tight">
                Random Across All {category.name}
              </span>
              <span className="font-script text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
                Full syllabus roulette
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#1C1917] dark:text-[#FAF6ED] flex-shrink-0">
            <span className="hidden md:inline-block px-2.5 py-1 bg-[#F8F4EA] dark:bg-[#181715] border border-[#1C1917] dark:border-[#FAF6ED]/60 font-bold shadow-retro-sm">
              {category.subcategories.length} subtopics
            </span>
            <div className="w-8 h-8 rounded-none border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white dark:group-hover:bg-[#FAF6ED] dark:group-hover:text-[#1C1917] transition-colors shadow-retro-sm">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>

        {category.subcategories.map((subcat, idx) => {
          const numberStr = (idx + 1).toString().padStart(2, "0");

          return (
            <button
              key={subcat}
              id={`subcat-select-${idx}`}
              onClick={() => onSelectSubcategory(subcat)}
              className="group w-full py-3.5 px-3.5 sm:px-5 min-h-[52px] bg-[#FAF6ED] dark:bg-[#22201D] border-[2px] border-[#1C1917] dark:border-[#FAF6ED] shadow-retro-sm hover:shadow-retro hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] flex items-center justify-between text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 pr-2 sm:pr-4 flex-1">
                <span className="font-mono text-xs font-black text-[#1C1917] dark:text-[#FAF6ED] px-2 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715] flex-shrink-0">
                  {numberStr}
                </span>
                <span className="font-display text-lg sm:text-xl md:text-2xl text-[#1C1917] dark:text-[#FAF6ED] uppercase tracking-wide group-hover:text-[#B91C4A] dark:group-hover:text-[#E11D48] transition-colors leading-tight">
                  {subcat}
                </span>
              </div>
              <div className="w-7 h-7 rounded-none border-[1.5px] border-[#1C1917] dark:border-[#FAF6ED] bg-[#FAF6ED] dark:bg-[#22201D] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white dark:group-hover:bg-[#FAF6ED] dark:group-hover:text-[#1C1917] transition-colors shadow-retro-sm flex-shrink-0">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

