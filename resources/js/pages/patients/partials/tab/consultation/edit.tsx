import { Head, router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import ConsultationForm from './partials/ConsultationForm'
import { useToast } from '@/components/toast'
import { type IConsultation, type IConsultationFormData } from '@/interfaces/IConsultation'
import type { IPatient } from '@/interfaces/IPatient'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'

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
      router.put(`/patients/${patient.id}/consultations/${consultation.id}`, { ...data }, {
         onSuccess: () => {
            toast('Consultation updated!', { variant: 'success' })
            router.visit(`/patients/${patient.id}?tab=consultation`)
         },
         onFinish: () => setIsProcessing(false),
      })
   })

   return (
      <>
         <Head title="Edit Consultation" />
         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff', px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
               <IconButton
                  onClick={() => router.visit(`/patients/${patient.id}?tab=consultation`)}
                  size="small"
                  aria-label="Back"
                  sx={{ color: 'text.secondary' }}
               >
                  <ArrowLeft size={20} />
               </IconButton>
               <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Edit Consultation</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                     Patient: <Box component="span" sx={{ fontWeight: 500, fontFamily: 'var(--font-khmer)' }}>
                        {patient.khmer_last_name} {patient.khmer_first_name}
                     </Box>
                  </Typography>
               </Box>
            </Box>

            <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
               <Paper variant="outlined" sx={{ p: 3 }}>
                  <Box component="form" onSubmit={onSubmit} noValidate>
                     <ConsultationForm control={control} />
                     <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 2 }}>
                        <Button
                           type="button"
                           variant="outlined"
                           onClick={() => router.visit(`/patients/${patient.id}?tab=consultation`)}
                        >
                           Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isProcessing}>
                           Update Consultation
                        </Button>
                     </Box>
                  </Box>
               </Paper>
            </Box>
         </Box>
      </>
   )
}

export default EditConsultation
