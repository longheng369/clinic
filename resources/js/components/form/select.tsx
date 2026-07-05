import React from 'react'
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

type SelectOption = {
    value: string | number;
    label: string;
}

type SelectProps<T extends FieldValues = FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    rules?: Omit<
        RegisterOptions<T, Path<T>>,
        "valueAsDate" | "setValueAs" | "disabled"
    >;
    label: string;
    options: SelectOption[];
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'>

const Select = <T extends FieldValues = FieldValues>({
    control,
    name,
    rules,
    label,
    options,
    ...rest
}: SelectProps<T>) => {
    const { field, fieldState: { error } } = useController({
        control,
        name,
        rules,
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === '') {
            field.onChange(null);
        } else if (rules?.valueAsNumber) {
            field.onChange(Number(val));
        } else {
            field.onChange(val);
        }
    };

    const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ');

    const base = "w-full rounded-lg border px-3 py-2.5 outline-none text-sm focus:ring-2";
    const defaultStyle = "border-gray-300 focus:ring-primary-500/20 focus:border-primary-500";
    const errorStyle = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

    return (
        <div className='flex flex-col'>
            <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${error && 'text-red-500'}`}>
                {label} {rules?.required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                value={field.value ?? ''}
                onChange={handleChange}
                onBlur={field.onBlur}
                ref={field.ref}
                {...rest}
                className={cn(base, error ? errorStyle : defaultStyle)}
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="mt-1 text-sm text-red-500">{error.message}</span>}
        </div>
    )
}

export default Select
