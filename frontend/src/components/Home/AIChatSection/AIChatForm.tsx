"use client"
import { addMessage } from '@/src/state/slices/conversationSlice'
import { Message, StreamingMessage } from '@/src/types/types'
import { streamLLMResponse } from '@/src/utils/apiFunctions/queryAPI'
import { Dispatch, SetStateAction, useRef, SubmitEvent } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

const initialStreaming: StreamingMessage = {
    message: '',
    streaming: true,
    error: '',
}

const AIChatForm = ({
    setStreamingMessage,
}: {
    setStreamingMessage: Dispatch<SetStateAction<StreamingMessage | null>>
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const streamedMessageRef = useRef<string>(null);
    const abortController = useRef<AbortController | null>(null)
    const dispatch = useDispatch()

    const normalizeToken = (token: string) => {
        return token
            .replace(/\s+([’'])/g, "$1")
            .replace(/\s+([.,!?;:])/g, "$1")
    }

    const joinToken = (currentMessage: string, incomingToken: string) => {
        const normalized = normalizeToken(incomingToken)
        if (!currentMessage) return normalized

        const shouldInsertSpace =
            !/\s$/.test(currentMessage) &&
            !/^[\s.,!?;:'")\]}]/.test(normalized) &&
            !/[(\[{"]$/.test(currentMessage)

        return `${currentMessage}${shouldInsertSpace ? " " : ""}${normalized}`
    }

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
            const result = await streamLLMResponse(
                userMessage.content,
                (token) => {

                    setStreamingMessage((s) => {
                        const prev = s ?? initialStreaming
                        const updatedMessage = prev.message + token;
                        streamedMessageRef.current = updatedMessage;

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
                'errors' in result &&
                Array.isArray((result as { errors: string[] }).errors)
            ) {
                const errors = (result as { errors: string[] }).errors
                setStreamingMessage((s) => ({
                    ...(s ?? initialStreaming),
                    error: errors.join('\n'),
                    streaming: false,
                }))
            } else {
                setStreamingMessage(null);

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
            setStreamingMessage((s) => ({
                ...(s ?? initialStreaming),
                error,
                streaming: false,
            }))
        }
    }

    return (
        <form className="chatActions w-full p-2 bg-[#2f2f2f] flex flex-col gap-2 rounded-lg" onSubmit={submitFormHandler}>
            <textarea placeholder="Type your queries here..." rows={3} className=" outline-0 text-white resize-none px-4 pt-4" ref={textAreaRef} onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                }
            }} />
            <button type="submit" className="cursor-pointer bg-secondary text-black rounded-sm px-6 py-2 mb-1 mr-2 flex items-center justify-center gap-1 self-end">
                Send <FaPaperPlane className="size-3" />
            </button>
        </form>
    )
}

export default AIChatForm
