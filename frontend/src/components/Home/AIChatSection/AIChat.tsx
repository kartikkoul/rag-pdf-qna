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
        <div className="sticky top-0 z-10 sectionTitle border-b border-white/10 bg-neutral-900/85 backdrop-blur-md w-full px-4 py-3 flex items-center gap-3 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.9)]">
            <div className="sectionIcon p-2 rounded-lg bg-linear-to-br from-purple-300 from-10% to-purple-700 to-90% shadow-md shadow-purple-900/30 ring-1 ring-white/15">
              <BiBot className="size-6 text-neutral-900" aria-hidden />
            </div>
            <div className="sectionInfo min-w-0">
              <h2 className="text-sm md:text-base font-semibold tracking-tight text-neutral-100">MY PERSONALISED CHATBOT</h2>
              <p className="text-xs md:text-sm leading-snug text-neutral-500">Ask questions based on the knowledgebase</p>
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