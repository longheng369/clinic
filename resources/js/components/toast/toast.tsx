import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  message: string
  description?: string
  variant: ToastVariant
  duration: number
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void
}

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ')

const variantStyles: Record<ToastVariant, { bg: string; border: string; iconBg: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'text-blue-500',
  },
}

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function Toast({ id, message, description, variant, duration, onClose }: ToastProps) {
  const styles = variantStyles[variant]
  const Icon = icons[variant]

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm rounded-lg border p-4 shadow-lg',
        styles.bg,
        styles.border,
        'animate-toast-slide-in',
      )}
      role="alert"
    >
      <div className="flex shrink-0 items-start pt-0.5">
        <Icon className={cn('h-5 w-5', styles.iconBg)} />
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="ml-3 shrink-0 inline-flex text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
