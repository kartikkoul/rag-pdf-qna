"use client"
import KnowledgeList from "./KnowledgeList";
import UploadFileComponent from "./UploadFileComponent";

const KnowledgeBase = () => {

  return (
    <section className="knowledgeBase md:flex-none md:w-[40%] flex flex-col items-center h-full min-h-0 overflow-hidden">
      <div className="sectionTitle self-center mt-4 shrink-0">
        <p className=" text-gray-300 leading-8 text-center text-xs md:text-sm">Expand the KnowledgeBase by uploading the documents</p>
      </div>

      <UploadFileComponent/>

      <div className="knowledge flex flex-col items-center mt-10 w-full min-h-0 flex-1">
        <h3 className="text-gray-300 text-sm">EXISTING KNOWLEDGE</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase