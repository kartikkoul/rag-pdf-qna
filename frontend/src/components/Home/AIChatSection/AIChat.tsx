import { BiBot } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import MessagesList from "./MessagesList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addMessage } from "@/src/state/slices/conversationSlice";

const AIChat = () => {
  const dispatch = useDispatch();
  

  useEffect(() => {
    const initialMessages = [
      {role: "assistant", content: "Hello! I am your personalised chatbot. How can I assist you today?"},
      {role: "user", content: "Hello, AI!"}
    ]

    dispatch(addMessage(initialMessages));
  }, [dispatch])

  return (
    <section className="chat bg-bg-neutral w-full">
        <div className="sectionTitle bg-[#2f2f2f] h-1/10 w-full px-4 flex items-center gap-4">
            <div className="sectionIcon p-2 rounded-sm bg-linear-120 from-purple-300 from-10% to-secondary to-90%">
              <BiBot className="size-6 text-[#2f2f2f]"/>
            </div>
            <div className="sectionInfo">
              <h2 className="font-semibold">MY PERSONALISED CHATBOT</h2>
              <p className="text-sm leading-4">Engage in a conversation with the chatbot about your knowledgebase</p>
            </div>
        </div>
        
        <div className="chatArea flex flex-col justify-between h-9/10 w-full p-4">
            <MessagesList/>
            <div className="chatActions w-full p-2 bg-[#2f2f2f] flex flex-col gap-2 rounded-lg">
              <textarea placeholder="Type your queries here..." rows={3} className=" outline-0 text-white resize-none px-4 pt-4" />
              <button className="bg-secondary text-black rounded-sm px-6 py-2 flex items-center justify-center gap-1 self-end">
                Send <FaPaperPlane className="size-3"/>
              </button>
            </div>
        </div>
    </section>
  )
}

export default AIChat