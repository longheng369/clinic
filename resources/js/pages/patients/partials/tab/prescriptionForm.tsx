import { useForm, useFieldArray } from 'react-hook-form'
import Select from '@/components/form/select'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import { IPrescription, IPrescriptionFormData } from '@/interfaces/IPrescription'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { Plus, Trash2 } from 'lucide-react'

const ROUTE_OPTIONS = [
    { value: 'PO', label: 'PO' },
    { value: 'IV', label: 'IV' },
    { value: 'IM', label: 'IM' },
    { value: 'SC', label: 'SC' },
    { value: 'SL', label: 'SL' },
    { value: 'PR', label: 'PR' },
    { value: 'Topical', label: 'Topical' },
    { value: 'Inhalation', label: 'Inhale' },
    { value: 'Otic', label: 'Otic' },
    { value: 'Ophthalmic', label: 'Ophth' },
]

const FREQUENCY_OPTIONS = [
    { value: 'QD', label: 'QD' },
    { value: 'BID', label: 'BID' },
    { value: 'TID', label: 'TID' },
    { value: 'QID', label: 'QID' },
    { value: 'QHS', label: 'QHS' },
    { value: 'PRN', label: 'PRN' },
]

interface PrescriptionFormProps {
    patientId: number
    activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
    medicines: { id: number; name: string }[]
    prescription?: IPrescription
    selectedVisitId?: number
    onClose: () => void
}

const emptyItem = () => ({
    medicine_id: null,
    route: 'PO',
    dosage: null,
    unit: '',
    frequency: 'QD',
    duration_days: null,
    quantity: null,
    notes: null,
})

const COL_WIDTHS = {
    medicine: 'min-w-[160px]',
    route: 'w-[80px]',
    frequency: 'w-[76px]',
    dosage: 'w-[90px]',
    unit: 'w-[80px]',
    duration: 'w-[85px]',
    quantity: 'w-[90px]',
    notes: 'min-w-[120px]',
    actions: 'w-[44px]',
}

const PrescriptionForm = ({ patientId, activeVisits, medicines, prescription, selectedVisitId, onClose }: PrescriptionFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()

    const { control, handleSubmit } = useForm<IPrescriptionFormData>({
        defaultValues: prescription
            ? {
                  visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
                  notes: prescription.notes ?? '',
                  items: prescription.items.map((i) => ({
                      medicine_id: i.medicine?.id ?? null,
                      route: i.route,
                      dosage: i.dosage,
                      unit: i.unit,
                      frequency: i.frequency,
                      duration_days: i.duration_days,
                      quantity: i.quantity,
                      notes: i.notes,
                  })),
              }
            : {
                  visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
                  notes: '',
                  items: [emptyItem()],
              },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })

    const medicineOptions = medicines.map((m) => ({ value: m.id, label: m.name }))

    const visitOptions = activeVisits.map((v) => ({
        value: v.id,
        label: `${v.type} — ${new Date(v.visit_date).toLocaleDateString()}`,
    }))

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload = data as any

        if (prescription) {
            router.put(`/patients/${patientId}/prescriptions/${prescription.id}`, payload, {
                onSuccess: () => {
                    onClose()
                    toast('Prescription updated!', { variant: 'success' })
                },
                onFinish: () => setIsProcessing(false),
            })
        } else {
            router.post(`/patients/${patientId}/prescriptions`, payload, {
                onSuccess: () => {
                    onClose()
                    toast('Prescription created!', { variant: 'success' })
                },
                onFinish: () => setIsProcessing(false),
            })
        }
    })

    return (
        <form onSubmit={onSubmit} className="flex flex-col max-h-[calc(100vh-12rem)]" noValidate>
            <div className="p-6 pb-0 space-y-5 flex-1 overflow-auto">
                {visitOptions.length > 1 && (
                    <div className="max-w-xs">
                        <Select
                            label="Visit"
                            control={control}
                            name="visit_id"
                            options={visitOptions}
                            rules={{ required: 'This field is required' }}
                        />
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Medicines</h4>
                        <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => append(emptyItem())}
                        >
                            <Plus size={14} /> Add Medicine
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.medicine}`}>Medicine</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.route}`}>Route</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.frequency}`}>Freq</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.dosage}`}>Dosage</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.unit}`}>Unit</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.duration}`}>Duration</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.quantity}`}>Qty</th>
                                    <th className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${COL_WIDTHS.notes}`}>Notes</th>
                                    <th className={`px-3 py-2.5 ${COL_WIDTHS.actions}`}></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {fields.map((field, index) => (
                                    <tr key={field.id} className="group">
                                        <td className={`px-3 py-2 ${COL_WIDTHS.medicine}`}>
                                            <Select
                                                control={control}
                                                name={`items.${index}.medicine_id`}
                                                options={medicineOptions}
                                                rules={{ required: true }}
                                                placeholder="Select medicine..."
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.route}`}>
                                            <Select
                                                control={control}
                                                name={`items.${index}.route`}
                                                options={ROUTE_OPTIONS}
                                                rules={{ required: true }}
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.frequency}`}>
                                            <Select
                                                control={control}
                                                name={`items.${index}.frequency`}
                                                options={FREQUENCY_OPTIONS}
                                                rules={{ required: true }}
                                                compact
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.dosage}`}>
                                            <Input
                                                control={control}
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                name={`items.${index}.dosage`}
                                                rules={{ required: true }}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.unit}`}>
                                            <Input
                                                control={control}
                                                type="text"
                                                name={`items.${index}.unit`}
                                                rules={{ required: true }}
                                                placeholder="mg"
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.duration}`}>
                                            <Input
                                                control={control}
                                                type="number"
                                                min={1}
                                                name={`items.${index}.duration_days`}
                                                placeholder="7"
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.quantity}`}>
                                            <Input
                                                control={control}
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                name={`items.${index}.quantity`}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.notes}`}>
                                            <Input
                                                control={control}
                                                type="text"
                                                name={`items.${index}.notes`}
                                                placeholder="..."
                                            />
                                        </td>
                                        <td className={`px-3 py-2 ${COL_WIDTHS.actions}`}>
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="inline-flex items-center justify-center size-7 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {fields.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg mt-3">
                            No medicines added. Click &quot;Add Medicine&quot; to begin.
                        </div>
                    )}
                </div>

                <Textarea
                    label="General Notes"
                    control={control}
                    name="notes"
                    placeholder="Optional general notes for this prescription..."
                />
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                <Button type="submit" disabled={isProcessing}>
                    {prescription ? 'Update' : 'Create Prescription'}
                </Button>
            </div>
        </form>
    )
}

export default PrescriptionForm
