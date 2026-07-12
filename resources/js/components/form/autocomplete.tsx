import { Autocomplete } from '@base-ui/react'
import React, { useState } from 'react'
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

type AutocompleteProps<T extends FieldValues = FieldValues> = {
  control: Control<T>
  name: Path<T>
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >
  label: string
  options: AutocompleteOption[]
  placeholder?: string
}

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ')

const RHFAutocomplete = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options,
  placeholder = 'Search...',
}: AutocompleteProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  })

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    () => options.find((opt) => opt.value === field.value)?.label ?? '',
  )

  const inputBase =
    'w-full rounded-lg border px-3 py-2.5 outline-none text-sm focus:ring-2'
  const defaultStyle =
    'border-gray-300 focus:ring-primary-500/20 focus:border-primary-500'
  const errorStyle =
    'border-red-500 focus:border-red-500 focus:ring-red-500/20'

  return (
    <div className="flex flex-col">
      <label
        className={cn(
          'block text-sm font-medium text-gray-700 mb-1',
          error && 'text-red-500',
        )}
      >
        {label}{' '}
        {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <Autocomplete.Root
        open={open}
        onOpenChange={setOpen}
        items={options}
        value={inputValue}
        onValueChange={setInputValue}
        itemToStringValue={(item: AutocompleteOption) => item.label}
      >
        <Autocomplete.Input
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 200)
          }}
          className={cn(inputBase, error ? errorStyle : defaultStyle)}
        />
        <Autocomplete.Portal>
          <Autocomplete.Positioner
            sideOffset={4}
            className="z-50 w-(--anchor-width)"
          >
            <Autocomplete.Popup className="origin-top rounded-md bg-white py-1 shadow-lg border border-gray-300 data-open:animate-in data-open:fade-in data-open:zoom-in-95">
              <Autocomplete.Empty>
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results found.
                </div>
              </Autocomplete.Empty>
              <Autocomplete.List className="max-h-60 overflow-auto">
                {(item: AutocompleteOption) => (
                  <Autocomplete.Item
                    key={item.value}
                    value={item}
                    onClick={() => {
                      field.onChange(item.value)
                      setInputValue(item.label)
                      setOpen(false)
                    }}
                    className="cursor-pointer px-3 py-2 text-sm transition-colors duration-150 data-highlighted:bg-primary-50 data-highlighted:text-primary"
                  >
                    {item.label}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      {error && (
        <span className="mt-1 text-sm text-red-500">{error.message}</span>
      )}
    </div>
  )
}

export default RHFAutocomplete
