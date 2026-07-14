import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import ConsultationForm from './partials/ConsultationForm'
import { Button } from '@/components/ui/button'
import type { IConsultation, IConsultationFormData } from '@/interfaces/IConsultation'
import type { IPatient } from '@/interfaces/IPatient'

const ShowConsultation = ({ patient, consultation }: { patient: IPatient; consultation: IConsultation }) => {
    const { control, reset } = useForm<IConsultationFormData>()

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

    return (
        <>
            <Head title="Consultation Details" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/patients/${patient.id}?tab=consultation`}
                            className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
                            <p className="text-sm text-gray-500">
                                Patient: <span className="font-medium">{patient.khmer_last_name} {patient.khmer_first_name}</span>
                                &middot; {new Date(consultation.created_at).toLocaleString('en-US', {
                                    timeZone: 'Asia/Phnom_Penh',
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </p>
                        </div>
                    </div>
                    <Link href={`/patients/${patient.id}/consultations/${consultation.id}/edit`}>
                        <Button startIcon={<Pencil size={18} />}>Edit</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <ConsultationForm control={control} viewOnly />
                </div>
            </div>
        </>
    )
}

export default ShowConsultation
