import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import Textarea from '@/components/form/textarea'
import { IMedicationFormData } from '@/interfaces/IMedicationAdministration'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'

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

const INTERVAL_OPTIONS = [
    { value: 'QD', label: 'QD (Once daily)' },
    { value: 'BID', label: 'BID (Twice daily)' },
    { value: 'TID', label: 'TID (Three times daily)' },
    { value: 'QID', label: 'QID (Four times daily)' },
    { value: 'QHS', label: 'QHS (At bedtime)' },
    { value: 'PRN', label: 'PRN (As needed)' },
]

interface MedicationFormProps {
    patientId: number
    activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
    medicines: { id: number; name: string }[]
    onClose: () => void
}

const MedicationForm = ({ patientId, activeVisits, medicines, onClose }: MedicationFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<IMedicationFormData>({
        defaultValues: {
            visit_id: activeVisits[0]?.id ?? 0,
            medicine_id: null,
            route: '',
            dosage: null,
            unit: '',
            interval: '',
            notes: '',
        },
    })

    const medicineOptions = medicines.map((m) => ({ value: m.id, label: m.name }))

    const visitOptions = activeVisits.map((v) => ({
        value: v.id,
        label: `${v.type} — ${new Date(v.visit_date).toLocaleDateString()}`,
    }))

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        router.post(`/patients/${patientId}/medications`, { ...data }, {
            onSuccess: () => {
                onClose()
                toast('Medication prescribed!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                {visitOptions.length > 1 && (
                    <Select
                        label="Visit"
                        control={control}
                        name="visit_id"
                        options={visitOptions}
                        rules={{ required: 'This field is required' }}
                    />
                )}

                <Select
                    label="Medicine"
                    control={control}
                    name="medicine_id"
                    options={medicineOptions}
                    rules={{ required: 'This field is required' }}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Route"
                        control={control}
                        name="route"
                        options={ROUTE_OPTIONS}
                        rules={{ required: 'This field is required' }}
                    />
                    <Select
                        label="Interval"
                        control={control}
                        name="interval"
                        options={INTERVAL_OPTIONS}
                        rules={{ required: 'This field is required' }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Dosage"
                        control={control}
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="e.g. 500"
                        name="dosage"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' } }}
                    />
                    <Input
                        label="Unit"
                        control={control}
                        type="text"
                        placeholder="e.g. mg, g, ml"
                        name="unit"
                        rules={{ required: 'Required' }}
                    />
                </div>

                <Textarea
                    label="Notes"
                    control={control}
                    name="notes"
                    placeholder="Optional notes..."
                />
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                <Button type="submit" disabled={isProcessing}>Prescribe</Button>
            </div>
        </form>
    )
}

export default MedicationForm
