import {
   FormControl,
   FormHelperText,
   InputLabel,
   MenuItem,
   Select as MuiSelect,
} from '@mui/material'
import {
   useController,
   type Control,
   type FieldValues,
   type Path,
   type RegisterOptions,
} from 'react-hook-form'

type SelectOption = {
   label: string
   value: string | number
}

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>
   name: Path<T>
   rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsDate' | 'setValueAs' | 'disabled'>
   label?: string
   options: SelectOption[]
   placeholder?: string
   compact?: boolean
}

const RHFSelect = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   label,
   options,
   placeholder = 'Select an option...',
   compact = false,
}: Props<T>) => {
   const { field, fieldState } = useController({ control, name, rules })
   const labelId = `${String(name)}-label`

   return (
      <FormControl error={!!fieldState.error} size="small" variant="standard" fullWidth>
         {label && <InputLabel id={labelId} required={!!rules?.required}>{label}</InputLabel>}
         <MuiSelect
            {...field}
            labelId={labelId}
            value={field.value ?? ''}
            displayEmpty
            sx={compact ? { fontSize: '0.75rem' } : undefined}
            renderValue={(value) => {
               if (!value) return <span style={{ color: '#94a3b8' }}>{placeholder}</span>
               return options.find((option) => option.value === value)?.label ?? String(value)
            }}
         >
            <MenuItem value="" disabled>{placeholder}</MenuItem>
            {options.map((option) => (
               <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
         </MuiSelect>
         {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
      </FormControl>
   )
}

export default RHFSelect
