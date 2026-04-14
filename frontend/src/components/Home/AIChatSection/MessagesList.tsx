"use client";
import { RootState } from '@/src/state/store';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';

const MessagesList = () => {
  const messages = useSelector((state: RootState) => state.conversation.messages);
  console.log(messages);
  return (
    <ul className="messages flex flex-col gap-4 h-full overflow-y-auto">
        {
            messages.map((message, index) => (
                <MessageItem key={index.toString()} message={message}/>
            ))
        }
    </ul>
  )
}

export default MessagesList