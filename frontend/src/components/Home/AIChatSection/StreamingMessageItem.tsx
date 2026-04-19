import { StreamingMessage } from '@/src/types/types'
import { BsCpuFill } from 'react-icons/bs'
import ReactMarkdown from "react-markdown"

const StreamingMessageItem = ({ message }: { message: StreamingMessage }) => {

  const messageContentStyles = {
    assistant: "bg-[#2c2c2c] rounded-tl-none font-medium"
  }

  return (
    <li className={`
        message assistant
        flex items-start gap-4
      `}>

      <div className={`messageTypeIcon p-2 mt-1 rounded-sm
        bg-[#2c2c2c] text-purple-300
        `}>
        <BsCpuFill />
      </div>

      <div className={`messageContent
          flex items-start gap-2 p-4 rounded-lg overflow-hidden relative w-max max-w-[80%] text-sm
          ${messageContentStyles.assistant}

        `}>
        <div className="bg-purple-300 w-2 h-full top-0 left-0 absolute"></div>
        <ReactMarkdown>
          {message.message ?? ''}
        </ReactMarkdown>
        {message.streaming ? (
          <span className="inline-block w-0.5 h-4 ml-0.5 bg-purple-300 animate-pulse align-middle" aria-hidden />
        ) : null}
      </div>
    </li>
  )
}

export default StreamingMessageItem
