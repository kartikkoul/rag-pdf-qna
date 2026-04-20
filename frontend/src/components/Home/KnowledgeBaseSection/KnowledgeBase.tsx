import KnowledgeList from "./KnowledgeList";
import UploadFileComponent from "./UploadFileComponent";

const KnowledgeBase = () => {
  return (
    <section className="knowledgeBase h-full max-h-full w-[33%] flex flex-col items-center">
      <div className="sectionTitle self-start">
        <p className=" text-gray-300 leading-8">Expand the KnowledgeBase by uploading the documents</p>
      </div>

      <UploadFileComponent/>

      <div className="knowledge flex flex-col items-start mt-10 w-full h-4/10">
        <h3 className="text-gray-300">EXISTING KNOWLEDGE</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase