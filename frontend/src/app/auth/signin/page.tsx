"use client"

import FormCard from "@/src/ui/FormCard"
import GoogleContinueButton from "@/src/ui/GoogleContinueButton"
import Input from "@/src/ui/Input"
import Label from "@/src/ui/Label"
import AnimatedPrimaryButton from "@/src/ui/PrimaryButton";
import { signInUser } from "@/src/utils/apiFunctions/authAPI";
import { setAuthTokenCookie } from "@/src/utils/authCookie";
import Link from "next/link";
import { useRouter, useSearchParams} from "next/navigation";
import React, { useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

export default function SignIn() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const params = useSearchParams();
    const router = useRouter();

    const redirectPath = params.get("redirect");
    const safeRedirectPath = redirectPath?.startsWith("/") ? redirectPath : null;
    const redirectAuthMessage =
        params.get("error") === "auth_error" ? "You need to sign in" : null;

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { username: usernameEl, password: passwordEl } = inputRefs.current;
        if (!usernameEl?.value.trim() || !passwordEl?.value.trim()) {
            setErrors(["One or more inputs are missing."]);
            return;
        }

        setIsLoading(true);
        const res = await signInUser({
            username: usernameEl?.value.trim() || "",
            password: passwordEl?.value.trim() || ""
        });


        if (res.access_token) {
            setIsLoading(false);
            setAuthTokenCookie(res.access_token);
            if(safeRedirectPath){
                router.replace(safeRedirectPath);
                return;
            }
            
            router.replace("/");
        } else {
            setIsLoading(false);
            setErrors(res.error.errors);
        }
    }

    const inputs: Array<{
        id: string
        placeholder: string
        type: "password" | "text"
        label: string
    }> = [
            {
                id: "username",
                placeholder: "Username or Email",
                type: "text",
                label: "IDENTITY ACCESS"
            },
            {
                id: "password",
                placeholder: "Password",
                type: "password",
                label: "SECRET PHRASE"
            }
        ]

    return (
        <div className="w-full md:w-2/5 lg:w-5/12 flex items-center justify-center">
            <FormCard className="w-full max-w-[460px] p-6 md:p-8 shadow-[0px_0px_60px_-28px_rgba(168,85,247,0.8)]">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Sign In</h2>
                    <p className="text-sm text-neutral-400 mt-1">Access your private document assistant.</p>
                </div>

                <form  onSubmit={handleSubmit} className="flex flex-col gap-8 w-full" autoComplete="off">
                    {inputs.map((input) => (
                        <div key={input.id} className="flex flex-col gap-1">
                            <Label htmlFor={input.id} text={input.label} />
                            <Input id={input.id} placeholder={input.placeholder} type={input.type} ref={el => {
                                inputRefs.current[input.id] = el
                            }} />
                        </div>
                    ))}
                    {(errors?.length > 0 || redirectAuthMessage) && (
                        <div className="rounded-md border border-red-500/30 bg-red-500/10 py-2 px-3 text-red-300 text-sm">
                            <div className="flex gap-1 justify-center md:justify-start">
                                    <p>
                                        {errors[0] ?? redirectAuthMessage}
                                    </p>
                                </div>
                        </div>
                    )}

                    <AnimatedPrimaryButton type="submit" text="SIGN IN" icon={<FaArrowRight />} loading={isLoading} disabled={isLoading} className="rounded-sm" />

                    <div className="extrainfo flex justify-center items-center">
                        <hr className="w-full border-[#ffffff27]" />
                        <span className="mx-2 text-xs text-neutral-500 font-semibold tracking-wider text-nowrap">OR</span>
                        <hr className="w-full border-[#ffffff27]" />
                    </div>

                    <GoogleContinueButton redirectPath={safeRedirectPath} />
                </form>
                <div className="extraActions mt-8">
                    <div className="extrainfo flex justify-center items-center">
                        <hr className="w-full text-[#ffffff27]" />
                        <span className="mx-2 text-xs text-neutral-500 font-semibold tracking-wider text-nowrap">NEW USER?</span>
                        <hr className="w-full text-[#ffffff27]" />
                    </div>
                    <p className="text-center text-sm tracking-wide mt-6"><Link href={"/auth/signup"} className="text-neutral-200 hover:text-purple-300 transition-colors"><span className="underline underline-offset-2">Create an account</span></Link></p>
                </div>
            </FormCard>
        </div>
    )
}
