import Button from '@/components/button/button'
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
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: <AlertTriangle size={24} />,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  info: {
    icon: <AlertCircle size={24} />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
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
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button color={buttonColor[variant]} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}

export default Alert
