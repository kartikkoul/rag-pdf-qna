import { ENV_VARS } from "@/src/env_vars";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    /* Get incoming form data from client */
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if(!files.length){
        return new Response(JSON.stringify({"message": "No files provided"}), {status: 400})
    }

    const authToken = (await cookies()).get("authToken")?.value;

    /* Forward request to the backend */
    const response = await axios.post(
      `${ENV_VARS["FASTAPI_BASE_URL"]}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      },
    );

    return new Response(JSON.stringify(response.data), {status: response.status});
    
  } catch (e) {
    console.error("Error at upload nextjs-server:: ", e);
    
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
