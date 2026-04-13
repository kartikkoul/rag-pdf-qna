import React from 'react'
import { TbFileDescriptionFilled } from 'react-icons/tb';

const KnowledgeItem = ({key, document}: { key:string, document: string}) => {
  return (
    <li key={key} className="mb-4">
         <div className="knowledgeItem bg-[#101010] w-full h-15 items-center gap-4 p-4 flex">
             <div className="knowledgeListIcon text-secondary bg-bg-secondary p-1 rounded-sm"><TbFileDescriptionFilled className="size-6"/></div>
             <div className="document">{document}</div>
          </div>
    </li>
  )
}

export default KnowledgeItem