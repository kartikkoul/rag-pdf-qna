import { RootState } from '@/src/state/store';
import { useSelector } from 'react-redux';
import KnowledgeItem from './KnowledgeItem';
import { FiDatabase } from 'react-icons/fi';

const KnowledgeList = () => {
  const knowledgeList = useSelector((state : RootState) => state.knowledge.knowledge);

  if(!knowledgeList || knowledgeList.length === 0){
    return <div className="noKnowledge flex flex-col flex-1 min-h-0 gap-5  justify-center items-center h-full text-gray-400 w-5/10 md:w-8/10"> 
      <FiDatabase size={60}/>
      <p className="text-xs text-center">No files uploaded yet. Please click on upload file to start feeding knowledge to your bot.</p> 
    </div>
  }

  return (
    <ul className="knowledgeList mt-4 w-full h-10 flex-1 px-4 md:px-0 md:w-[85%] md:pr-2 overflow-y-auto scrollbar-custom scrollbar-stable text-xs">
        {
          knowledgeList.map((documentName) => {
            return  <KnowledgeItem key={documentName} document={documentName} />
          })
        }
    </ul>
  )
}

export default KnowledgeList