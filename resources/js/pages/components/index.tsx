import { useState } from 'react'
import Select from '@/components/selection/select'
import Autocomplete from '@/components/selection/autocomplete'
import { Head } from '@inertiajs/react';

const ComponentPages = () => {
    const [value, setValue] = useState('');
    const [autoValue, setAutoValue] = useState('');

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
            </div>
        </>
    )
}

export default ComponentPages
