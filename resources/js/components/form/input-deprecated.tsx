import { TextField } from '@mui/material'
import {
   useController,
   type Control,
   type FieldValues,
   type Path,
   type RegisterOptions,
} from 'react-hook-form'

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>
   name: Path<T>
   rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
   label?: string
   compact?: boolean
   /** Native attributes applied to the underlying input element. */
   inputProps?: React.InputHTMLAttributes<HTMLInputElement>
} & Omit<React.ComponentProps<typeof TextField>, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText' | 'inputProps'>

const Input = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   label,
   compact = false,
   inputProps,
   slotProps,
   ...rest
}: Props<T>) => {
   const { field, fieldState } = useController({ control, name, rules })

   return (
      <TextField
         {...rest}
         slotProps={{ ...slotProps, htmlInput: { ...slotProps?.htmlInput, ...inputProps } }}
         {...field}
         label={label}
         size={compact ? 'small' : 'small'}
         variant="standard"
         required={!!rules?.required}
         error={!!fieldState.error}
         helperText={fieldState.error?.message}
         fullWidth
      />
   )
}

export default Input
