import { IOption } from '@/interfaces/IOption';
import React, { FC } from 'react'
import {
    useController,
    type Control,
    type FieldValues,
    type Path,
    type RegisterOptions,
} from "react-hook-form";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

type Props<T extends FieldValues = FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    rules?: Omit<
        RegisterOptions<T, Path<T>>,
        "valueAsDate" | "setValueAs" | "disabled"
    >;
    label: string;
    options: IOption<string>[];
}

const RHFCombobox: FC<Props> = ({ control, name, rules, label, options }) => {
    const { field, fieldState: { error } } = useController({
        control,
        name,
        rules,
    });

    return (
        <Combobox items={options}>
            <ComboboxInput placeholder="Select a framework" className='bg-transparent border border-gray-300 rounded-md py-5' />
            <ComboboxContent className='rounded-md'>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: IOption<string>) => (
                        <ComboboxItem key={item.value} value={item.value} className='rounded-md'>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default RHFCombobox
