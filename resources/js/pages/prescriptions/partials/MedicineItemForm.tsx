import { useForm } from 'react-hook-form'
import Select from '@/components/form/select'
import Input from '@/components/form/input'
import { Button } from '@/components/ui/button'
import { IPrescriptionItemFormData } from '@/interfaces/IPrescription'

const ROUTE_OPTIONS = [
    { value: 'PO', label: 'PO (Oral)' },
    { value: 'IV', label: 'IV (Intravenous)' },
    { value: 'IM', label: 'IM (Intramuscular)' },
    { value: 'SC', label: 'SC (Subcutaneous)' },
    { value: 'SL', label: 'SL (Sublingual)' },
    { value: 'PR', label: 'PR (Rectal)' },
    { value: 'Topical', label: 'Topical' },
    { value: 'Inhalation', label: 'Inhalation' },
    { value: 'Otic', label: 'Otic (Ear)' },
    { value: 'Ophthalmic', label: 'Ophthalmic (Eye)' },
]

const FREQUENCY_OPTIONS = [
    { value: 'QD', label: 'Once daily (QD)' },
    { value: 'BID', label: 'Twice daily (BID)' },
    { value: 'TID', label: 'Three times daily (TID)' },
    { value: 'QID', label: 'Four times daily (QID)' },
    { value: 'QHS', label: 'At bedtime (QHS)' },
    { value: 'PRN', label: 'As needed (PRN)' },
]

interface MedicineItemFormProps {
    medicines: { id: number; name: string }[]
    defaultValues?: IPrescriptionItemFormData
    onSave: (data: IPrescriptionItemFormData) => void
    onClose: () => void
}

const MedicineItemForm = ({ medicines, defaultValues, onSave, onClose }: MedicineItemFormProps) => {
    const { control, handleSubmit } = useForm<IPrescriptionItemFormData>({
        defaultValues: defaultValues ?? {
            medicine_id: null,
            route: 'PO',
            dosage: null,
            unit: '',
            frequency: 'QD',
            duration_days: null,
            quantity: null,
            notes: null,
        },
    })

    const medicineOptions = medicines.map((m) => ({ value: m.id, label: m.name }))

    return (
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col max-h-[calc(100vh-14rem)]">
            <div className="p-6 space-y-4 flex-1 overflow-auto">
                <Select
                    label="Medicine"
                    control={control}
                    name="medicine_id"
                    options={medicineOptions}
                    rules={{ required: 'Medicine is required' }}
                    placeholder="Select medicine..."
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Route"
                        control={control}
                        name="route"
                        options={ROUTE_OPTIONS}
                        rules={{ required: 'Required' }}
                    />
                    <Select
                        label="Frequency"
                        control={control}
                        name="frequency"
                        options={FREQUENCY_OPTIONS}
                        rules={{ required: 'Required' }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Dosage"
                        control={control}
                        type="number"
                        step="0.01"
                        min={0}
                        name="dosage"
                        rules={{ required: 'Required' }}
                        placeholder="e.g. 500"
                    />
                    <Input
                        label="Unit"
                        control={control}
                        type="text"
                        name="unit"
                        rules={{ required: 'Required' }}
                        placeholder="e.g. mg, g, ml"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Duration (days)"
                        control={control}
                        type="number"
                        min={1}
                        name="duration_days"
                        placeholder="e.g. 7"
                    />
                    <Input
                        label="Quantity"
                        control={control}
                        type="number"
                        step="0.01"
                        min={0}
                        name="quantity"
                        placeholder="e.g. 30"
                    />
                </div>

                <Input
                    label="Notes"
                    control={control}
                    type="text"
                    name="notes"
                    placeholder="e.g. Take after meals"
                />
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                <Button type="submit">{defaultValues ? 'Update' : 'Add'} Medicine</Button>
            </div>
        </form>
    )
}

export default MedicineItemForm