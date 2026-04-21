import { RootState } from '@/src/state/store';
import React from 'react'
import { useSelector } from 'react-redux';
import KnowledgeItem from './KnowledgeItem';
import { FiDatabase } from 'react-icons/fi';

const KnowledgeList = () => {
  const knowledgeList = useSelector((state : RootState) => state.knowledge.knowledge);

  if(knowledgeList){
    return <div className="noKnowledge flex flex-col mt-25 gap-5 items-center h-full text-gray-400">
      <FiDatabase size={60}/>
      <p className="text-xs text-center">No files uploaded yet. Please click on upload file to start feeding knowledge to your bot.</p> 
    </div>
  }

  if(knowledgeList && knowledgeList.length > 0){
    return (
      <ul className="knowledgeList mt-4 w-full px-2 md:pr-2 overflow-y-auto scrollbar-custom scrollbar-stable">
          {
            knowledgeList.map((documentName, index) => {
              return  <KnowledgeItem key={index.toString()} document={documentName} />
            })
          }
      </ul>
    )
  }
}

export default KnowledgeList