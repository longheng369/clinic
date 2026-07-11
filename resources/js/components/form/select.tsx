import React from 'react'
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import Select from '../selection/select';

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

const RHFSelect = <T extends FieldValues = FieldValues>({
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
        <Select {...field} options={options}/>
    )
}

export default RHFSelect
