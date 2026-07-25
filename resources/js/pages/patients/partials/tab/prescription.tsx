import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react'
import { IPrescription, IPrescriptionItemFormData } from '@/interfaces/IPrescription'
import { IPatient } from '@/interfaces/IPatient'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { useRef } from 'react'
import MedicineItemForm from '../../../prescriptions/partials/MedicineItemForm'
import { cn } from '@/utils/cn'
import { formatDob } from '@/utils/date'

interface SelectedVisit {
    id: number
    type: string
    visit_date: string
    status: string
    recorded_by?: string
}

const PrescriptionTab = ({
    patient,
    patientId,
    selectedVisit,
    prescription,
    medicines,
}: {
    patient: IPatient
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
        <div className="border border-gray-300 bg-white print:border-none p-8 relative">
            <h1 className='font-khmer-moul text-lg text-blue-800 text-center tracking-wide'>ព្រះរាជាណាចក្រកម្ពុជា</h1>
            <h1 className='font-khmer-moul text-lg text-blue-800 text-center tracking-wide mt-1'>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>

            <div className='flex items-center justify-center size-20 rounded-full bg-linear-to-br from-primary-500 to-primary-700 shrink-0 absolute top-8 left-8'>
                <Stethoscope size={30} className='text-white' />
            </div>

            <div className='grid grid-cols-2 w-1/4 mt-10'>
                <div>
                    <span className='font-khmer'>កាលបរិច្ឆេទ</span> / <span className='font-sans'>Date</span>
                </div>
                <span>: {formatDob(prescription.created_at)}</span>

                <div>
                    <span className='font-khmer'>វេជ្ជបណ្ឌិត</span> / <span className='font-sans'>Doctor</span>
                </div>
                <span>: {prescription.recorded_by ?? '—'}</span>
            </div>

            {/* Patient Info */}
            <div className="border border-gray-300 p-4 mt-4">
                <div className="grid grid-cols-4">
                    <div>
                        <div className='text-gray-500 text-sm mb-0.5'>
                            <span className='font-khmer'>ឈ្មោះ</span> / Name
                        </div>
                        <p className="font-khmer">
                            {patient.khmer_last_name} {patient.khmer_first_name}
                            {patient.first_name && (
                                <span className="font-sans text-gray-500 text-xs ml-1.5">
                                    ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <div className='text-gray-500 text-sm mb-0.5'>
                            <span className='font-khmer text-[15px]'>អាយុ</span> / Age
                        </div>
                        <p className="text-sm">{formatDob(patient.date_of_birth)}</p>
                    </div>
                    <div>
                        <div className='text-gray-500 text-sm mb-0.5'>
                            <span className='font-khmer text-[15px]'>ភេទ</span> / Gender
                        </div>
                        <p className="text-sm capitalize">{patient.gender}</p>
                    </div>
                    <div>
                        <div className='text-gray-500 text-sm mb-0.5'>
                            <span className='font-khmer text-[15px]'>ទូរស័ព្ទ</span> / Phone
                        </div>
                        <p className="text-sm">{patient.phone_number}</p>
                    </div>
                </div>
            </div>

            {/* Medicine Table */}
            <div className="px-6 py-4 border border-gray-300 mt-4">
                {prescription.items.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">
                        No medicines in this prescription.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-2 w-8 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">No</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[35%]">
                                    <span className="font-khmer text-[12px]">ឈ្មោះថ្នាំ</span>
                                    <span className="block text-gray-400 font-normal normal-case tracking-normal">Medicine</span>
                                </th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[10%]">Route</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[12%]">Doses</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[10%]">Freq</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[10%]">Duration</th>
                                <th className="py-2 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Note</th>
                                <th className="py-2 w-14"></th>
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
                                    <td className="py-3 text-center text-xs text-gray-400 font-medium">{index + 1}</td>
                                    <td className="py-3 px-2 text-sm font-medium text-gray-900 truncate">{item.medicine?.name ?? <span className="text-gray-300">—</span>}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">{item.route}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">{item.dosage} {item.unit}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">{item.frequency}</td>
                                    <td className="py-3 px-2 text-xs text-gray-600">
                                        {item.duration_days ? `${item.duration_days} days` : <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="py-3 px-2 text-xs text-gray-500 truncate">{item.notes ?? ''}</td>
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
        </div>
    )
}

export default PrescriptionTab
