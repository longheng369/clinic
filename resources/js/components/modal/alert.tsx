import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle } from 'lucide-react'

type AlertVariant = 'danger' | 'warning' | 'info'

interface AlertProps {
  message: string
  description?: string
  variant?: AlertVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export type { AlertProps }

const variantStyles: Record<AlertVariant, { icon: React.ReactNode; iconBg: string; iconColor: string }> = {
  danger: {
    icon: <AlertTriangle size={24} />,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: <AlertTriangle size={24} />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  info: {
    icon: <AlertCircle size={24} />,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
}

const buttonColor: Record<AlertVariant, 'error' | 'primary'> = {
  danger: 'error',
  warning: 'primary',
  info: 'primary',
}

const Alert = ({
  message,
  description,
  variant = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}: AlertProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const style = variantStyles[variant]

  return (
    <div className="px-4 pb-6">
      <div className="flex items-start gap-3">
        <div className={`shrink-0 rounded-full p-2 ${style.iconBg} ${style.iconColor}`}>
          {style.icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}

export default Alert
