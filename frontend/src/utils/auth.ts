import jwt, { SignOptions } from "jsonwebtoken";
import { ENV_VARS } from "../env_vars";

type UserType = {
    userId: string,
    username: string
}

/* Create jwt token */
export function createToken(
    user: UserType,
    expiresIn: SignOptions["expiresIn"] = "24h",
): string {
    const token = jwt.sign(user, ENV_VARS.JWT_SECRET as string, { expiresIn: expiresIn, algorithm: "HS256" });
    return token
}

/* Decode jwt token */
export function decodeToken(token: string): UserType | undefined {
    try {
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET as string) as UserType;
        return decoded;
    } catch (e) {
        console.log("Error:: ", e);
        new Error("Invalid token");
    }
}