import {
    createUser,
    createUserFromGoogle,
    getFullUserObject,
    getUserByEmail,
    getUserByGoogleSub,
    getUserWithoutPassword,
    linkGoogleSub,
} from "../db/user_queries";
import { createToken } from "../utils/auth";

type GoogleUserInfo = {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
};

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return res.json() as Promise<GoogleUserInfo>;
}

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
        return new Response(JSON.stringify({ message: error }), { status: 400 });
    }

    const user = await createUser(username, email, password);
    
    if(!user){
        return new Response(JSON.stringify({ message: "Failed to create user" }), { status: 500 });
    }

    return user;
}

export const signInUser = async (usernameOrEmail: string, password: string) : Promise<SignInUserSuccess | Response> => {
    const user = await getFullUserObject(usernameOrEmail);
    
    if(!user){
        return new Response(JSON.stringify({ message: "Invalid username/email" }), { status: 400 });
    }

    const isValidPassword = user.password === password; /* TBD: Add hashing */

    if(!isValidPassword){
        return new Response(JSON.stringify({ message: "Invalid password" }), { status: 400 });
    }

    const access_token = createToken({ userId: user.id, username: user.username });
    
    return { access_token };
}

export const signInWithGoogleAccessToken = async (
    accessToken: string,
): Promise<SignInUserSuccess | Response> => {
    const profile = await fetchGoogleUserInfo(accessToken);
    if (!profile?.sub || !profile.email) {
        return new Response(JSON.stringify({ message: "Invalid Google session" }), { status: 401 });
    }
    if (!profile.email_verified) {
        return new Response(JSON.stringify({ message: "Google email is not verified" }), {
            status: 403,
        });
    }

    const existingBySub = await getUserByGoogleSub(profile.sub);
    if (existingBySub) {
        const access_token = createToken({
            userId: existingBySub.id,
            username: existingBySub.username,
        });
        return { access_token };
    }

    const existingByEmail = await getUserByEmail(profile.email);
    if (existingByEmail) {
        if (existingByEmail.googleSub && existingByEmail.googleSub !== profile.sub) {
            return new Response(JSON.stringify({ message: "Account conflict" }), { status: 409 });
        }
        if (!existingByEmail.googleSub) {
            await linkGoogleSub(
                existingByEmail.id,
                existingByEmail.username,
                profile.sub,
            );
        }
        const access_token = createToken({
            userId: existingByEmail.id,
            username: existingByEmail.username,
        });
        return { access_token };
    }

    const created = await createUserFromGoogle(profile.email, profile.name, profile.sub);
    const access_token = createToken({
        userId: created.userId,
        username: created.username,
    });
    return { access_token };
};