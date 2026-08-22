import { Box, Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material'
import { AlertCircle, AlertTriangle } from 'lucide-react'

export type AlertVariant = 'danger' | 'warning' | 'info'

export interface AlertProps {
   message: string
   description?: string
   variant?: AlertVariant
   confirmLabel?: string
   cancelLabel?: string
   onConfirm: () => void
   onCancel?: () => void
   onClose: () => void
}

const severityMap = {
  danger: 'error',
  warning: 'warning',
  info: 'info',
} as const

const Alert = ({
  message,
  description,
  variant = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
}: AlertProps) => {
  const Icon = variant === 'info' ? AlertCircle : AlertTriangle

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <>
      <DialogContent sx={{ pt: 3 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexShrink: 0, p: 1, borderRadius: '50%', bgcolor: `${severityMap[variant]}.lighter` }}>
            <Icon size={24} color={variant === 'danger' ? '#dc2626' : variant === 'warning' ? '#d97706' : '#2563eb'} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{message}</Typography>
            {description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" color="inherit" onClick={handleCancel}>{cancelLabel}</Button>
        <Button variant="contained" color={severityMap[variant]} onClick={handleConfirm}>{confirmLabel}</Button>
      </DialogActions>
    </>
  )
}

export default Alert
