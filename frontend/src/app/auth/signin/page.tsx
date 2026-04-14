"use client"

import FormCard from "@/src/ui/FormCard"
import Input from "@/src/ui/Input"
import Label from "@/src/ui/Label"

export default function SignIn() {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const username = (document.getElementById("username") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value

        console.log("Username:", username)
        console.log("Password:", password)
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
                <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    {inputs.map((input) => (
                        <div key={input.id} className="flex flex-col gap-1">
                            <Label htmlFor={input.id} text={input.label} />
                            <Input id={input.id} placeholder={input.placeholder} type={input.type} />
                        </div>
                    ))}
                    <button type="submit" className="bg-primary text-white py-2 rounded">Sign In</button>
                </form>
            </FormCard>
        </div>
    )
}