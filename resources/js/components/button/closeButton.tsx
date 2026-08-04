import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { type ButtonHTMLAttributes } from 'react'

type CloseButtonProps = {
    'aria-label'?: string
    size?: 'sm' | 'md' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>

const base =
    'cursor-pointer inline-flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-25 disabled:pointer-events-none transition duration-150 ease-in-out'

const sizeMap = {
   sm: 'p-1 [&_svg]:size-4',
   md: 'p-1.5 [&_svg]:size-5',
   lg: 'p-2 [&_svg]:size-6',
}

export default function CloseButton({
   'aria-label': ariaLabel = 'Close',
   size = 'md',
   className = '',
   ...props
}: CloseButtonProps) {
   return (
      <button
         {...props}
         aria-label={ariaLabel}
         className={cn(base, sizeMap[size], className)}
      >
         <X size={16} />
      </button>
   )
}
