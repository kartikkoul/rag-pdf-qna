"use client";

import { Dispatch, SetStateAction } from "react";
import { DiDatabase } from "react-icons/di";
import { FaRobot } from "react-icons/fa";

const SectionToggle = ({activeSection, toggleActiveSection} : {
    activeSection: "kb" | "ai",
    toggleActiveSection: Dispatch<SetStateAction<typeof activeSection>>
}) => {

  return (
    <div className="fixed bottom-0 left-0 w-full z-100 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="sectionNav flex items-center justify-between border-t border-white/10 bg-neutral-950/95 backdrop-blur-md h-16 p-1 w-full mx-auto shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        {/* KnowledgeBase */}
        <button
          onClick={() => toggleActiveSection("kb")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-b-lg text-xs font-medium transition-all duration-200 w-1/2 justify-center
                ${
                  activeSection === "kb"
                    ? "bg-linear-to-r from-purple-300 to-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
        >
          <DiDatabase className="size-6"/>
          KnowledgeBase
        </button>

        {/* AI Chat */}
        <button
          onClick={() => toggleActiveSection("ai")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-b-lg text-xs font-medium transition-all duration-200 w-1/2 justify-center
                ${
                  activeSection === "ai"
                    ? "bg-linear-to-r from-purple-300 to-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
        >
          <FaRobot className="size-6" />
          AI Chat
        </button>
      </div>
    </div>
  );
};

export default SectionToggle;
