import { useState, useEffect, useRef } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
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

type SearchSelectProps<T extends FieldValues = FieldValues> = {
  control: Control<T>
  name: Path<T>
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >
  label: string
  options?: SelectOption[]
  apiUrl?: string
  initialOption?: SelectOption
  placeholder?: string
}

const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ')

const SearchSelect = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options = [],
  apiUrl,
  initialOption,
  placeholder = 'Search...',
}: SearchSelectProps<T>) => {
  const { field, fieldState: { error } } = useController({
    control,
    name,
    rules,
  })

  const [query, setQuery] = useState('')
  const [apiOptions, setApiOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!apiUrl) return

    if (!query) return

    debounceRef.current = setTimeout(() => {
      setIsLoading(true)
      fetch(`${apiUrl}?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data: { id: string | number; name: string }[]) => {
          setApiOptions(data.map((item) => ({ value: item.id, label: item.name })))
        })
        .finally(() => setIsLoading(false))
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query, apiUrl])

  const isApiMode = !!apiUrl

  const displayOptions = isApiMode && initialOption && !apiOptions.some((o) => o.value === initialOption.value)
    ? [initialOption, ...apiOptions]
    : isApiMode
      ? apiOptions
      : query === ''
        ? options
        : options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))

  const selected = displayOptions.find((opt) => opt.value === field.value) ?? null

  const inputBase =
    'w-full rounded-lg border px-3 py-2.5 pr-10 outline-none text-sm focus:ring-2'
  const defaultStyle = 'border-gray-300 focus:ring-primary-500/20 focus:border-primary-500'
  const errorStyle = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'

  return (
    <div className="flex flex-col">
      <label className={cn('block text-sm font-medium text-gray-700 mb-1', error && 'text-red-500')}>
        {label} {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <Combobox
        value={selected}
        onChange={(val) => {
          field.onChange(val?.value ?? null)
        }}
        onClose={() => {
          setQuery('')
        }}
      >
        <div className="relative">
          <ComboboxInput
            className={cn(inputBase, error ? errorStyle : defaultStyle)}
            displayValue={(opt: SelectOption | null) => opt?.label ?? ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            {isLoading ? (
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          className="z-50 mt-1 max-h-60 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 ring-1 ring-black ring-opacity-5 empty:invisible"
        >
          {displayOptions.length === 0 && query !== '' ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {isLoading ? 'Searching...' : 'No results found'}
            </div>
          ) : (
            displayOptions.map((opt) => (
              <ComboboxOption
                key={opt.value}
                value={opt}
                className="group flex cursor-pointer items-center gap-2 px-3 py-2 text-sm data-[focus]:bg-primary-50"
              >
                <Check size={14} className="invisible text-primary-600 group-data-[selected]:visible" />
                {opt.label}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
      {error && <span className="mt-1 text-sm text-red-500">{error.message}</span>}
    </div>
  )
}

export default SearchSelect
