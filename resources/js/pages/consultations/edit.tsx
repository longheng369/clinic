import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import ConsultationForm from './partials/ConsultationForm'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { type IConsultation, type IConsultationFormData } from '@/interfaces/IConsultation'
import type { IPatient } from '@/interfaces/IPatient'

const EditConsultation = ({ patient, consultation }: { patient: IPatient; consultation: IConsultation }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit, reset } = useForm<IConsultationFormData>()

    useEffect(() => {
        reset({
            weight: consultation.weight,
            chief_complaint: consultation.chief_complaint,
            respiratory_system_symptoms: consultation.respiratory_system_symptoms ?? [],
            respiratory_system_others_note: consultation.respiratory_system_others_note ?? '',
            cardiovascular_symptoms: consultation.cardiovascular_symptoms ?? [],
            cardiovascular_others_note: consultation.cardiovascular_others_note ?? '',
            neurological_symptoms: consultation.neurological_symptoms ?? [],
            neurological_others_note: consultation.neurological_others_note ?? '',
            musculoskeletal_symptoms: consultation.musculoskeletal_symptoms ?? [],
            musculoskeletal_others_note: consultation.musculoskeletal_others_note ?? '',
            digestive_symptoms: consultation.digestive_symptoms ?? [],
            digestive_others_note: consultation.digestive_others_note ?? '',
            renal_reproductive_symptoms: consultation.renal_reproductive_symptoms ?? [],
            renal_reproductive_others_note: consultation.renal_reproductive_others_note ?? '',
            skin_symptoms: consultation.skin_symptoms ?? [],
            skin_others_note: consultation.skin_others_note ?? '',
            eye_symptoms: consultation.eye_symptoms ?? [],
            eye_others_note: consultation.eye_others_note ?? '',
            ear_symptoms: consultation.ear_symptoms ?? [],
            ear_others_note: consultation.ear_others_note ?? '',
            nose_symptoms: consultation.nose_symptoms ?? [],
            nose_others_note: consultation.nose_others_note ?? '',
            throat_symptoms: consultation.throat_symptoms ?? [],
            throat_others_note: consultation.throat_others_note ?? '',
            psycology_symptoms: consultation.psycology_symptoms ?? [],
            psycology_others_note: consultation.psycology_others_note ?? '',
            diagnosis: consultation.diagnosis ?? '',
            note: consultation.note ?? '',
            fee: consultation.fee,
        })
    }, [consultation])

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        router.put(`/patients/${patient.id}/consultations/${consultation.id}`, data as Record<string, any>, {
            onSuccess: () => {
                toast('Consultation updated!', { variant: 'success' })
                router.visit(`/patients/${patient.id}?tab=consultation`)
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <section className='h-screen flex flex-col'>
            <Head title="Edit Consultation" />
            <div className="flex items-center justify-between sticky top-0 bg-background p-4 z-1 border-b border-gray-300">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/patients/${patient.id}?tab=consultation`}
                        className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Consultation</h1>
                        <p className="text-md text-gray-500">
                            Patient: <span className="font-medium font-khmer">{patient.khmer_last_name} {patient.khmer_first_name}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="overflow-y-auto flex-1 bg-background p-6">
                <form onSubmit={onSubmit} noValidate>
                    <ConsultationForm control={control} />
                    <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <Link href={`/patients/${patient.id}?tab=consultation`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isProcessing}>Update Consultation</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditConsultation
