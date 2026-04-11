import { checkUserExists } from "@/src/db/user_queries";
import { decodeToken } from "@/src/utils/auth";

export async function GET(request: Request){
    try{
        const authHeader = request.headers.get("Authorization");
        
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        
        const token = authHeader.split(" ")[1];

        const decode = decodeToken(token);

        if(!decode){
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
        }

        const { userId, username } = decode;

        if(!userId || !username){
            return new Response(JSON.stringify({ error: "Invalid token payload" }), { status: 401 });
        }

        const user = await checkUserExists(userId, username);
        if(!user){
            return new Response(JSON.stringify({ error: "Invalid token: User doesn't exist" }), { status: 404 });
        }

        return new Response(JSON.stringify({ userId, username }), { status: 200 });
    }catch(e){
        console.error("Error in get user route:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}