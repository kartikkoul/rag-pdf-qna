"use client";
import { RootState } from '@/src/state/store';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';
import { getRandomGreeting } from '@/src/utils/chat';
import { useEffect, useState } from 'react';

const MessagesList = () => {
  const messages = useSelector((state: RootState) => state.conversation.messages);
  const [randomGreeting, setRandomGreeting] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomGreeting(getRandomGreeting());
  }, [])

  return (
    <ul className="messages flex flex-col gap-4 h-full overflow-y-auto">
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
    </ul>
  )
}
1
export default MessagesList