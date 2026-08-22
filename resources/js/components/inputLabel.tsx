import { FormLabel, type FormLabelProps } from '@mui/material'

type Props = FormLabelProps & {
   value?: string
}

const InputLabel = ({ value, children, ...props }: Props) => (
  <FormLabel {...props}>
    {value ?? children}
  </FormLabel>
)

export default InputLabel
