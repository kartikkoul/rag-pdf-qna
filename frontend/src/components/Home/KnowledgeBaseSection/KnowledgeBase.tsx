"use client"
import KnowledgeList from "./KnowledgeList";
import UploadFileComponent from "./UploadFileComponent";
import { MdOutlineLibraryBooks } from "react-icons/md";

const KnowledgeBase = () => {

  return (
    <section className="knowledgeBase md:flex-none md:w-[30%] lg:w-[28%] flex flex-col items-center h-full min-h-0 overflow-hidden px-2 md:px-3">
      <div className="sectionTitle self-stretch mt-3 md:mt-4 shrink-0 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-purple-300/90">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-purple-400/25 to-purple-900/40 ring-1 ring-white/10">
            <MdOutlineLibraryBooks className="size-5" aria-hidden />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Knowledge base</span>
        </div>
        <p className="text-neutral-400 leading-relaxed text-center text-xs md:text-sm max-w-[18rem]">
          Upload PDFs to expand what your assistant can answer from.
        </p>
      </div>

      <UploadFileComponent/>

      <div className="knowledge flex flex-col items-center mt-6 md:mt-8 w-full min-h-0 flex-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1">Your documents</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase