import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import ConsultationForm from './partials/ConsultationForm';
import { useToast } from '@/components/toast';
import { IConsultationFormData } from '@/interfaces/IConsultation';
import type { IPatient } from '@/interfaces/IPatient';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';

const CreateConsultation = ({
  patient,
  visitId,
}: {
  patient: IPatient;
  visitId: number | null;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
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
      psychology_symptoms: [],
      psychology_others_note: '',
      diagnosis: '',
      note: '',
      fee: null,
    },
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    router.post(
      `/patients/${patient.id}/consultations`,
      { ...data, visit_id: visitId },
      {
        onSuccess: () => {
          toast('Consultation created!', { variant: 'success' });
          router.visit(
            `/patients/${patient.id}?visit=${visitId ?? ''}&tab=consultation`,
          );
        },
        onFinish: () => setIsProcessing(false),
      },
    );
  });

  return (
    <>
      <Head title="New Consultation" />
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            borderBottom: '1px solid #cbd5e1',
            bgcolor: '#fff',
            px: 4,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={() =>
              router.visit(`/patients/${patient.id}?tab=consultation`)
            }
            size="small"
            aria-label="Back"
            sx={{ color: 'text.secondary' }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              New Consultation
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', fontFamily: 'var(--font-khmer)' }}
            >
              {patient.khmer_last_name} {patient.khmer_first_name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box component="form" onSubmit={onSubmit} noValidate>
              <ConsultationForm control={control} />
              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  pt: 2,
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() =>
                    router.visit(`/patients/${patient.id}?tab=consultation`)
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isProcessing}
                >
                  Create Consultation
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CreateConsultation;
