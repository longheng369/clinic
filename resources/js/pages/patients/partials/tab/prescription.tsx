import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { IPrescription, IPrescriptionItemFormData } from '@/interfaces/IPrescription'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { useRef } from 'react'
import MedicineItemForm from '../../../prescriptions/partials/MedicineItemForm'
import { cn } from '@/utils/cn'

interface SelectedVisit {
    id: number
    type: string
    visit_date: string
    status: string
    recorded_by?: string
}

const PrescriptionTab = ({
    patientId,
    selectedVisit,
    prescription,
    medicines,
}: {
    patientId: number
    selectedVisit: SelectedVisit | null
    prescription: IPrescription | null
    medicines: { id: number; name: string }[]
}) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { toast } = useToast()
    const itemsRef = useRef<IPrescriptionItemFormData[]>(
        prescription?.items.map((i) => ({
            medicine_id: i.medicine?.id ?? null,
            route: i.route,
            dosage: i.dosage,
            unit: i.unit,
            frequency: i.frequency,
            duration_days: i.duration_days,
            quantity: i.quantity,
            notes: i.notes,
        })) ?? []
    )

    const getMedicineName = (id: number | null) => {
        if (!id) return null
        return medicines.find((m) => m.id === id)?.name ?? null
    }

    const savePrescription = (items: IPrescriptionItemFormData[]) => {
        if (!selectedVisit) {
            toast('No visit selected.', { variant: 'error' })
            return
        }

        const payload = {
            visit_id: selectedVisit.id,
            items: items,
            notes: prescription?.notes ?? '',
        }

        if (prescription) {
            router.put(`/patients/${patientId}/prescriptions/${prescription.id}`, payload as Record<string, any>, {
                onSuccess: () => toast('Prescription updated!', { variant: 'success' }),
                onError: () => toast('Failed to save.', { variant: 'error' }),
            })
        } else {
            router.post(`/patients/${patientId}/prescriptions`, payload as Record<string, any>, {
                onSuccess: () => toast('Prescription created!', { variant: 'success' }),
                onError: () => toast('Failed to save.', { variant: 'error' }),
            })
        }
    }

    const openAddModal = () => {
        openModal({
            title: 'Add Medicine',
            content: (
                <MedicineItemForm
                    medicines={medicines}
                    onSave={(data) => {
                        itemsRef.current = [...itemsRef.current, data]
                        savePrescription(itemsRef.current)
                        closeModal()
                    }}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const openEditModal = (index: number) => {
        const item = prescription?.items[index]
        if (!item) return
        openModal({
            title: 'Edit Medicine',
            content: (
                <MedicineItemForm
                    medicines={medicines}
                    defaultValues={{
                        medicine_id: item.medicine?.id ?? null,
                        route: item.route,
                        dosage: item.dosage,
                        unit: item.unit,
                        frequency: item.frequency,
                        duration_days: item.duration_days,
                        quantity: item.quantity,
                        notes: item.notes,
                    }}
                    onSave={(data) => {
                        const updated = [...itemsRef.current]
                        updated[index] = data
                        itemsRef.current = updated
                        savePrescription(updated)
                        closeModal()
                    }}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleRemove = (index: number) => {
        const updated = itemsRef.current.filter((_, i) => i !== index)
        itemsRef.current = updated
        savePrescription(updated)
    }

    const handleDeletePrescription = () => {
        if (!prescription) return
        openAlert({
            message: 'Delete this prescription?',
            description: `${prescription.items.length} medicine(s) will be removed. This action cannot be undone.`,
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patientId}/prescriptions/${prescription.id}`),
        })
    }

    if (!selectedVisit) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Prescriptions</h3>
                <p className="text-sm text-gray-500">Select a visit to manage prescriptions.</p>
            </div>
        )
    }

    if (!prescription) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Prescription</h3>
                <p className="text-sm text-gray-500 mb-6">This visit doesn't have a prescription yet.</p>
                <Button onClick={openAddModal}>
                    <Plus size={18} /> Start Prescription
                </Button>
            </div>
        )
    }

    return (
        <div className="border border-gray-300 bg-white print:border-none">
            {/* Clinic Header */}
            <div className="border-b-2 border-gray-200 px-6 pt-6 pb-4">
                <h2 className="text-lg font-bold text-primary-700 tracking-tight">Santhomok Clinic</h2>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    មន្ទីរពេទ្យសន្ធមោក្ខ | ពិគ្រោះជំងឺទូទៅ
                </p>
            </div>

            {/* Doctor & Date Row */}
            <div className="border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">វេជ្ជបណ្ឌិត / Doctor: </span>
                        <span className="font-medium text-gray-800">{prescription.recorded_by ?? '—'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">កាលបរិច្ឆេទ / Date: </span>
                        <span className="font-medium text-gray-800">
                            {new Date(prescription.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-gray-500">Rx #</span>{' '}
                        <span className="font-medium text-gray-800">{prescription.id}</span>
                    </div>
                </div>
            </div>

            {/* Medicine Table */}
            <div className="px-6 py-4">
                {prescription.items.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">
                        No medicines in this prescription.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-2 pr-2 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-8">No</th>
                                <th className="py-2 pr-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                    <span className="font-khmer text-[12px]">ឈ្មោះថ្នាំ</span>
                                    <span className="block text-gray-400 font-normal normal-case tracking-normal">Medicine</span>
                                </th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-16">Route</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-24">Doses</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-24">Frequency</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-24">Duration</th>
                                <th className="py-2 pl-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 min-w-[120px]">Note</th>
                                <th className="py-2 w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescription.items.map((item, index) => (
                                <tr
                                    key={item.id ?? index}
                                    className={cn(
                                        'border-b border-gray-100 group',
                                        index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white',
                                    )}
                                >
                                    <td className="py-3 pr-2 text-center text-xs text-gray-400 font-medium">{index + 1}</td>
                                    <td className="py-3 pr-2 text-sm font-medium text-gray-900">{item.medicine?.name ?? <span className="text-gray-300">—</span>}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">{item.route}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">
                                        {item.dosage} {item.unit}
                                    </td>
                                    <td className="py-3 px-2 text-xs text-gray-600">{item.frequency}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">
                                        {item.duration_days ? `${item.duration_days} days` : <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="py-3 pl-2 text-xs text-gray-500">{item.notes ?? ''}</td>
                                    <td className="py-3 text-center">
                                        <div className="flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(index)}
                                                className="inline-flex items-center justify-center size-6 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                className="inline-flex items-center justify-center size-6 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Signature */}
            <div className="border-t-2 border-gray-200 px-6 py-5">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[11px] text-gray-500 font-khmer">មន្ទីរពេទ្យសន្ធមោក្ខ</p>
                        <p className="text-[10px] text-gray-400">Santhomok Clinic</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-gray-400 mb-4">ហត្ថលេខាវេជ្ជបណ្ឌិត</p>
                        <div className="w-32 border-b border-gray-300" />
                        <p className="text-[10px] text-gray-400 mt-1">Doctor Signature</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="xs" onClick={openAddModal}>
                        <Plus size={13} /> Add Medicine
                    </Button>
                    <Button variant="destructive" size="xs" onClick={handleDeletePrescription}>
                        <Trash2 size={13} /> Delete Rx
                    </Button>
                </div>
                <span className="text-[10px] text-gray-400">
                    Created {new Date(prescription.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            </div>
        </div>
    )
}

export default PrescriptionTab
