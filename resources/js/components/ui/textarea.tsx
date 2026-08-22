import { TextField, type TextFieldProps } from '@mui/material'

const Textarea = ({ minRows = 3, multiline = true, ...props }: TextFieldProps) => (
  <TextField
    {...props}
    multiline={multiline}
    minRows={minRows}
  />
)

export { Textarea }
