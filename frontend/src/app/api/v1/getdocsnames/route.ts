import { ENV_VARS } from "@/src/env_vars";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    try{
        const authToken = req.cookies.get("authToken")?.value;

        const response = await axios.get(`${ENV_VARS.FASTAPI_BASE_URL}/getdocsnames`, {
            headers:{
                Authorization: "Bearer " + authToken
            }
        });

        return new Response(JSON.stringify(response.data), {status: response.status});
    }catch (e) {
        console.error("Error at getdocsnames route nextjs-server:: ", e);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const detail = e?.detail; //OpenAPI format
          if (detail) {
            return new Response(JSON.stringify(detail), {
              status: 500,
            });
          }

        if(axios.isAxiosError(e)){
          const errResponse = e.response;
          return new Response(JSON.stringify(errResponse?.data), {status: errResponse?.status})
        }

        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
        });
      }
}