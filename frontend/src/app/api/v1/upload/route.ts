import { ENV_VARS } from "@/src/env_vars";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request){
    try{
        /* Get incoming form data from client */
        const formData = await request.formData();
        const authToken = (await cookies()).get("authToken")?.value;
    
        const files = formData.getAll("files") as File[];
    
        if(!files.length){
            return new Response(JSON.stringify({"message": "No files provided"}), {status: 400})
        }
    
        /* Forward request to the backend */
        const response = await axios.post(`${ENV_VARS["FASTAPI_BASE_URL"]}/upload`, formData, {
            headers:{
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${authToken}`
            },
        });
    
         /* Handle FastAPI response */
        return new Response(JSON.stringify(response.data), {status:201});
    }catch(e){
        console.error("Error at upload nextjs-server:: ", e);
        if(axios.isAxiosError(e)){
            const errorRes = e.response;

            const detail = errorRes?.data?.detail //OpenAPI format
            if(detail){
                return new Response(JSON.stringify(detail), {status: errorRes.status});
            }
        }
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}