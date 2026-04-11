import { UserSignInSchema } from "@/src/schemas/user_schemas";
import { signInUser } from "@/src/services/authServices";

export async function POST(request: Request){
    try{
        const signInBody = await request.json();
        
        const validateData = UserSignInSchema.safeParse(signInBody);
        
        if(!validateData.success){
            const error = {
                type: "validation_error",
                message: JSON.parse(validateData.error.message)
            }
            return new Response(JSON.stringify({ error: error }), {
                status: 400,
            });
        }
    
        const { username, password } = signInBody;

        /* Sign in user & get token */
        const signInResponse = await signInUser(username, password);
    
        // If a response is returned, return the response
        if(signInResponse instanceof Response){
            return signInResponse;
        }
    
        // Return token
        return new Response(JSON.stringify(signInResponse), { status: 200 });
    }catch(error){
        console.error("Error in sign-in route:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}