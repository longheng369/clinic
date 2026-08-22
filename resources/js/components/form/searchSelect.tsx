import { useState, useEffect, useRef } from 'react'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form'

type SelectOption = {
   value: string | number
   label: string
}

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>
   name: Path<T>
   rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsDate' | 'setValueAs' | 'disabled'>
   label: string
   options?: SelectOption[]
   apiUrl?: string
   initialOption?: SelectOption
   placeholder?: string
}

const SearchSelect = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options = [],
  apiUrl,
  initialOption,
  placeholder = 'Search...',
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules })
  const [query, setQuery] = useState('')
  const [apiOptions, setApiOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isApiMode = Boolean(apiUrl)

  useEffect(() => {
    if (!apiUrl || !query) return

    debounceRef.current = setTimeout(() => {
      setIsLoading(true)
      fetch(`${apiUrl}?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data: { id: string | number; name: string }[]) => {
          setApiOptions(data.map((item) => ({ value: item.id, label: item.name })))
        })
        .finally(() => setIsLoading(false))
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query, apiUrl])

  const displayOptions = isApiMode && initialOption && !apiOptions.some((option) => option.value === initialOption.value)
    ? [initialOption, ...apiOptions]
    : isApiMode
      ? apiOptions
      : query === ''
        ? options
        : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
  const selected = displayOptions.find((option) => option.value === field.value) ?? null

  return (
    <Autocomplete
      options={displayOptions}
      value={selected}
      inputValue={selected ? selected.label : query}
      loading={isLoading}
      onInputChange={(_, value, reason) => {
        if (reason === 'clear') {
          setQuery('')
          field.onChange(null)
          return
        }
        setQuery(value)
      }}
      onChange={(_, value) => field.onChange(value?.value ?? null)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={isLoading ? 'Searching...' : 'No results found'}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={!!rules?.required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={{
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            inputLabel: params.slotProps.inputLabel,
            htmlInput: params.slotProps.htmlInput,
          }}
        />
      )}
    />
  )
}

export default SearchSelect
