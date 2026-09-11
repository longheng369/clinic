import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import DateInput from '@/components/form/date';
import Textarea from '@/components/form/textarea';
import {
  IPatientVaccination,
  IPatientVaccinationFormData,
} from '@/interfaces/IPatientVaccination';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/components/toast';

interface VaccinationFormProps {
  patientId: number;
  vaccines: { id: number; name: string }[];
  vaccination?: IPatientVaccination;
  onClose: () => void;
}

const VaccinationForm = ({
  patientId,
  vaccines,
  vaccination,
  onClose,
}: VaccinationFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<IPatientVaccinationFormData>({
    defaultValues: {
      vaccine_id: vaccination?.vaccine?.id ?? null,
      dose_number: vaccination?.dose_number ?? null,
      administered_date: vaccination?.administered_date
        ? new Date(vaccination.administered_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      notes: vaccination?.notes ?? '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const options = {
      onSuccess: () => {
        onClose();
        toast(
          vaccination
            ? 'Vaccination updated!'
            : 'Vaccination recorded!',
          {
            variant: 'success',
            description: vaccination
              ? 'The vaccination has been updated.'
              : 'The vaccination has been recorded.',
          },
        );
      },
      onError: (errors: Record<string, string>) => {
        if (errors.vaccine_id) {
          toast('Unable to save vaccination', {
            variant: 'error',
            description: errors.vaccine_id,
          });
        }
      },
      onFinish: () => setIsProcessing(false),
    };

    if (vaccination) {
      router.put(
        `/patients/${patientId}/vaccinations/${vaccination.id}`,
        { ...data },
        options,
      );
    } else {
      router.post(
        `/patients/${patientId}/vaccinations`,
        { ...data },
        options,
      );
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={3}>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="vaccine_id"
              label="Vaccine"
              options={vaccines.map((v) => ({ value: v.id, label: v.name }))}
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="dose_number"
              label="Dose Number"
              type="number"
              placeholder="e.g. 1"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <DateInput
              control={control}
              name="administered_date"
              label="Date Administered"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea control={control} name="notes" label="Notes" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing} variant="contained">
          {vaccination ? 'Save' : 'Record'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default VaccinationForm;
