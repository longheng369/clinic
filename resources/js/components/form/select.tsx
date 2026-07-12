import { Select } from '@base-ui/react/select'
import { ChevronDown } from 'lucide-react'
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

type SelectProps<T extends FieldValues = FieldValues> = {
  control: Control<T>
  name: Path<T>
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >
  label: string
  options: SelectOption[]
  placeholder?: string
}

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ')

const RHFSelect = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options,
  placeholder = 'Select an option...',
}: SelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  })

  const triggerBase =
    'w-full rounded-lg border px-3 py-2.5 outline-none text-sm focus:ring-2 flex items-center justify-between gap-2'
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
      <Select.Root
        items={options}
        value={field.value ?? null}
        onValueChange={(value: string | number | null) => {
          field.onChange(value)
        }}
      >
        <Select.Trigger
          className={cn(
            triggerBase,
            error ? errorStyle : defaultStyle,
            'data-placeholder:text-gray-400',
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            sideOffset={4}
            alignItemWithTrigger={false}
            side="bottom"
            className="z-50 w-(--anchor-width)"
          >
            <Select.Popup className="origin-top rounded-md bg-white py-1 shadow-lg border border-gray-300 data-open:animate-in data-open:fade-in data-open:zoom-in-95">
              <Select.List className="max-h-60 overflow-auto">
                {options.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer px-3 py-2 text-sm transition-colors duration-150 data-highlighted:bg-primary-50 data-highlighted:text-primary data-selected:font-medium"
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {error && (
        <span className="mt-1 text-sm text-red-500">{error.message}</span>
      )}
    </div>
  )
}

export default RHFSelect
