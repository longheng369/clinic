import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import DateInput from '@/components/form/date';
import Textarea from '@/components/form/textarea';
import {
  IPatientVaccination,
  IPatientVaccinationFormData,
  IVaccineOption,
} from '@/interfaces/IPatientVaccination';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/toast';
import { useTranslation } from 'react-i18next';

interface VaccinationFormProps {
  patientId: number;
  vaccines: IVaccineOption[];
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
  const { t } = useTranslation();
  const { control, handleSubmit, watch, setValue } = useForm<IPatientVaccinationFormData>({
    defaultValues: {
      vaccine_id: vaccination?.vaccine?.id ?? null,
      dose_number: vaccination?.dose_number ?? null,
      administered_date: vaccination?.administered_date
        ? new Date(vaccination.administered_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      notes: vaccination?.notes ?? '',
    },
  });

  const selectedVaccineId = watch('vaccine_id');

  useEffect(() => {
    if (vaccination) {
      return;
    }

    const selected = vaccines.find((v) => v.id === selectedVaccineId);
    if (selected) {
      setValue('dose_number', selected.next_dose_number ?? 1);
    }
  }, [selectedVaccineId, vaccines, vaccination, setValue]);

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const options = {
      onSuccess: () => {
        onClose();
      },
      onError: (errors: Record<string, string>) => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast(t('patients.vaccination.saveError'), {
            variant: 'error',
            description: firstError,
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
              label={t('patients.vaccination.vaccineLabel')}
              options={vaccines.map((v) => ({ value: v.id, label: v.name }))}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="dose_number"
              label={t('patients.vaccination.doseNumberLabel')}
              type="number"
              placeholder={t('patients.vaccination.dosePlaceholder')}
              rules={{
                required: t('common.required'),
                validate: (value, form) => {
                  const vaccine = vaccines.find(
                    (v) => v.id === form.vaccine_id,
                  );
                  if (!vaccine || value === null) return true;
                  const dose = Number(value);

                  const isSameVaccine =
                    vaccination?.vaccine?.id === vaccine.id;
                  const isHighestSelf =
                    isSameVaccine &&
                    vaccination !== undefined &&
                    vaccination.dose_number >= vaccine.doses_completed;
                  const highestDose = isHighestSelf
                    ? vaccination.dose_number - 1
                    : vaccine.doses_completed;

                  if (dose <= highestDose) {
                    return t('patients.vaccination.doseTooLow', {
                      highestDose,
                    });
                  }
                  if (vaccine.total_doses > 0 && dose > vaccine.total_doses) {
                    return t('patients.vaccination.doseTooHigh', {
                      total_doses: vaccine.total_doses,
                    });
                  }
                  return true;
                },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <DateInput
              control={control}
              name="administered_date"
              label={t('patients.vaccination.dateAdministeredLabel')}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              control={control}
              name="notes"
              label={t('patients.shared.form.notes')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isProcessing} variant="contained">
          {vaccination ? t('common.save') : t('patients.vaccination.record')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default VaccinationForm;
