"use client";

import FormCard from "@/src/ui/FormCard";
import Input from "@/src/ui/Input";
import Label from "@/src/ui/Label";
import AnimatedPrimaryButton from "@/src/ui/PrimaryButton";
import Link from "next/link";
import { useRef, useState } from "react";
import { signUpUser } from "@/src/utils/apiFunctions/authAPI";
import { useRouter } from "next/navigation";
import { setAuthTokenCookie } from "@/src/utils/authCookie";

export default function SignUp() {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      username: usernameEl,
      email: emailEl,
      password: passwordEl,
    } = inputRefs.current;
    if (!usernameEl?.value.trim() || !emailEl?.value.trim() || !passwordEl?.value.trim()) {
      setErrors(["One or more inputs are missing."]);
      return;
    }

    setIsLoading(true);
    const res = await signUpUser({
      username: usernameEl?.value.trim() || "",
      email: emailEl?.value.trim() || "",
      password: passwordEl?.value.trim() || "",
    });

    if (res.access_token) {
      setAuthTokenCookie(res.access_token);
      router.replace("/");
    } else {
      setIsLoading(false);
      setErrors(res.error.errors);
    }
  };

  const inputs: Array<{
    id: string;
    placeholder: string;
    type: "password" | "text" | "email";
    label: string;
  }> = [
    {
      id: "email",
      placeholder: "access@myknowledge.sys",
      type: "email",
      label: "EMAIL",
    },
    {
      id: "username",
      placeholder: "ghost_operator_01",
      type: "text",
      label: "USERNAME",
    },
    {
      id: "password",
      placeholder: "••••••••••••••",
      type: "password",
      label: "PASSWORD",
    },
  ];

  return (
    <div className="w-full md:w-2/5 flex items-center justify-center">
      <FormCard className="w-3/4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 w-full"
          autoComplete="off"
        >
          {inputs.map((input) => (
            <div key={input.id} className="flex flex-col gap-1">
              <Label htmlFor={input.id} text={input.label} />
              <Input
                id={input.id}
                placeholder={input.placeholder}
                type={input.type}
                ref={(el) => {
                  inputRefs.current[input.id] = el;
                }}
              />
            </div>
          ))}

          {errors?.length > 0 && (
            <div className="rounded-sm border border-red-500/30 bg-red-500/10 py-2 px-2 text-red-300 text-sm">
              <div className="flex gap-1">
                <p>{errors[0]}</p>
              </div>
            </div>
          )}

          <AnimatedPrimaryButton type="submit" text="Create Account" loading={isLoading} disabled={isLoading} />
        </form>
        <div className="extraActions mt-10">
          <div className="extrainfo flex justify-center items-center">
            <hr className="w-full text-[#ffffff27]" />
            <span className="mx-2 text-xs text-neutral-500 font-semibold tracking-wider text-nowrap">
              ALREADY A USER?
            </span>
            <hr className="w-full text-[#ffffff27]" />
          </div>
          <p className="text-center text-sm tracking-wide mt-8">
            <Link href={"/auth/signin"}>
              <span className="underline underline-offset-2">Sign In</span>
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  );
}
