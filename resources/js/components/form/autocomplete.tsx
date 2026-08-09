import { Autocomplete, TextField } from '@mui/material'
import {
   useController,
   type Control,
   type FieldValues,
   type Path,
   type RegisterOptions,
} from 'react-hook-form'

type AutocompleteOption = {
   label: string
   value: string
}

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>
   name: Path<T>
   rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsDate' | 'setValueAs' | 'disabled'>
   label: string
   options: AutocompleteOption[]
   placeholder?: string
}

const RHFAutocomplete = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   label,
   options,
   placeholder = 'Search...',
}: Props<T>) => {
   const { field, fieldState } = useController({ control, name, rules })
   const value = options.find((option) => option.value === field.value) ?? null

   return (
      <Autocomplete
         options={options}
         value={value}
         onChange={(_, option) => field.onChange(option?.value ?? '')}
         getOptionLabel={(option) => option.label}
         isOptionEqualToValue={(option, selected) => option.value === selected.value}
         noOptionsText="No results found."
         renderInput={(params) => (
            <TextField
               {...params}
               label={label}
               placeholder={placeholder}
               required={!!rules?.required}
               error={!!fieldState.error}
               helperText={fieldState.error?.message}
            />
         )}
      />
   )
}

export default RHFAutocomplete
