"use client"
import { addMessage } from '@/src/state/slices/conversationSlice'
import { Message, StreamingMessage } from '@/src/types/types'
import { streamLLMResponse } from '@/src/utils/apiFunctions/queryAPI'
import { Dispatch, SetStateAction, useRef, SubmitEvent, useState } from 'react'
import { BiStop } from 'react-icons/bi'
import { FaPaperPlane } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

const initialStreaming: StreamingMessage = {
    message: '',
    streaming: true,
}

const AIChatForm = ({
    setStreamingMessage,
}: {
    setStreamingMessage: Dispatch<SetStateAction<StreamingMessage | null>>
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const streamedMessageRef = useRef<string>(null)
    const abortController = useRef<AbortController | null>(null)
    const [streaming, setStreaming] = useState<boolean>(false)
    const dispatch = useDispatch()


    const submitFormHandler = async (e: SubmitEvent) => {
        e.preventDefault()
        if (!textAreaRef.current || textAreaRef.current.value.trim().length === 0) {
            return
        }

        const userMessage = {
            role: "user",
            content: textAreaRef.current.value,
        }
        textAreaRef.current.value = ""
        dispatch(addMessage(userMessage))

        abortController.current = new AbortController()
        setStreamingMessage({ ...initialStreaming })

        try {
            setStreaming(true)
            const result = await streamLLMResponse(
                userMessage.content,
                (token) => {

                    setStreamingMessage((s) => {
                        const prev = s ?? initialStreaming
                        const updatedMessage = prev.message + token
                        streamedMessageRef.current = updatedMessage

                        return {
                            ...prev,
                            message: updatedMessage,
                            streaming: true,
                        }
                    })
                },
                abortController.current
            )

            if (
                result &&
                typeof result === 'object' &&
                'type' in result &&
                result.type === 'error' &&
                'error' in result &&
                Array.isArray(result.error.errors)
            ) {
                const errors = result.error.errors

                setStreamingMessage(null)
                setStreaming(false)

                dispatch(addMessage({
                    role: "assistant",
                    content: streamedMessageRef.current || "",
                    error: errors.join('\n')
                }))
            } else {
                setStreamingMessage(null)
                setStreaming(false)

                dispatch(addMessage({
                    role: "assistant",
                    content: streamedMessageRef.current
                } as Message))

                streamedMessageRef.current = ""
            }
        } catch (e: unknown) {
            let error = ""
            if (Array.isArray(e)) {
                e.forEach((errMessage) => {
                    error = error ? `${error}\n${String(errMessage)}` : String(errMessage)
                })
            } else if (e instanceof Error) {
                error = e.message
            } else {
                error = "Something went wrong"
            }

            setStreamingMessage(null)
            setStreaming(false)

            dispatch(addMessage({
                role: "assistant",
                content: streamedMessageRef.current || "",
                error: error
            }))
        }
    }

    return (
        <form className="chatActions w-full p-2 mt-2 bg-[#2f2f2f] flex flex-col gap-2 rounded-lg" onSubmit={submitFormHandler}>
            <textarea placeholder="Type your queries here..." rows={3} className=" outline-0 text-white resize-none px-4 pt-4" ref={textAreaRef} onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if(!streaming){
                        e.currentTarget.form?.requestSubmit()
                    }
                }
            }} />
            {!streaming && <button type="submit" className="cursor-pointer bg-secondary text-black rounded-sm px-6 py-2 mb-1 mr-2 flex items-center justify-center gap-1 self-end">
                Send <FaPaperPlane className="size-3" />
            </button>}

            {streaming && <button className="cursor-pointer ring-1 ring-offset-4 ring-offset-[#2f2f2f] ring-bg-secondary bg-secondary text-black rounded-full  mb-1 mr-2 flex items-center justify-center gap-1 self-end shadow-[0px_0px_10px_4px] shadow-secondary"
                onClick={() => abortController.current?.abort()}
            >
                <BiStop className="size-10 text-white" />
            </button>}
        </form>
    )
}

export default AIChatForm
