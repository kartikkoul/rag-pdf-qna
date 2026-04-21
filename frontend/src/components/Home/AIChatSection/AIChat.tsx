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
    <section className="chat bg-bg-neutral md:w-[65%] w-full h-full flex flex-col">
        <div className="sectionTitle bg-[#2f2f2f] h-1/10 w-full px-4 flex items-center gap-4">
            <div className="sectionIcon p-2 rounded-sm bg-linear-120 from-purple-300 from-10% to-secondary to-90%">
              <BiBot className="size-6 text-[#2f2f2f]"/>
            </div>
            <div className="sectionInfo">
              <h2 className="font-semibold">MY PERSONALISED CHATBOT</h2>
              <p className="text-sm leading-4 text-[#14d3d3b9]">Ask questions based on the knowledgebase</p>
            </div>
        </div>
        
        <div className="chatArea flex flex-col h-9/10 w-full p-4">
            <MessagesList streamingMessage={streamingMessage}/>
            <AIChatForm setStreamingMessage={setStreamingMessage}/>
        </div>
    </section>
  )
}

export default AIChat