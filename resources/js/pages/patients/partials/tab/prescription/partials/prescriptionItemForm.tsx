import { IPrescriptionItemFormData } from '@/interfaces/IPrescription';
import React, { FC } from 'react'
import { useForm, useController } from 'react-hook-form';
import Input from '@/components/form/input';
import RHFSelect from '@/components/form/select';
import { Button } from '@/components/ui/button';

interface Props {
    onSave: (data: IPrescriptionItemFormData) => void;
    medicines: { id: number; name: string }[];
    defaultValues?: IPrescriptionItemFormData;
}

const routeOptions = [
    { label: 'Oral (PO)', value: 'PO' },
    { label: 'Intravenous (IV)', value: 'IV' },
    { label: 'Intramuscular (IM)', value: 'IM' },
    { label: 'Subcutaneous (SC)', value: 'SC' },
    { label: 'Topical', value: 'Topical' },
    { label: 'Sublingual', value: 'Sublingual' },
];

const unitList = [
    { id: 1, name: 'Tablet' },
    { id: 2, name: 'Capsule' },
    { id: 3, name: 'mL' },
    { id: 4, name: 'mg' },
    { id: 5, name: 'g' },
];

const PrescriptionItemForm: FC<Props> = ({
    onSave,
    medicines,
    defaultValues,
}) => {
    const { control, handleSubmit } = useForm<IPrescriptionItemFormData>({
        defaultValues: defaultValues ?? {
            quantity: 0,
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
            numberOfDay: 0,
        },
    });
    const { field: medicineField } = useController({ control, name: 'medicine' });
    const { field: unitField } = useController({ control, name: 'unit' });

    return (
        <div className='grid grid-cols-2 gap-4 p-6'>
            {/* Medicine */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine <span className="text-red-500">*</span></label>
                <select
                    value={medicineField.value?.id ?? ''}
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        const name = medicines.find((m) => m.id === id)?.name ?? '';
                        medicineField.onChange({ id, name });
                    }}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                >
                    <option value="" disabled>Select medicine</option>
                    {medicines.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>

            {/* Route */}
            <RHFSelect control={control} name="route" label="Route" options={routeOptions} placeholder="Select route" rules={{ required: 'Route is required' }} />

            {/* Unit */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit <span className="text-red-500">*</span></label>
                <select
                    value={unitField.value?.id ?? ''}
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        const name = unitList.find((u) => u.id === id)?.name ?? '';
                        unitField.onChange({ id, name });
                    }}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                >
                    <option value="" disabled>Select unit</option>
                    {unitList.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>

            {/* Quantity */}
            <Input control={control} name="quantity" label="Quantity" type="number" rules={{ required: 'Quantity is required', min: { value: 1, message: 'Min 1' } }} />

            {/* Morning */}
            <Input control={control} name="morning" label="Morning" type="number" rules={{ min: { value: 0, message: 'Min 0' } }} compact />

            {/* Afternoon */}
            <Input control={control} name="afternoon" label="Afternoon" type="number" rules={{ min: { value: 0, message: 'Min 0' } }} compact />

            {/* Evening */}
            <Input control={control} name="evening" label="Evening" type="number" rules={{ min: { value: 0, message: 'Min 0' } }} compact />

            {/* Night */}
            <Input control={control} name="night" label="Night" type="number" rules={{ min: { value: 0, message: 'Min 0' } }} compact />

            {/* Number of Days */}
            <Input control={control} name="numberOfDay" label="Number of Days" type="number" rules={{ required: 'Days is required', min: { value: 1, message: 'Min 1' } }} />

            {/* Notes */}
            <div className="col-span-2">
                <Input control={control} name="notes" label="Notes" />
            </div>

            {/* Submit */}
            <div className="col-span-2 flex justify-end gap-3 mt-2">
                <Button type="submit" onClick={handleSubmit(onSave)}>Add Medicine</Button>
            </div>
        </div>
    )
}

export default PrescriptionItemForm
