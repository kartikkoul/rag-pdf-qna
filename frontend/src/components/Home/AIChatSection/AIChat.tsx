"use client";
import { BiBot } from "react-icons/bi";
import MessagesList from "./MessagesList";
import AIChatForm from "./AIChatForm";
import { useState } from "react";
import { StreamingMessage } from "@/src/types/types";


const AIChat = () => {
  const [streamingMessage, setStreamingMessage] =
    useState<StreamingMessage | null>(null);

  return (
    <section className="chat bg-bg-neutral w-full flex flex-col h-full min-h-0 relative overflow-hidden">
        <div className="sticky top-0 z-10 sectionTitle bg-[#2f2f2f] w-full px-4 py-2 flex items-center gap-4 shadow-[0px_0px_40px_10px] shadow-bg-neutral">
            <div className="sectionIcon p-2 rounded-sm bg-linear-120 from-purple-300 from-10% to-secondary to-90%">
              <BiBot className="size-6 text-[#2f2f2f]"/>
            </div>
            <div className="sectionInfo">
              <h2 className="text-sm md:text-lg font-semibold">MY PERSONALISED CHATBOT</h2>
              <p className="text-xs md:text-sm leading-4 text-[#14d3d3b9]">Ask questions based on the knowledgebase</p>
            </div>
        </div>
        
        <div className="chatArea flex flex-col h-full min-h-0">
            <MessagesList streamingMessage={streamingMessage}/>
            <AIChatForm setStreamingMessage={setStreamingMessage}/>
        </div>
    </section>
  )
}

export default AIChat