import type { InputHTMLAttributes } from 'react'

export default function InputError({ message, className = '', ...props }: { message?: string } & InputHTMLAttributes<HTMLParagraphElement>) {
   return message ? (
      <p
         {...props}
         className={'text-sm text-red-600 ' + className}
      >
         {message}
      </p>
   ) : null
}
