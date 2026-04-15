import { ReactNode } from 'react'

interface FormCardProps{
  className?:string
}


const FormCard = ({children, className }: {children:ReactNode} & FormCardProps) => {
  return (
        <div className={`bg-neutral-900 rounded-md border border-white/10 p-10 ${className ?? ""}`}>
            <div className="content w-full flex flex-col">
                {children}
            </div>
        </div>
  )
}

export default FormCard