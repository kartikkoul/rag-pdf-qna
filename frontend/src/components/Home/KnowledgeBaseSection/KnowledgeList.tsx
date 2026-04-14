import { RootState } from '@/src/state/store';
import React from 'react'
import { useSelector } from 'react-redux';
import KnowledgeItem from './KnowledgeItem';

const KnowledgeList = () => {
  const knowledgeList = useSelector((state : RootState) => state.knowledge.knowledge)

  return (
    <ul className="knowledgeList mt-4 w-full">
        {
          knowledgeList.map((documentName, index) => {
            return  <KnowledgeItem key={String(index)} document={documentName} />
          })
        }
    </ul>
  )
}

export default KnowledgeList