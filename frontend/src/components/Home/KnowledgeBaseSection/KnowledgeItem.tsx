import React from 'react'
import { TbFileDescriptionFilled } from 'react-icons/tb';

const KnowledgeItem = ({key, document}: { key:string, document: string}) => {
  return (
    <li key={key} className="mb-2">
         <div className="knowledgeItem bg-bg-neutral w-full h-15 items-center gap-4 p-4 flex">
             <div className="knowledgeListIcon text-secondary bg-bg-secondary p-1 rounded-sm"><TbFileDescriptionFilled className="size-6"/></div>
             <div className="document">{document}</div>
          </div>
    </li>
  )
}

export default KnowledgeItem