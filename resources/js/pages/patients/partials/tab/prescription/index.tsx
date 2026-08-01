import { usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Stethoscope } from 'lucide-react'
import { IPrescription, IPrescriptionFormData } from '@/interfaces/IPrescription'
import { IPatient } from '@/interfaces/IPatient'
import { Button } from '@/components/ui/button'
import MedicineItemForm from './partials/prescriptionItemForm'
import { formatDob } from '@/utils/date'
import { useFieldArray, useForm } from 'react-hook-form'

interface SelectedVisit {
    id: number
    type: string
    visit_date: string
    status: string
    recorded_by?: string
}

const PrescriptionTab = ({
    patient,
    selectedVisit,
    prescription,
}: {
    patient: IPatient
    selectedVisit: SelectedVisit | null
    prescription: IPrescription | null
}) => {
    const { openModal, closeModal } = useModal()
    const { medicines } = usePage<{ medicines: { id: number; name: string }[] }>().props
    console.log(medicines)
    const { control } = useForm<IPrescriptionFormData>();
    const { fields, append, update } = useFieldArray({
        control,
        name: 'items'
    });

    const openAddModal = () => {
        openModal({
            title: 'Add Medicine',
            content: (
                <MedicineItemForm
                    medicines={medicines}
                    onSave={(data) => {
                        append(data);
                        closeModal();
                    }}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const openEditModal = (index: number) => {
        const item = fields[index];
        openModal({
            title: 'Edit Medicine',
            content: (
                <MedicineItemForm
                    medicines={medicines}
                    defaultValues={item}
                    onSave={(data) => {
                        update(index, data);
                        closeModal();
                    }}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
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
                <p className="text-sm text-gray-500 mb-6">This visit doesn&apos;t have a prescription yet.</p>
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
            <div>
                {prescription.items.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">
                        No medicines in this prescription.
                    </div>
                ) : (
                    <table className="w-full text-base mt-4 table-fixed border-collapse">
                        <thead>
                            <tr className="bg-blue-200 border border-blue-200 font-semibold font-khmer">
                                <th className="text-start px-2 py-4 w-[5%]">ល.រ</th>
                                <th className="text-start w-[25%]">ឈ្មោះថ្នាំ</th>
                                <th className="text-start w-[10%]">ចំនួន</th>
                                <th className="text-start w-[20%]">ការប្រើប្រាស់</th>
                                <th className="text-start w-[10%]">ចំនួនថ្ងៃ</th>
                                <th className="text-start w-[30%]">កំណត់ចំណាំ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id} className="border border-gray-300 text-center cursor-pointer" onClick={() => openEditModal(index)}>
                                    <td className="px-2 py-4 text-start">{index + 1}</td>
                                    <td className="py-4 text-start">{field.medicine?.name}</td>
                                    <td className="py-4 text-start">{field.quantity} {field.unit?.name}</td>
                                    <td className="px-2 py-4 text-start font-khmer">{field.route} {field.morning && `ព្រឹក ${field.morning}គ្រាប់`} {field.morning && `រសៀល ${field.afternoon}គ្រាប់`} {field.morning && `ល្ងាច ${field.evening}គ្រាប់`} {field.morning && `យប់ ${field.night}គ្រាប់`}</td>
                                    <td className="px-2 py-4 text-start">{field.numberOfDay}</td>
                                    <td className="px-2 py-4 text-start font-khmer">{field.notes}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={6} className="px-2 py-4 text-center">
                                    <Button variant="gradient" onClick={openAddModal}>
                                        + Add medicine
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default PrescriptionTab
