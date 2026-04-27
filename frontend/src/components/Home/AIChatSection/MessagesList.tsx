"use client";
import { RootState } from '@/src/state/store';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';
import { getRandomGreeting } from '@/src/utils/chat';
import { useEffect, useRef, useState } from 'react';
import { StreamingMessage } from '@/src/types/types';
import StreamingMessageItem from './StreamingMessageItem';

const MessagesList = ({
  streamingMessage,
}: {
  streamingMessage: StreamingMessage | null;
}) => {
  const messages = useSelector((state: RootState) => state.conversation.messages);
  const listRef = useRef<HTMLUListElement>(null);
  const [randomGreeting, setRandomGreeting] = useState<string | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomGreeting(getRandomGreeting());
  }, [])

  useEffect(()=> {
    const lastListElement = listRef.current?.lastElementChild;
    if(lastListElement){
      lastListElement.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, streamingMessage])
  
  return (
    <ul className="messages flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto px-2 mt-15 py-1 scrollbar-custom" ref={listRef}>
        {
          /* Initial greeting by AI - This won't be included in the context for backend*/
          randomGreeting && <MessageItem message={{
            "role": "assistant",
            "content": randomGreeting as string
          }} />
        }
        {
            messages.map((message, index) => (
                <MessageItem key={index.toString()} message={message}/>
            ))
        }
        {
          streamingMessage && <StreamingMessageItem message={streamingMessage} />
        }
    </ul>
  )
}

export default MessagesList