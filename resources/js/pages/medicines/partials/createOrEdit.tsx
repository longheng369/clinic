import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import Select from '@/components/form/select'
import SearchSelect from '@/components/form/searchSelect'
import { IMedicine, IMedicineFormData } from '@/interfaces/IMedicine';
import { IUnit } from '@/interfaces/IUnit';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '@/components/button/button';
import { useToast } from '@/components/toast'

interface MedicineFormProps {
    medicine?: IMedicine;
    units: IUnit[];
    onClose: () => void;
}

const MedicineForm = ({ medicine, units, onClose }: MedicineFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<IMedicineFormData>({
        defaultValues: medicine ?? {
            name: '',
            type: '',
            description: '',
            dosage: '',
            category_id: null,
            unit_id: null,
            unit_price: null,
        }
    });

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true);
        if (medicine) {
            router.put(`/medicines/${medicine.id}`, { ...data }, {
                onSuccess: () => {
                    onClose();
                    toast('Medicine updated successfully!', { variant: 'success', description: 'The medicine has been updated.' });
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });

            return;
        }

        router.post('/medicines', { ...data }, {
            onSuccess: () => {
                onClose();
                toast('Medicine created successfully!', { variant: 'success', description: 'The medicine has been created.' })
            },
            onError: (errors) => {
                if (errors.name) {
                    toast('Unable to create medicine', {
                        variant: 'error',
                        description: errors.name,
                    });
                }
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                <Input
                    label="Name"
                    control={control}
                    placeholder='Enter name'
                    name='name'
                    rules={{ required: 'This field is required' }}
                />

                <Input
                    label="Type"
                    control={control}
                    placeholder='Enter type'
                    name='type'
                    rules={{ required: 'This field is required' }}
                />

                <div className="grid grid-cols-2 gap-4">
                    <SearchSelect
                        label="Category"
                        control={control}
                        name='category_id'
                        apiUrl="/categories/search"
                        initialOption={medicine?.category ? { value: medicine.category.id, label: medicine.category.name } : undefined}
                    />

                    <Select
                        label="Unit"
                        control={control}
                        name='unit_id'
                        options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Dosage"
                        control={control}
                        placeholder='e.g. 500mg'
                        name='dosage'
                    />

                    <Input
                        label="Unit Price"
                        control={control}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder='0.00'
                        name='unit_price'
                    />
                </div>

                <Textarea
                    label="Description"
                    control={control}
                    name='description'
                />
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button
                    type="button"
                    onClick={onClose}
                    color='secondary'
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isProcessing}
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default MedicineForm
