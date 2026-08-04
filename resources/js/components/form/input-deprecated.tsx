import React from 'react'
import {
   useController,
   type Control,
   type FieldValues,
   type Path,
   type RegisterOptions,
} from "react-hook-form";

type InputProps<T extends FieldValues = FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    rules?: Omit<
        RegisterOptions<T, Path<T>>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
    label?: string;
    compact?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>

const Input = <T extends FieldValues = FieldValues>({
   control,
   name,
   rules,
   label,
   compact,
   ...rest
}: InputProps<T>) => {
   const { field, fieldState: { error } } = useController({
      control,
      name,
      rules,
   });

   const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ');

   const inputBase = compact
      ? "w-full rounded-lg border px-2.5 py-1.5 outline-none text-xs focus:ring-1 transition-colors"
      : "w-full rounded-xl border px-3 py-2.5 outline-none text-sm focus:ring-2 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]";

   const inputDefault = "border-gray-300 focus:ring-primary-500/20 focus:border-primary-500";
   const inputError = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

   return (
      <div className='flex flex-col'>
         {label && (
            <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${error && 'text-red-500'}`}>
               {label} {rules?.required && <span className="text-red-500">*</span>}
            </label>
         )}
         <input
            id={name}
            {...field}
            {...rest}
            className={cn(inputBase, error ? inputError : inputDefault)}
         />
         {error && <span className="mt-1 text-sm text-red-500">{error.message}</span>}
      </div>
   )
}

export default Input
