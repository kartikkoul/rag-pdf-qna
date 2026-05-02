import { GoogleOAuthBodySchema } from "@/src/schemas/user_schemas";
import { signInWithGoogleAccessToken } from "@/src/services/authServices";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = GoogleOAuthBodySchema.safeParse(body);
        if (!parsed.success) {
            return new Response(
                JSON.stringify({
                    error: {
                        type: "validation_error",
                        message: parsed.error.issues,
                    },
                }),
                { status: 400 },
            );
        }

        const signInResponse = await signInWithGoogleAccessToken(parsed.data.access_token);

        if (signInResponse instanceof Response) {
            return signInResponse;
        }

        return new Response(JSON.stringify(signInResponse), { status: 200 });
    } catch (error) {
        console.error("Error in Google OAuth route:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
