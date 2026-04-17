"use client"

import FormCard from "@/src/ui/FormCard"
import Input from "@/src/ui/Input"
import Label from "@/src/ui/Label"
import AnimatedPrimaryButton from "@/src/ui/PrimaryButton";
import { signInUser } from "@/src/utils/apiFunctions/authAPI";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useRef } from "react";
import { FaArrowRight } from "react-icons/fa6";

export default function SignIn() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {username: usernameEl, password: passwordEl} = inputRefs.current;
        if(!usernameEl?.value || !passwordEl?.value){
            console.error("One or more inputs are missing.");
            return;
        }
        
        const res = await signInUser({
            username: usernameEl?.value || "",
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
        <div className="w-2/5 flex items-center justify-center">
            <FormCard className="w-3/4">
                <form action="" onSubmit={handleSubmit} className="flex flex-col gap-8 w-full" autoComplete="off">
                    {inputs.map((input) => (
                        <div key={input.id} className="flex flex-col gap-1">
                            <Label htmlFor={input.id} text={input.label} />
                            <Input id={input.id} placeholder={input.placeholder} type={input.type} ref={el => {
                                inputRefs.current[input.id] = el
                            }} />
                        </div>
                    ))}
                    <AnimatedPrimaryButton type="submit" text="SIGN IN" icon={<FaArrowRight/>}/>
                </form>
                <div className="extraActions mt-10">
                    <div className="extrainfo flex justify-center items-center">
                        <hr className="w-full text-[#ffffff27]" />
                        <span className="mx-2 text-xs text-neutral-500 font-semibold tracking-wider text-nowrap">NEW USER?</span>
                        <hr className="w-full text-[#ffffff27]" />
                    </div>
                    <p className="text-center text-sm tracking-wide mt-8"><Link href={"/auth/signup"} ><span className="underline underline-offset-2">Create an account</span></Link></p>
                </div>
            </FormCard>
        </div>
    )
}