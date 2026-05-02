"use client";

import BASE_API_ROUTER from "@/src/utils/apiFunctions/axiosRouter";
import { setAuthTokenCookie } from "@/src/utils/authCookie";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

type GoogleContinueButtonProps = {
    className?: string;
    /** Internal path only (e.g. from ?redirect=). Invalid values are ignored. */
    redirectPath?: string | null;
};

export default function GoogleContinueButton({
    className = "",
    redirectPath,
}: GoogleContinueButtonProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const login = useGoogleLogin({
        flow: "implicit",
        scope: "openid email profile",
        onSuccess: async (tokenResponse) => {
            setBusy(true);
            setError(null);
            try {
                const res = await BASE_API_ROUTER.post("/auth/oauth/google", {
                    access_token: tokenResponse.access_token,
                });
                if (res.data?.access_token) {
                    setAuthTokenCookie(res.data.access_token);
                    if (redirectPath?.startsWith("/")) {
                        router.replace(redirectPath);
                    } else {
                        router.replace("/");
                    }
                }
            } catch {
                setError("Google sign-in failed. Try again.");
            } finally {
                setBusy(false);
            }
        },
        onError: () => {
            setError("Google sign-in was cancelled or failed.");
        },
    });

    return (
        <div className={`w-full flex flex-col gap-2 ${className}`}>
            <button
                type="button"
                disabled={busy}
                onClick={() => login()}
                className={`w-full flex items-center justify-center gap-2.5 h-10 rounded-sm border border-neutral-600 bg-neutral-900/50 text-neutral-100 text-sm font-semibold tracking-wide hover:border-purple-400/45 hover:bg-neutral-800/70 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Continue with Google"
            >
                <FcGoogle className="text-[22px] shrink-0" aria-hidden />
                {busy ? "Connecting…" : "Continue with Google"}
            </button>
            {error ? <p className="text-center text-sm text-red-300">{error}</p> : null}
        </div>
    );
}
