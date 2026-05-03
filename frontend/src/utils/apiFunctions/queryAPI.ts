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
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
        signal: controller.signal
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        let message = `Request failed with status ${res.status}`;

        if (contentType.includes("application/json")) {
          const errorBody = (await res.json().catch(() => null)) as unknown;
          const record = typeof errorBody === "object" && errorBody !== null ? (errorBody as Record<string, unknown>) : null;

          const detail = record && "detail" in record ? (record.detail as unknown) : undefined;

          if (typeof detail === "string") {
            message = detail;
          } else if (typeof record?.message === "string") {
            message = record.message;
          } else if (typeof detail === "object" && detail !== null) {
            const detailRecord = detail as Record<string, unknown>;
            if (typeof detailRecord.message === "string") message = detailRecord.message;
          }
        } else {
          const errorText = await res.text().catch(() => "");
          if (errorText.trim()) message = errorText.trim();
        }

        throw new Error(message);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/event-stream")) {
        const bodyText = await res.text().catch(() => "");
        throw new Error(
          bodyText?.trim()
            ? bodyText.trim()
            : `Expected SSE (text/event-stream) but got: ${contentType || "unknown content-type"}`
        );
      }

      if (!res.body) throw new Error("No response body");
  
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
  
      let buffer = "";
  
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        const parts = buffer.split(/\r?\n\r?\n/u);
        buffer = parts.pop() || "";
  
        for (const part of parts) {
          const lines = part.split(/\r?\n/u);
          const dataLines = lines
            .filter((l) => l.startsWith("data:"))
            .map((l) => {
              const rest = l.slice(5);
              return rest.startsWith(" ") ? rest.slice(1) : rest;
            });

          if (dataLines.length === 0) continue;

          const raw = dataLines.join("\n");

          if (raw === "[DONE]") return;
          if (raw === "[PING]") continue;
          if (!raw) continue;

          let token: string;
          try {
            const parsed = JSON.parse(raw);
            token = typeof parsed === "string" ? parsed : String(parsed);
          } catch {
            token = raw;
          }

          if (!token) continue;

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