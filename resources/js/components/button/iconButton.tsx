import { IconButton as MuiIconButton, type IconButtonProps as MuiIconButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

type Props = Omit<MuiIconButtonProps, 'color'> & {
   children: ReactNode
   color?: 'primary' | 'secondary' | 'error' | 'info'
}

const IconButton = ({ children, ...props }: Props) => (
  <MuiIconButton {...props}>
    {children}
  </MuiIconButton>
)

export default IconButton
