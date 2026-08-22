import { Button as MuiButton, IconButton, type ButtonProps as MuiButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'gradient' | 'destructive' | 'link'
export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

type Props = Omit<MuiButtonProps, 'color' | 'size' | 'variant'> & {
   children?: ReactNode
   variant?: ButtonVariant
   size?: ButtonSize
}

const variantProps: Record<ButtonVariant, Pick<MuiButtonProps, 'variant' | 'color'>> = {
  default: { variant: 'contained', color: 'primary' },
  outline: { variant: 'outlined', color: 'inherit' },
  secondary: { variant: 'contained', color: 'secondary' },
  ghost: { variant: 'text', color: 'inherit' },
  gradient: { variant: 'contained', color: 'primary' },
  destructive: { variant: 'outlined', color: 'error' },
  link: { variant: 'text', color: 'primary' },
}

const sizeSx: Record<ButtonSize, object> = {
  default: { minHeight: 36, px: 1.5 },
  xs: { minHeight: 24, px: 1.25, fontSize: '0.75rem' },
  sm: { minHeight: 32, px: 1.5 },
  lg: { minHeight: 40, px: 2 },
  icon: { minWidth: 36, width: 36, height: 36, px: 0 },
  'icon-xs': { minWidth: 24, width: 24, height: 24, px: 0 },
  'icon-sm': { minWidth: 32, width: 32, height: 32, px: 0 },
  'icon-lg': { minWidth: 40, width: 40, height: 40, px: 0 },
}

const Button = ({ variant = 'default', size = 'default', sx, children, ...props }: Props) => {
  const mapped = variantProps[variant]
  const isIcon = size.startsWith('icon')

  if (isIcon) {
    return (
      <IconButton
        {...props}
        color={mapped.color}
        sx={{ ...sizeSx[size], ...(variant === 'gradient' ? { background: 'linear-gradient(135deg, #5a8f5a, #3d633d)', color: '#fff' } : {}), ...sx }}
      >
        {children}
      </IconButton>
    )
  }

  return (
    <MuiButton
      {...props}
      {...mapped}
      sx={{
        ...sizeSx[size],
        ...(variant === 'gradient' ? { background: 'linear-gradient(135deg, #5a8f5a, #3d633d)', color: '#fff' } : {}),
        ...(variant === 'link' ? { textDecoration: 'underline', textUnderlineOffset: 4 } : {}),
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  )
}

export { Button }
