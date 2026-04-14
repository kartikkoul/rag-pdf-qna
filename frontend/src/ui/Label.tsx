import React from 'react'

interface Label{
    htmlFor: string;
    className?: string;
    text: string;
}


const Label = ({htmlFor, className, text}: Label) => {  return (
    <label htmlFor={htmlFor} className={`text-sm text-purple-300 tracking-wider ${className ?? ""}`}>{text}</label>
  )
}
export default Label