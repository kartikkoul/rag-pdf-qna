"use client"

import FormCard from "@/src/ui/FormCard"
import Input from "@/src/ui/Input"
import Label from "@/src/ui/Label"
import AnimatedPrimaryButton from "@/src/ui/PrimaryButton";
import Link from "next/link";
import { useRef } from "react";
import { signUpUser } from "@/src/utils/apiFunctions/authAPI"
import { redirect } from "next/navigation";

export default function SignUp() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {username: usernameEl, email: emailEl, password: passwordEl} = inputRefs.current;
        if(!usernameEl?.value || !emailEl?.value || !passwordEl?.value){
            console.error("One or more inputs are missing.");
            return;
        }
        
        const res = await signUpUser({
            username: usernameEl?.value || "",
            email: emailEl?.value || "",
            password: passwordEl?.value || ""
        });


        if(res.access_token){
            document.cookie = `authToken=${res.access_token}; path=/; max-age=86400; secure; samesite=strict`;
            redirect("/");
        }else{
            alert(res.errors);
        }
    }

    const inputs: Array<{
        id: string
        placeholder: string
        type: "password" | "text" | "email"
        label: string
    }> = [
            {
                id: "email",
                placeholder: "access@myknowledge.sys",
                type: "email",
                label: "EMAIL"
            },
            {
                id: "username",
                placeholder: "ghost_operator_01",
                type: "text",
                label: "USERNAME"
            },
            {
                id: "password",
                placeholder: "••••••••••••••",
                type: "password",
                label: "PASSWORD"
            }
        ]

    return (
        <div className="w-2/5 flex items-center justify-center">
            <FormCard className="w-3/4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full" autoComplete="off">
                    {inputs.map((input) => (
                        <div key={input.id} className="flex flex-col gap-1">
                            <Label htmlFor={input.id} text={input.label} />
                            <Input id={input.id} placeholder={input.placeholder} type={input.type} ref={(el) => {
                                inputRefs.current[input.id] = el
                            }} />
                        </div>
                    ))}
                    <AnimatedPrimaryButton type="submit" text="Create Account"/>
                </form>
                <div className="extraActions mt-10">
                    <div className="extrainfo flex justify-center items-center">
                        <hr className="w-full text-[#ffffff27]" />
                        <span className="mx-2 text-xs text-neutral-500 font-semibold tracking-wider text-nowrap">ALREADY A USER?</span>
                        <hr className="w-full text-[#ffffff27]" />
                    </div>
                    <p className="text-center text-sm tracking-wide mt-8"><Link href={"/auth/signin"} ><span className="underline underline-offset-2">Sign In</span></Link></p>
                </div>
            </FormCard>
        </div>
    )
}