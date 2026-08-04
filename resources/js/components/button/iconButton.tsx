import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonColor = 'primary' | 'secondary' | 'error' | 'info'
type IconButtonSize = 'small' | 'medium' | 'large'

type IconButtonProps = {
    children: ReactNode
    'aria-label'?: string
    color?: IconButtonColor
    size?: IconButtonSize
} & ButtonHTMLAttributes<HTMLButtonElement>

const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ')

const base = 'cursor-pointer inline-flex items-center justify-center rounded-xl disabled:opacity-25 disabled:pointer-events-none'

const sizeMap: Record<IconButtonSize, string> = {
   small: 'p-1.5',
   medium: 'p-2',
   large: 'p-3',
}

const colorMap: Record<IconButtonColor, string> = {
   primary: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
   secondary: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
   error: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
   info: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
}

export default function IconButton({
   children,
   color = 'primary',
   size = 'medium',
   className = '',
   ...props
}: IconButtonProps) {
   return (
      <button
         {...props}
         className={cn(base, sizeMap[size], colorMap[color], className)}
      >
         {children}
      </button>
   )
}
