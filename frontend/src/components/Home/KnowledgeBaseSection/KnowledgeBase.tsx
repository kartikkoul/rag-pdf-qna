import KnowledgeList from "./KnowledgeList";
import UploadFileComponent from "./UploadFileComponent";

const KnowledgeBase = () => {
  return (
    <section className="knowledgeBase h-full max-h-full md:w-[33%] flex flex-col items-center">
      <div className="sectionTitle md:self-start self-center mt-4">
        <p className=" text-gray-300 leading-8 text-center text-sm">Expand the KnowledgeBase by uploading the documents</p>
      </div>

      <UploadFileComponent/>

      <div className="knowledge flex flex-col items-center mt-10 w-full h-7/10">
        <h3 className="text-gray-300">EXISTING KNOWLEDGE</h3>
        <KnowledgeList />
      </div>
    </section>
  )
}

export default KnowledgeBase