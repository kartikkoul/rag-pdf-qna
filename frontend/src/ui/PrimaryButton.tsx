import React, { JSX } from 'react'

interface AnimatedPrimaryButton{
    icon?: JSX.Element,
    text: string,
    type: "button" | "submit"
    className?: string,
    loading?: boolean,
    disabled?: boolean
}

const AnimatedPrimaryButton = ({icon, text, type, className, loading, disabled} : AnimatedPrimaryButton) => {
  return (
    <button type={type} className={` group
                        relative
                        overflow-hidden
                        text-black
                        py-2 h-10
                        flex justify-center items-center gap-2
                        tracking-wider font-semibold cursor-pointer

                        bg-[linear-gradient(90deg,#d8b4fe,#9333ea,#d8b4fe)]
                        bg-size-[200%_100%]
                        bg-left

                        transition-all duration-500 ease-in-out
                        hover:bg-right
                        hover:scale-[1.02]

                        ${className ?? ""}
                        `}
                        
                        
                        disabled={disabled}>
                          {loading && (
                            <div className="flex items-end gap-[2px]">
                              <span className="w-1 h-2 bg-purple-800 animate-[wave_1s_infinite]" />
                              <span className="w-1 h-3 bg-purple-800 animate-[wave_1s_infinite_0.1s]" />
                              <span className="w-1 h-2 bg-purple-800 animate-[wave_1s_infinite_0.2s]" />
                            </div>
                          )}

                          {!loading && (<>{text} {icon && icon}</>)}</button>
  )
}

export default AnimatedPrimaryButton