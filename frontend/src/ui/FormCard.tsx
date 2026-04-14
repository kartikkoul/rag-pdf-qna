import { ReactNode } from 'react'

interface FormCardProps{
  className?:string
}


const FormCard = ({children, className }: {children:ReactNode} & FormCardProps) => {
  return (
        <div className={`bg-neutral-900 rounded-md border border-white/10 ${className ?? ""}`}>
            <div className="content p-4 w-full flex">
                {children}
            </div>
        </div>
  )
}

export default FormCard