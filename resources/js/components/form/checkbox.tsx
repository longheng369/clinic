import React from 'react'

type CheckboxProps = {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  className?: string
}

const cn = (...classes: (string | false |undefined | null)[]) =>
  classes.filter(Boolean).join(' ')

const Checkbox = ({
  checked,
  disabled = false,
  onChange,
  className = '',
}: CheckboxProps) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange()}
            aria-checked={checked}
            role="checkbox"
            className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
                checked
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-300 bg-white hover:border-primary-500',
                disabled &&
                'cursor-not-allowed opacity-50 hover:border-gray-300',
                className
            )}
        >
            <svg
                viewBox="0 0 24 24"
                className={cn(
                'h-3.5 w-3.5 transition-all duration-150',
                checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M5 13l4 4L19 7" />
            </svg>
        </button>
    )
}

export default Checkbox
