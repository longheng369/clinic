import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ConsultationForm from './partials/ConsultationForm'
import Button from '@/components/button/button'
import { useToast } from '@/components/toast'
import { IConsultationFormData } from '@/interfaces/IConsultation'
import type { IPatient } from '@/interfaces/IPatient'

const CreateConsultation = ({ patient }: { patient: IPatient }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<IConsultationFormData>({
        defaultValues: {
            weight: null,
            chief_complaint: '',
            respiratory_system_symptoms: [],
            respiratory_system_others_note: '',
            cardiovascular_symptoms: [],
            cardiovascular_others_note: '',
            neurological_symptoms: [],
            neurological_others_note: '',
            musculoskeletal_symptoms: [],
            musculoskeletal_others_note: '',
            digestive_symptoms: [],
            digestive_others_note: '',
            renal_reproductive_symptoms: [],
            renal_reproductive_others_note: '',
            skin_symptoms: [],
            skin_others_note: '',
            eye_symptoms: [],
            eye_others_note: '',
            ear_symptoms: [],
            ear_others_note: '',
            nose_symptoms: [],
            nose_others_note: '',
            throat_symptoms: [],
            throat_others_note: '',
            psycology_symptoms: [],
            psycology_others_note: '',
            diagnosis: '',
            note: '',
            fee: null,
        },
    })

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        router.post(`/patients/${patient.id}/consultations`, data as Record<string, any>, {
            onSuccess: () => {
                toast('Consultation created!', { variant: 'success' })
                router.visit(`/patients/${patient.id}?tab=consultation`)
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <>
            <Head title="New Consultation" />
            <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/patients/${patient.id}?tab=consultation`}
                            className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-primary-100 text-primary-600">
                                <Stethoscope size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">New Consultation</h1>
                                <p className="text-sm text-gray-500">
                                    {patient.khmer_last_name} {patient.khmer_first_name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <form onSubmit={onSubmit} noValidate>
                            <ConsultationForm control={control} />
                            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-200">
                                <Link href={`/patients/${patient.id}?tab=consultation`}>
                                    <Button type="button" color="secondary" variant="outlined">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={isProcessing}>Create Consultation</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateConsultation
