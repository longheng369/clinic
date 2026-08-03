import {
   Checkbox as MuiCheckbox,
   FormControl,
   FormControlLabel,
   FormHelperText,
   type CheckboxProps as MuiCheckboxProps,
} from '@mui/material'
import {
   useController,
   type Control,
   type FieldValues,
   type Path,
   type RegisterOptions,
} from 'react-hook-form'
import type { ReactNode } from 'react'

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>
   name: Path<T>
   rules?: Omit<
      RegisterOptions<T, Path<T>>,
      'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
   >
   label?: ReactNode
   ariaLabel?: string
   disabled?: boolean
   value?: string | number
   exclusive?: boolean
   exclusiveValue?: string | number
   onCheckedChange?: (checked: boolean) => void
} & Omit<
   MuiCheckboxProps,
   'checked' | 'defaultChecked' | 'disabled' | 'name' | 'onChange' | 'required' | 'slotProps' | 'value'
>

const Checkbox = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   label,
   ariaLabel,
   disabled = false,
   value,
   exclusive = false,
   exclusiveValue,
   onCheckedChange,
   ...rest
}: Props<T>) => {
   const { field, fieldState: { error } } = useController({ control, name, rules })
   const helperTextId = `${String(name)}-helper-text`
   const required = !!rules?.required
   const fieldValues: Array<string | number> | null = value !== undefined
      ? Array.isArray(field.value)
         ? field.value as Array<string | number>
         : []
      : null
   const checked = fieldValues
      ? value !== undefined && fieldValues.includes(value)
      : field.value === true

   const handleChange = (nextChecked: boolean) => {
      if (fieldValues && value !== undefined) {
         const nextValues = nextChecked
            ? exclusive
               ? [value]
               : [...fieldValues.filter((fieldValue) => fieldValue !== exclusiveValue && fieldValue !== value), value]
            : fieldValues.filter((fieldValue) => fieldValue !== value)

         field.onChange(nextValues)
      } else {
         field.onChange(nextChecked)
      }

      onCheckedChange?.(nextChecked)
   }

   const checkbox = (
      <MuiCheckbox
         {...rest}
         checked={checked}
         disabled={disabled}
         name={field.name}
         onChange={(_, nextChecked) => handleChange(nextChecked)}
         onBlur={field.onBlur}
         required={required}
         value={value}
         slotProps={{
            input: {
               ref: field.ref,
               'aria-label': label ? undefined : ariaLabel,
               'aria-describedby': error ? helperTextId : undefined,
            },
         }}
      />
   )

   return (
      <FormControl error={!!error} required={required} disabled={disabled}>
         {label ? (
            <FormControlLabel
               control={checkbox}
               disabled={disabled}
               label={label}
               required={required}
            />
         ) : checkbox}
         {error?.message && <FormHelperText id={helperTextId}>{error.message}</FormHelperText>}
      </FormControl>
   )
}

export default Checkbox
