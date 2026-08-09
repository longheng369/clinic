import { IconButton, type IconButtonProps } from '@mui/material'
import { X } from 'lucide-react'

type Props = Omit<IconButtonProps, 'size'> & {
   'aria-label'?: string
   size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
   sm: 'small',
   md: 'medium',
   lg: 'large',
} as const

const CloseButton = ({ 'aria-label': ariaLabel = 'Close', size = 'md', children, ...props }: Props) => (
   <IconButton {...props} aria-label={ariaLabel} size={sizeMap[size]}>
      {children ?? <X size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
   </IconButton>
)

export default CloseButton
