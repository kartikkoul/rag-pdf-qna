"use client"
import { addMessage } from '@/src/state/slices/conversationSlice';
import { SubmitEvent, useRef } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { useDispatch } from 'react-redux';

const AIChatForm = () => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const dispatch = useDispatch();

    const submitFormHandler = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(textAreaRef.current){
            const userMessage = {
                role: "user",
                content: textAreaRef.current?.value
            };
            textAreaRef.current.value = "";
            dispatch(addMessage(userMessage));
        }
        
    }

    return (
        <form className="chatActions w-full p-2 bg-[#2f2f2f] flex flex-col gap-2 rounded-lg" onSubmit={submitFormHandler}>
            <textarea placeholder="Type your queries here..." rows={3} className=" outline-0 text-white resize-none px-4 pt-4" ref={textAreaRef} onKeyDown={(e) => {
                if(e.key==="Enter" && !e.shiftKey){
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                }
            }} />
            <button type="submit" className="cursor-pointer bg-secondary text-black rounded-sm px-6 py-2 mb-1 mr-2 flex items-center justify-center gap-1 self-end">
                Send <FaPaperPlane className="size-3" />
            </button>
        </form>
    )
}

export default AIChatForm