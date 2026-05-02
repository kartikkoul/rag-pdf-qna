import { z } from "zod";

export const UserSignUpSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.email(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/, "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters"),
})

export const UserSignInSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").or(z.string().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Must be a valid email address")),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/, "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters"),
})

export const GoogleOAuthBodySchema = z.object({
    access_token: z.string().min(1),
})