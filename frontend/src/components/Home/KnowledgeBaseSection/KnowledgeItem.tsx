import React from 'react'
import { TbFileDescriptionFilled } from 'react-icons/tb';

const KnowledgeItem = ({document}: { document: string}) => {
  return (
    <li className="mb-2 last:mb-0">
         <div className="knowledgeItem group w-full min-h-11 items-center gap-3 px-3 py-2.5 flex text-nowrap rounded-lg border border-transparent bg-neutral-900/60 ring-1 ring-white/5 transition hover:border-purple-500/25 hover:bg-neutral-800/50">
             <div className="knowledgeListIcon shrink-0 text-secondary bg-neutral-800 p-1.5 rounded-md ring-1 ring-white/5"><TbFileDescriptionFilled className="size-4" aria-hidden /></div>
             <div className="document truncate text-neutral-200 text-[13px]" title={document}>{document}</div>
          </div>
    </li>
  )
}

export default KnowledgeItem