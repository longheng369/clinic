import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material'

type Option<T> = {
   value: T
   label: string
}

type Props<T> = {
   options: Option<T>[]
   value?: T
   onChange?: (value: T) => void
   placeholder?: string
   searchPlaceholder?: string
   notFoundText?: string
}

const Autocomplete = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  notFoundText = 'No results found',
}: Props<T>) => {
  const selectedOption = options.find((option) => option.value === value) ?? null

  return (
    <MuiAutocomplete
      options={options}
      value={selectedOption}
      onChange={(_, option) => {
        if (option) onChange?.(option.value)
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.value === selected.value}
      noOptionsText={notFoundText}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={selectedOption ? placeholder : searchPlaceholder}
        />
      )}
    />
  )
}

export default Autocomplete
