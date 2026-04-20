import { StandardError } from "@/src/types/types";
import BASE_API_ROUTER from "./axiosRouter";
import generateErrors from "./generateErrors";

export const streamLLMResponse = async (
    query: string,
    onToken: (token: string) => void,
    controller: AbortController
  ) => {
    try {
      const res = await fetch(BASE_API_ROUTER.getUri() + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal
      });
  
      if (!res.body) throw new Error("No response body");
  
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
  
      let buffer = "";
  
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
  
        for (const part of parts) {
          if (!part.startsWith("data:")) continue;

          // Preserve whitespace inside streamed chunks. SSE allows an optional
          // single space after "data:"; remove only that prefix space.
          const rawToken = part.slice(5);
          const token = rawToken.startsWith(" ") ? rawToken.slice(1) : rawToken;

          if (token === "[DONE]") return;

          onToken(token);
        }
      }
    } catch (e: Error | StandardError | unknown) {

      return {
        type: "error",
        error: generateErrors(e as Error | StandardError),
      };
    }
  };