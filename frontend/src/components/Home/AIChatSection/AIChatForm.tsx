"use client";
import { addMessage } from "@/src/state/slices/conversationSlice";
import { Message, StreamingMessage } from "@/src/types/types";
import { streamLLMResponse } from "@/src/utils/apiFunctions/queryAPI";
import { Dispatch, SetStateAction, useRef, SubmitEvent, useState, useEffect } from "react";
import { BiStop } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch } from "react-redux";

const initialStreaming: StreamingMessage = {
  message: "",
  streaming: true,
};

const AIChatForm = ({
  setStreamingMessage,
}: {
  setStreamingMessage: Dispatch<SetStateAction<StreamingMessage | null>>;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamedMessageRef = useRef<string>(null);
  const abortController = useRef<AbortController | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const dispatch = useDispatch();


  const submitFormHandler = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!textAreaRef.current || textAreaRef.current.value.trim().length === 0) {
      return;
    }

    const userMessage = {
      role: "user",
      content: textAreaRef.current.value,
    };
    textAreaRef.current.value = "";
    dispatch(addMessage(userMessage));

    abortController.current = new AbortController();
    streamedMessageRef.current = "";
    setStreamingMessage({ ...initialStreaming });

    try {
      setStreaming(true);
      const result = await streamLLMResponse(
        userMessage.content,
        (token) => {
          setStreamingMessage((s) => {
            const prev = s ?? initialStreaming;
            const updatedMessage = prev.message + token;
            streamedMessageRef.current = updatedMessage;

            return {
              ...prev,
              message: updatedMessage,
              streaming: true,
            };
          });
        },
        abortController.current,
      );

      if (
        result &&
        typeof result === "object" &&
        "type" in result &&
        result.type === "error" &&
        "error" in result &&
        Array.isArray(result.error.errors)
      ) {
        const errors = result.error.errors;

        setStreamingMessage(null);
        setStreaming(false);

        dispatch(
          addMessage({
            role: "assistant",
            content: streamedMessageRef.current || "",
            error: errors.join("\n"),
          }),
        );
      } else {
        setStreamingMessage(null);
        setStreaming(false);

        const finalMessage = streamedMessageRef.current ?? "";
        if (finalMessage.length > 0) {
          dispatch(
            addMessage({
              role: "assistant",
              content: finalMessage,
            } as Message),
          );
        }

        streamedMessageRef.current = "";
      }
    } catch (e: unknown) {
      let error = "";
      if (Array.isArray(e)) {
        e.forEach((errMessage) => {
          error = error
            ? `${error}\n${String(errMessage)}`
            : String(errMessage);
        });
      } else if (e instanceof Error) {
        error = e.message;
      } else {
        error = "Something went wrong";
      }

      setStreamingMessage(null);
      setStreaming(false);

      dispatch(
        addMessage({
          role: "assistant",
          content: streamedMessageRef.current || "",
          error: error,
        }),
      );
    }
  };

  return (
    <form
      className="chatActions relative w-[98%] p-2 mb-2 border border-white/10 bg-neutral-900/80 backdrop-blur-sm flex flex-col self-center shrink-0 gap-2 rounded-xl text-xs md:text-sm shadow-[0_0_40px_-20px_rgba(168,85,247,0.3)]"
      onSubmit={submitFormHandler}
    >
      <textarea
        placeholder="Ask a question about your documents…"
        rows={3}
        className="outline-0 text-white placeholder:text-neutral-500 resize-none px-4 pt-3 pb-2 bg-transparent rounded-lg scrollbar-custom"
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!streaming) {
              e.currentTarget.form?.requestSubmit();
            }
          }
        }}
      />
      <div className="actions relative flex min-h-12 items-center justify-end pr-2 pb-1 pt-1">
        {!streaming && (
          <button
            type="submit"
            className="flex h-11 cursor-pointer items-center justify-center gap-1 rounded-md bg-linear-to-r from-purple-300 to-purple-600 px-4 text-black font-semibold shadow-md shadow-purple-900/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            Send <FaPaperPlane className="size-3" aria-hidden />
          </button>
        )}

        {streaming && (
          <button
            type="button"
            aria-label="Stop generating"
            title="Stop generating"
            className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full
              border border-rose-400/40 bg-linear-to-b from-rose-500/90 to-rose-700/95
              text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.55)]
              ring-2 ring-rose-300/30 ring-offset-2 ring-offset-neutral-900
              transition hover:brightness-110 hover:ring-rose-200/40 active:scale-95
              before:absolute before:inset-0 before:rounded-full before:bg-rose-400/20 before:opacity-0 before:animate-pulse group-hover:before:opacity-100"
            onClick={() => abortController.current?.abort()}
          >
            <BiStop className="size-6 drop-shadow-sm" aria-hidden />
            <span className="sr-only">Stop</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default AIChatForm;
