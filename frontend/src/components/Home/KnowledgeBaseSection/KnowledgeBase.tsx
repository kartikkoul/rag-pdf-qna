import KnowledgeList from "./KnowledgeList";
import UploadFileComponent from "./UploadFileComponent";

const KnowledgeBase = () => {
  return (
    <section className="knowledgeBase flex-1 md:flex-none md:w-[30%] h-full flex flex-col items-center mt-15 md:mt-0">
      <div className="sectionTitle self-center mt-4">
        <p className=" text-gray-300 leading-8 text-center text-xs md:text-sm">Expand the KnowledgeBase by uploading the documents</p>
      </div>

      <UploadFileComponent/>

      <div className="knowledge flex flex-col items-center mt-10 w-full h-80 md:h-90">
        <h3 className="text-gray-300 text-sm">EXISTING KNOWLEDGE</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase