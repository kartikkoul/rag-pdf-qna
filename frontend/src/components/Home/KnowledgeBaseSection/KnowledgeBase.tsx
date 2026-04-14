"use client"
import { useEffect, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import KnowledgeList from "./KnowledgeList";
import { useDispatch } from "react-redux";
import { fetchKnowledge } from "@/src/state/slices/knowledgeSlice";

const KnowledgeBase = () => {
  const uploadAreaRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch();

  useEffect(() => {
    uploadAreaRef.current?.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadAreaRef.current?.classList.add("drag")
    })

    uploadAreaRef.current?.addEventListener("dragleave", (e) => {
      e.preventDefault()
      uploadAreaRef.current?.classList.remove("drag")
    })

    dispatch(fetchKnowledge())
  })

  return (
    <section className="knowledgeBase min-h-full w-3/7 flex flex-col items-center">
      <div className="sectionTitle self-start">
        <p className=" text-gray-300 leading-8">Expand the KnowledgeBase by uploading the documents</p>
      </div>

      <div ref={uploadAreaRef} className="uploadArea mt-8 bg-[#101010] w-full h-60 shadow-[0px_0px_10px] [&.drag]:shadow-[0px_0px_15px] shadow-[#c082dc5f] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 rounded-md p-8">
        <div className="uploadIcon bg-gray-800 p-4 rounded-md">
          <FaFileUpload className="size-8 text-purple-300" />
        </div>
        <p>Drop Documents Here</p>
        <div className="uploadFileOption">
          <button className="bg-linear-to-r from-purple-200 to-purple-500 font-medium text-black px-6 p-2 rounded-sm cursor-pointer">UPLOAD FILE</button>
        </div>
      </div>

      <div className="knowledge flex flex-col items-start mt-12 w-full ">
        <h3 className="text-gray-300">EXISTING KNOWLEDGE</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase