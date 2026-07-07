import { useController, type Control, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form'
import Checkbox from '@/components/form/checkbox'
import { type OptionType } from '../consultationTemplate'

type CheckboxGroupProps<T extends FieldValues = FieldValues> = {
    control: Control<T>
    name: Path<T>
    rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    options: OptionType[]
    label?: string
    disabled?: boolean
}

const ConsultationCheckboxGroup = <T extends FieldValues = FieldValues>({
    control,
    name,
    rules,
    options,
    label,
    disabled,
}: CheckboxGroupProps<T>) => {
    const { field, fieldState: { error } } = useController({ control, name, rules })

    const value: string[] = Array.isArray(field.value) ? field.value : []
    const isNormal = value.includes('NORMAL')
    const checkDisabled = disabled || isNormal

    const handleChange = (option: OptionType) => {
        if (!option.value) return
        if (value.includes(option.value)) {
            field.onChange(value.filter((v) => v !== option.value))
        } else {
            field.onChange([...value.filter((v) => v !== 'NORMAL'), option.value])
        }
    }

    return (
        <fieldset>
            {label && (
                <legend className="text-sm font-medium text-gray-700 mb-2">
                    {label} {rules?.required && <span className="text-red-500">*</span>}
                </legend>
            )}
            <div className="grid grid-cols-12 gap-3">
                {options.map((option, idx) => {
                    const isChecked = option.value ? value.includes(option.value) : false

                    if (option.text || !option.value) {
                        return (
                            <div key={idx} style={{ gridColumn: `span ${option.colSpan ?? 12}` }} className="flex items-center">
                                <span className="text-sm font-semibold text-gray-800">{option.text}</span>
                            </div>
                        )
                    }

                    return (
                        <div key={option.value} style={{ gridColumn: `span ${option.colSpan ?? 3}` }} className="flex items-center">
                            <label className={`flex items-center gap-1.5 text-sm text-gray-700 ${checkDisabled ? '' : 'cursor-pointer hover:text-gray-900'}`}>
                                <Checkbox
                                    checked={isChecked}
                                    disabled={checkDisabled}
                                    onChange={() => handleChange(option)}
                                />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        </div>
                    )
                })}
            </div>
            {error?.message && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </fieldset>
    )
}

export default ConsultationCheckboxGroup
