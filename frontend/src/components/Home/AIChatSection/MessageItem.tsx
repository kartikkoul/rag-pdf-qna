import { BsCpuFill } from 'react-icons/bs'
import { RiUserFill } from 'react-icons/ri'

const MessageItem = ({ message }: {
  message: {
    role: string,
    content: string
  }
}) => {

  const messageStyles = {
    user: "self-end flex-row-reverse",
    assistant: ""
  }

  const messageIconStyles = {
    user: "bg-purple-300 text-black",
    assistant: "bg-[#2c2c2c] text-purple-300"
  }

  const messageContentStyles = {
    user: "bg-purple-300 text-black font-medium",
    assistant: "bg-[#2c2c2c] rounded-tl-none font-medium"
  }

  return (
    <li className={`
        message ${message.role === "user" ? "user" : "assistant"}
        flex items-start gap-4
        ${messageStyles[message.role as "user" | "assistant"]}
      `}>

      <div className={`messageTypeIcon p-2 mt-1 rounded-sm
        ${messageIconStyles[message.role as "user" | "assistant"]}
        `}>
        {message.role == "assistant" ? <BsCpuFill /> : <RiUserFill />}
      </div>

      <div className={`messageContent
          flex items-start gap-2 p-4 rounded-lg overflow-hidden relative w-max max-w-[80%] text-sm
          ${messageContentStyles[message.role as "user" | "assistant"]}
          
        `}>
        {message.role === "assistant" && <div className="bg-purple-300 w-2 h-full top-0 left-0 absolute"></div>}
        {message.content}
      </div>
    </li>
  )
}

export default MessageItem