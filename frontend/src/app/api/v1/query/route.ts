import { ENV_VARS } from "@/src/env_vars";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authToken = req.cookies.get("authToken")?.value;

    const body = await req.json();

    const response = await fetch(`${ENV_VARS.FASTAPI_BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (e) {
    console.error("Error at query route nextjs-server:: ", e);
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const detail = e?.detail; //OpenAPI format
      if (detail) {
        return new Response(JSON.stringify(detail), {
          status: 500,
        });
      }
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}