import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, type FormGroupProps } from '@mui/material'
import { IOption } from '@/interfaces/IOption'
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
   rules?: Omit<
      RegisterOptions<T, Path<T>>,
      'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
   >
   options: IOption<string | number>[]
   label?: string
   disabled?: boolean
} & Omit<FormGroupProps, 'children' | 'onChange'>

const CheckboxGroup = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   options,
   label,
   disabled = false,
   ...formGroupProps
}: Props<T>) => {
   const { field, fieldState: { error } } = useController({ control, name, rules })
   const selectedValues: Array<string | number> = Array.isArray(field.value)
      ? field.value as Array<string | number>
      : []
   const labelId = `${String(name)}-label`
   const helperTextId = `${String(name)}-helper-text`

   const handleChange = (optionValue: string | number, checked: boolean) => {
      if (checked) {
         if (!selectedValues.includes(optionValue)) {
            field.onChange([...selectedValues, optionValue])
         }
         return
      }

      field.onChange(selectedValues.filter((value) => value !== optionValue))
   }

   return (
      <FormControl component="fieldset" fullWidth error={!!error} required={!!rules?.required} disabled={disabled}>
         {label && <FormLabel id={labelId} component="legend">{label}</FormLabel>}
         <FormGroup
            {...formGroupProps}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={error ? helperTextId : undefined}
         >
            {options.map((option, index) => (
               <FormControlLabel
                  key={option.value}
                  control={
                     <Checkbox
                        checked={selectedValues.includes(option.value)}
                        name={field.name}
                        value={option.value}
                        onChange={(event) => handleChange(option.value, event.target.checked)}
                        onBlur={field.onBlur}
                        slotProps={{ input: { ref: index === 0 ? field.ref : undefined } }}
                     />
                  }
                  label={option.label}
               />
            ))}
         </FormGroup>
         {error?.message && <FormHelperText id={helperTextId}>{error.message}</FormHelperText>}
      </FormControl>
   )
}

export default CheckboxGroup
