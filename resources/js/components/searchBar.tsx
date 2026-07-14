import React, { FC, useState } from 'react'
import { Input } from './ui/input'
import { Search, X } from 'lucide-react';

interface Props {
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

const SearchBar: FC<Props> = ({
    value,
    placeholder,
    onChange,
}) => {
    return (
        <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                onChange={(e) => onChange(e)}
                className="pl-9 pr-8 w-100 py-2!"
                placeholder={placeholder}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    )
}

export default SearchBar
