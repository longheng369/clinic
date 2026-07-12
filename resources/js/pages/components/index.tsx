import { useState } from 'react'
import Select from '@/components/selection/select'
import Autocomplete from '@/components/selection/autocomplete'
import { Head } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import RHFAutocomplete from '@/components/form/autocomplete';
import RHFSelect from '@/components/form/select';

const ComponentPages = () => {
    const [value, setValue] = useState('');
    const [autoValue, setAutoValue] = useState('');
    const { control } = useForm({
        defaultValues: {
            auto_complete: 'option1',
            select: ''
        }
    });

    const AutocompleteValue = useWatch({
        control,
        name: 'auto_complete'
    })

    const options = [
        { value: 'option1', label: 'Appointment' },
        { value: 'option2', label: 'Billing' },
        { value: 'option3', label: 'Pharmacy' },
        { value: 'option4', label: 'Laboratory' },
        { value: 'option5', label: 'Radiology' },
        { value: 'option6', label: 'Surgery' },
    ];

    return (
        <>
            <Head title='Components'/>
            <div className='grid grid-cols-3 gap-4 p-4 m-4 shadow-md rounded-xl'>
                <Select
                    options={options}
                    value={value}
                    onChange={setValue}
                    placeholder="Choose an option"
                />
                <Autocomplete
                    options={options}
                    value={autoValue}
                    onChange={setAutoValue}
                    placeholder="Pick a module"
                />
                <RHFAutocomplete control={control} label='Autocomplete' options={options} name='auto_complete' rules={{ required: "This field is required" }} />
                <RHFSelect control={control} name='select' label='Select' options={options} />
            </div>
        </>
    )
}

export default ComponentPages
