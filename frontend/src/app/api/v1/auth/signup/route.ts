import { UserSignUpSchema } from "@/src/schemas/user_schemas";
import { signInUser, signUpUser } from "@/src/services/authServices";

export async function POST(request: Request) {
    try{
        const signUpBody = await request.json();
        
        const validateData = UserSignUpSchema.safeParse(signUpBody);
        
        if(!validateData.success){
            const error = {
                type: "validation_error",
                message: JSON.parse(validateData.error.message)
            }
            return new Response(JSON.stringify({ error: error }), {
                status: 400,
            });
        }
    
        const { username, email, password } = signUpBody;
    
        /* Create new user */
        const signUpResponse = await signUpUser(username, email, password);
    
        if (signUpResponse instanceof Response) {
            return signUpResponse;
        }

        /* Sign in user & get token */
        const signInResponse = await signInUser(username, password);
    
        // If a response is returned, return the response
        if(signInResponse instanceof Response){
            return signInResponse;
        }
    
        // Return token
        if(request.url.includes("/signup")){
            return new Response(JSON.stringify(signInResponse), { status: 201 });
        }
        return new Response(JSON.stringify(signInResponse), { status: 200 });
    }catch(e){
        console.error("Error in sign-up route:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
