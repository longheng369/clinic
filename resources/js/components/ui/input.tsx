import { OutlinedInput, type OutlinedInputProps } from '@mui/material'

const Input = ({ size = 'small', fullWidth = true, ...props }: OutlinedInputProps) => (
  <OutlinedInput
    {...props}
    size={size}
    fullWidth={fullWidth}
  />
)

export { Input }
