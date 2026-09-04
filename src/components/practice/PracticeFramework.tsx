import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PracticeFrameworkProps {
  type?: "general" | "behavioral" | "technical";
}

export const PracticeFramework: React.FC<PracticeFrameworkProps> = ({
  type = "general",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full my-6 text-left border-[2px] border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#FAF6ED] dark:bg-[#22201D] shadow-retro-sm">

      <button
        onClick={() => setIsOpen(!isOpen)}
        id="btn-toggle-framework"
        className="group flex items-center justify-between w-full p-3.5 text-xs font-mono uppercase font-bold tracking-wider text-[#1C1917] dark:text-[#FAF6ED] cursor-pointer transition-colors bg-[#FAF6ED] dark:bg-[#22201D] hover:bg-[#F8F4EA]"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EBB140]" />

          <span>
            {type === "behavioral"
              ? "How to Structure Your Answer"
              : "Explanation Guide"}
          </span>

          <span className="font-script text-sm text-[#78716C] dark:text-[#A8A29E] -rotate-1 font-normal lowercase">
            (optional)
          </span>
        </div>

        <span className="flex items-center gap-1 font-mono text-[11px] border border-[#1C1917] dark:border-[#FAF6ED]/40 px-2 py-0.5 shadow-retro-sm bg-[#F8F4EA] dark:bg-[#181715]">

          <span>{isOpen ? "HIDE" : "SHOW"}</span>

          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}

        </span>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t-[2px] border-[#1C1917] dark:border-[#FAF6ED]/60 bg-[#F8F4EA] dark:bg-[#181715] text-[#1C1917] dark:text-[#FAF6ED] transition-all">

          {type === "behavioral" ? (

            <div className="space-y-4">

              <span className="font-mono text-xs uppercase font-bold block">
                STAR METHOD
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">

                <div className="p-3 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED]/40 shadow-retro-sm">

                  <span className="font-display text-lg tracking-wide uppercase text-[#B91C4A] block mb-1">
                    01. Situation
                  </span>

                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed">
                    Briefly explain what happened and the situation you were in.
                  </p>

                </div>


                <div className="p-3 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED]/40 shadow-retro-sm">

                  <span className="font-display text-lg tracking-wide uppercase text-[#EBB140] block mb-1">
                    02. Task
                  </span>

                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed">
                    What was your responsibility or the problem you needed to solve?
                  </p>

                </div>


                <div className="p-3 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED]/40 shadow-retro-sm">

                  <span className="font-display text-lg tracking-wide uppercase text-[#1E5F64] block mb-1">
                    03. Action
                  </span>

                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed">
                    What did you personally do to solve the problem?
                  </p>

                </div>


                <div className="p-3 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED]/40 shadow-retro-sm">

                  <span className="font-display text-lg tracking-wide uppercase block mb-1">
                    04. Result
                  </span>

                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body leading-relaxed">
                    What happened in the end? What did you achieve or learn?
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="space-y-3">

              <span className="font-mono text-xs uppercase font-bold block">
                SIMPLE EXPLANATION GUIDE
              </span>

              <div className="space-y-2 pt-1">

                {[
                  {
                    step: "01",
                    title: "What is it?",
                    desc: "Explain the topic using simple words.",
                  },
                  {
                    step: "02",
                    title: "Why does it exist?",
                    desc: "What problem does it solve? Why was it created?",
                  },
                  {
                    step: "03",
                    title: "How does it work?",
                    desc: "Explain how it works step by step.",
                  },
                  {
                    step: "04",
                    title: "Give an example",
                    desc: "Use a real-world example or simple comparison.",
                  },
                  {
                    step: "05",
                    title: "What are the limits?",
                    desc: "When is it not the best choice? What are its limitations?",
                  },
                ].map((item) => (

                  <div
                    key={item.step}
                    className="p-2.5 bg-[#FAF6ED] dark:bg-[#22201D] border border-[#1C1917] dark:border-[#FAF6ED]/40 flex items-start gap-3 shadow-retro-sm"
                  >

                    <span className="font-mono text-xs font-black px-1.5 py-0.5 border border-[#1C1917] bg-[#F8F4EA] dark:bg-[#181715]">
                      {item.step}
                    </span>

                    <div>

                      <strong className="font-display text-base tracking-wide uppercase text-[#1C1917] dark:text-[#FAF6ED] mr-2">
                        {item.title}:
                      </strong>

                      <span className="text-xs text-[#78716C] dark:text-[#A8A29E] font-body">
                        {item.desc}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>
      )}

    </div>
  );
};