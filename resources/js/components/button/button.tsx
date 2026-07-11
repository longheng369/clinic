import { useState, useCallback, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'

type ButtonVariant = 'contained' | 'outlined' | 'text'
type ButtonColor = 'primary' | 'secondary' | 'error'
type ButtonSize = 'small' | 'medium' | 'large'

type ButtonProps = {
    variant?: ButtonVariant
    color?: ButtonColor
    size?: ButtonSize
    fullWidth?: boolean
    startIcon?: ReactNode
    endIcon?: ReactNode
    disableRipple?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

type Ripple = { id: number; x: number; y: number; diameter: number }

const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ')

const base =
    'relative overflow-hidden inline-flex items-center justify-center rounded-md font-semibold transition duration-150 ease-in-out disabled:opacity-25 disabled:pointer-events-none cursor-pointer'

const sizeMap: Record<ButtonSize, string> = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
}

const contained: Record<ButtonColor, string> = {
    primary:
        'border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary:
        'border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    error: 'border border-transparent bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 active:bg-red-700',
}

const outlined: Record<ButtonColor, string> = {
    primary:
        'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    secondary:
        'border border-gray-600 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    error: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
}

const text: Record<ButtonColor, string> = {
    primary: 'border border-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    secondary: 'border border-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    error: 'border border-transparent text-red-600 hover:bg-red-50 focus:ring-red-500',
}

const variantMap: Record<ButtonVariant, Record<ButtonColor, string>> = {
    contained,
    outlined,
    text,
}

const rippleColor: Record<ButtonVariant, Record<ButtonColor, string>> = {
    contained: {
        primary: 'bg-white/30',
        secondary: 'bg-white/30',
        error: 'bg-white/30',
    },
    outlined: {
        primary: 'bg-primary-600/30',
        secondary: 'bg-gray-600/30',
        error: 'bg-red-600/30',
    },
    text: {
        primary: 'bg-primary-600/30',
        secondary: 'bg-gray-600/30',
        error: 'bg-red-600/30',
    },
}

let nextRippleId = 0

export default function Button({
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    startIcon,
    endIcon,
    disableRipple = false,
    className = '',
    children,
    disabled,
    onClick,
    ...props
}: ButtonProps) {
    const [ripples, setRipples] = useState<Ripple[]>([])

    const handleClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            onClick?.(e)

            if (disableRipple) return

            const rect = e.currentTarget.getBoundingClientRect()
            const diameter = Math.max(rect.width, rect.height)
            const id = nextRippleId++
            setRipples((prev) => [...prev, { id, x: e.clientX - rect.left - diameter / 2, y: e.clientY - rect.top - diameter / 2, diameter }])
            setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
        },
        [onClick, disableRipple],
    )

    return (
        <button
            {...props}
            disabled={disabled}
            onClick={handleClick}
            className={cn(base, sizeMap[size], variantMap[variant][color], fullWidth && 'w-full', className)}
        >
            {ripples.map((r) => (
                <span
                    key={r.id}
                    className={cn(
                        'pointer-events-none absolute animate-ripple rounded-full',
                        rippleColor[variant][color],
                    )}
                    style={{ left: r.x, top: r.y, width: r.diameter, height: r.diameter }}
                />
            ))}
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    )
}
