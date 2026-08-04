import type { LabelHTMLAttributes } from 'react'

export default function InputLabel({
   value,
   className = '',
   children,
   ...props
}: { value?: string } & LabelHTMLAttributes<HTMLLabelElement>) {
   return (
      <label
         {...props}
         className={
            `block text-sm font-medium text-gray-700 ` +
                className
         }
      >
         {value ? value : children}
      </label>
   )
}
