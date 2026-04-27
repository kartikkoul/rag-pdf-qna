import React from 'react'
import { TbFileDescriptionFilled } from 'react-icons/tb';

const KnowledgeItem = ({document}: { document: string}) => {
  return (
    <li className="mb-2">
         <div className="knowledgeItem bg-bg-neutral w-full h-10 items-center gap-4 p-4 flex text-nowrap">
             <div className="knowledgeListIcon text-secondary bg-bg-secondary p-1 rounded-sm"><TbFileDescriptionFilled className="size-4"/></div>
             <div className="document truncate">{document}</div>
          </div>
    </li>
  )
}

export default KnowledgeItem