import React, { JSX } from 'react'

interface AnimatedPrimaryButton{
    icon?: JSX.Element,
    text: string,
    type: "button" | "submit"
    className?: string,
}

const AnimatedPrimaryButton = ({icon, text, type, className} : AnimatedPrimaryButton) => {
  return (
    <button type={type} className={` group
                        relative
                        overflow-hidden
                        text-black
                        py-2 px-4
                        flex justify-center items-center gap-2
                        tracking-wider font-semibold cursor-pointer

                        bg-[linear-gradient(90deg,#d8b4fe,#9333ea,#d8b4fe)]
                        bg-size-[200%_100%]
                        bg-left

                        transition-all duration-500 ease-in-out
                        hover:bg-right
                        hover:scale-[1.02]

                        ${className ?? ""}
                        `}>{text} {icon && icon}</button>
  )
}

export default AnimatedPrimaryButton