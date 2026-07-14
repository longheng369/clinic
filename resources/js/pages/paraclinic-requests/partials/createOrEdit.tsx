import { useForm, useFieldArray } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import SearchSelect from '@/components/form/searchSelect'
import Textarea from '@/components/form/textarea'
import { IParaclinicRequest, IParaclinicRequestFormData, IParaclinicRequestTest } from '@/interfaces/IParaclinicRequest'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import { useToast } from '@/components/toast'
import { Plus, X } from 'lucide-react'

const TEST_CATEGORIES = [
    { value: 'Laboratory', label: 'Laboratory' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Imaging', label: 'Imaging' },
    { value: 'Pathology', label: 'Pathology' },
    { value: 'Other', label: 'Other' },
]

const TEST_NAMES: Record<string, { value: string; label: string }[]> = {
    Laboratory: [
        { value: 'CBC', label: 'CBC' },
        { value: 'Blood Sugar', label: 'Blood Sugar' },
        { value: 'Lipid Profile', label: 'Lipid Profile' },
        { value: 'Liver Function', label: 'Liver Function' },
        { value: 'Renal Function', label: 'Renal Function' },
        { value: 'Urinalysis', label: 'Urinalysis' },
    ],
    Cardiology: [
        { value: 'ECG', label: 'ECG' },
        { value: 'Echocardiogram', label: 'Echocardiogram' },
        { value: 'Stress Test', label: 'Stress Test' },
        { value: 'Holter Monitor', label: 'Holter Monitor' },
    ],
    Imaging: [
        { value: 'Chest X-Ray', label: 'Chest X-Ray' },
        { value: 'Abdominal X-Ray', label: 'Abdominal X-Ray' },
        { value: 'Ultrasound', label: 'Ultrasound' },
        { value: 'CT Scan', label: 'CT Scan' },
        { value: 'MRI', label: 'MRI' },
        { value: 'Mammography', label: 'Mammography' },
    ],
    Pathology: [
        { value: 'Biopsy', label: 'Biopsy' },
        { value: 'Histopathology', label: 'Histopathology' },
        { value: 'Cytology', label: 'Cytology' },
    ],
    Other: [
        { value: 'Other', label: 'Other' },
    ],
}

const PRIORITY_OPTIONS = [
    { value: 'Routine', label: 'Routine' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'STAT', label: 'STAT' },
]

interface ParaclinicFormProps {
    request?: IParaclinicRequest
    authUser: { id: number; name: string }
    onClose: () => void
}

const ParaclinicForm = ({ request, authUser, onClose }: ParaclinicFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()

    const defaultTests: IParaclinicRequestTest[] = request?.tests?.length
        ? request.tests.map((t) => ({ test_category: t.test_category, test_name: t.test_name, priority: t.priority, instruction: t.instruction }))
        : [{ test_category: 'Laboratory', test_name: 'CBC', priority: 'Routine', instruction: null }]

    const initialPatientOption = request?.patient
        ? { value: request.patient.id, label: `${request.patient.khmer_first_name} ${request.patient.khmer_last_name}` }
        : undefined

    const { control, handleSubmit, watch, setValue } = useForm<IParaclinicRequestFormData>({
        defaultValues: request
            ? {
                patient_id: request.patient?.id ?? null,
                doctor_id: request.doctor?.id ?? null,
                visit_id: request.visit_id,
                external_facility_name: request.external_facility_name,
                request_date: request.request_date,
                clinical_reason: request.clinical_reason,
                provisional_diagnosis: request.provisional_diagnosis,
                notes: request.notes,
                subtotal: request.subtotal,
                discount: request.discount,
                total_amount: request.total_amount,
                payment_status: request.payment_status,
                payment_date: request.payment_date,
                tests: defaultTests,
            }
            : {
                patient_id: null,
                doctor_id: authUser.id,
                visit_id: null,
                external_facility_name: '',
                request_date: new Date().toISOString().split('T')[0],
                clinical_reason: '',
                provisional_diagnosis: '',
                notes: '',
                subtotal: 0,
                discount: 0,
                total_amount: 0,
                payment_status: 'Unpaid',
                payment_date: null,
                tests: defaultTests,
            },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'tests' })
    const subtotal = watch('subtotal')
    const discount = watch('discount')

    useEffect(() => {
        const sub = Number(subtotal) || 0
        const disc = Number(discount) || 0
        const total = Math.max(0, sub - disc)
        setValue('total_amount', total)
    }, [subtotal, discount, setValue])

    const submitData = (data: IParaclinicRequestFormData, extra: Record<string, string> = {}) => {
        const payload: Record<string, any> = { ...data, ...extra }
        payload.tests = data.tests.map((t) => ({
            test_category: t.test_category,
            test_name: t.test_name,
            priority: t.priority,
            instruction: t.instruction,
        }))
        return payload
    }

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        if (request) {
            router.put(`/paraclinic-requests/${request.id}`, submitData(data) as any, {
                onSuccess: () => {
                    onClose()
                    toast('Request updated successfully!', { variant: 'success' })
                },
                onFinish: () => setIsProcessing(false),
            })
            return
        }

        router.post('/paraclinic-requests', submitData(data, { status: 'Draft' }) as any, {
            onSuccess: () => {
                onClose()
                toast('Request created successfully!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    const handleSubmitRequest = handleSubmit((data) => {
        setIsProcessing(true)
        router.post('/paraclinic-requests', submitData(data, { status: 'Requested' }) as any, {
            onSuccess: () => {
                onClose()
                toast('Request submitted successfully!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300 overflow-y-auto" noValidate>
            <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
                {/* General Information */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">General Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <SearchSelect
                                label="Patient"
                                control={control}
                                name="patient_id"
                                rules={{ required: 'Patient is required' }}
                                apiUrl="/patients/search"
                                initialOption={initialPatientOption}
                                placeholder="Search patient by name..."
                            />
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Doctor <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
                                    {authUser.name}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="External Facility"
                                control={control}
                                name="external_facility_name"
                                placeholder="e.g. National Laboratory"
                            />
                            <Input
                                label="Request Date"
                                control={control}
                                type="date"
                                name="request_date"
                                rules={{ required: 'Request date is required' }}
                            />
                        </div>
                        <Input
                            label="Provisional Diagnosis"
                            control={control}
                            name="provisional_diagnosis"
                            placeholder="Enter provisional diagnosis"
                        />
                        <Textarea
                            label="Clinical Reason"
                            control={control}
                            name="clinical_reason"
                            placeholder="Enter clinical reason"
                        />
                        <Textarea
                            label="Notes"
                            control={control}
                            name="notes"
                            placeholder="Enter any additional notes"
                        />
                    </div>
                </div>

                {/* Diagnostic Tests */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Diagnostic Tests</h3>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => append({ test_category: 'Laboratory', test_name: 'CBC', priority: 'Routine', instruction: null })}
                        >
                            <Plus size={16} /> Add Test
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const category = watch(`tests.${index}.test_category`)
                            const availableTests = TEST_NAMES[category] ?? TEST_NAMES.Other

                            return (
                                <div key={field.id} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                                    <div className="flex-1 grid grid-cols-4 gap-3">
                                        <Select
                                            label="Category"
                                            control={control}
                                            name={`tests.${index}.test_category` as any}
                                            options={TEST_CATEGORIES}
                                            rules={{ required: 'Required' }}
                                        />
                                        <Select
                                            label="Test Name"
                                            control={control}
                                            name={`tests.${index}.test_name` as any}
                                            options={availableTests}
                                            rules={{ required: 'Required' }}
                                        />
                                        <Select
                                            label="Priority"
                                            control={control}
                                            name={`tests.${index}.priority` as any}
                                            options={PRIORITY_OPTIONS}
                                            rules={{ required: 'Required' }}
                                        />
                                        <Input
                                            label="Instruction"
                                            control={control}
                                            name={`tests.${index}.instruction` as any}
                                            placeholder="Optional"
                                        />
                                    </div>
                                    {fields.length > 1 && (
                                        <IconButton color="error" onClick={() => remove(index)} aria-label="Remove test" className="mt-6">
                                            <X size={16} />
                                        </IconButton>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Billing */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Billing</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Subtotal ($)"
                            control={control}
                            type="number"
                            step="0.01"
                            min="0"
                            name="subtotal"
                            placeholder="0.00"
                        />
                        <Input
                            label="Discount ($)"
                            control={control}
                            type="number"
                            step="0.01"
                            min="0"
                            name="discount"
                            placeholder="0.00"
                        />
                        <Input
                            label="Total Amount ($)"
                            control={control}
                            type="number"
                            step="0.01"
                            min="0"
                            name="total_amount"
                            placeholder="Calculated automatically"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                {!request && (
                    <Button type="button" variant="outline" onClick={handleSubmitRequest} disabled={isProcessing}>
                        Submit Request
                    </Button>
                )}
                <Button type="submit" disabled={isProcessing}>
                    {request ? 'Update' : 'Save Draft'}
                </Button>
            </div>
        </form>
    )
}

export default ParaclinicForm
