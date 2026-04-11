import { createUser, getFullUserObject, getUserWithoutPassword } from "../db/user_queries";
import { createToken } from "../utils/auth";

export type SignUpUserSuccess = {
    userId: string;
    username: string;
};

export type SignInUserSuccess = {
    access_token: string;
}

export const signUpUser = async (
    username: string,
    email: string,
    password: string,
): Promise<SignUpUserSuccess | Response> => {
    const existingUser = await getUserWithoutPassword(username, email);
    if(existingUser){
        const error = existingUser.username === username ? "Username already exists" : "Email already exists";
        return new Response(JSON.stringify({ error }), { status: 400 });
    }

    const user = await createUser(username, email, password);
    
    if(!user){
        return new Response(JSON.stringify({ error: "Failed to create user" }), { status: 500 });
    }

    return user;
}

export const signInUser = async (usernameOrEmail: string, password: string) : Promise<SignInUserSuccess | Response> => {
    const user = await getFullUserObject(usernameOrEmail);
    
    if(!user){
        return new Response(JSON.stringify({ error: "Invalid username/email" }), { status: 400 });
    }

    const isValidPassword = user.password === password; /* TBD: Add hashing */

    if(!isValidPassword){
        return new Response(JSON.stringify({ error: "Invalid password" }), { status: 400 });
    }

    const access_token = createToken({ userId: user.id, username: user.username });
    
    return { access_token };
}