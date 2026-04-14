import { forwardRef } from "react";

interface InputProps{
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id?: string;
    className?: string;
    type?: "password" | "text";
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ value, onChange, placeholder, id, className,type }: InputProps, ref) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            id={id}
            className={`input bg-neutral-700 text-white rounded-xs px-3 py-2 outline-0
                ${className ?? ""}`}
            ref={ref}
        />
    )   
});

Input.displayName = "Input";

export default Input