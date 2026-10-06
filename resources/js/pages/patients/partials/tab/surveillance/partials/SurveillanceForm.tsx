import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';
import {
  ISurveillance,
  ISurveillanceFormData,
} from '@/interfaces/ISurveillance';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import Autocomplete from '@/components/form/autocomplete';
import { O2_OPTIONS } from '@/config/surveillance';
import { useTranslation } from 'react-i18next';

type Props = {
  patientId: number;
  surveillance?: ISurveillance;
  defaultVisitId?: number | null;
  viewOnly?: boolean;
  onClose: () => void;
};

const SurveillanceForm = ({
  patientId,
  surveillance,
  defaultVisitId,
  viewOnly,
  onClose,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ISurveillanceFormData>({
    defaultValues: {
      visit_id: surveillance?.visit_id ?? defaultVisitId ?? undefined,
      systolic: surveillance?.systolic ?? null,
      diastolic: surveillance?.diastolic ?? null,
      pulse: surveillance?.pulse ?? null,
      temperature: surveillance?.temperature ?? null,
      rr: surveillance?.rr ?? null,
      spo2: surveillance?.spo2 ?? null,
      o2_supply: surveillance?.o2_supply ?? '',
      note: surveillance?.note ?? '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const options = {
      onSuccess: () => {
        onClose();
      },
      onError: (errors: Record<string, string>) => {
        const msg =
          Object.values(errors).join(', ') ||
          t('patients.surveillance.saveError');
        toast(msg, { variant: 'error' });
      },
      onFinish: () => setIsProcessing(false),
    };

    if (surveillance) {
      router.put(
        `/patients/${patientId}/surveillance/${surveillance.id}`,
        { ...data, visit_id: surveillance.visit_id },
        options,
      );
    } else {
      router.post(`/patients/${patientId}/surveillance`, { ...data }, options);
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="systolic"
              label={t('patients.surveillance.systolicLabel')}
              type="number"
              placeholder={t('patients.surveillance.systolicPlaceholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 300 } }}
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
                max: { value: 300, message: t('patients.shared.form.max', { max: 300 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="diastolic"
              label={t('patients.surveillance.diastolicLabel')}
              type="number"
              placeholder={t('patients.surveillance.diastolicPlaceholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 200 } }}
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
                max: { value: 200, message: t('patients.shared.form.max', { max: 200 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="pulse"
              label={t('patients.surveillance.pulseLabel')}
              type="number"
              placeholder={t('patients.surveillance.pulsePlaceholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 300 } }}
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
                max: { value: 300, message: t('patients.shared.form.max', { max: 300 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="temperature"
              label={t('patients.surveillance.temperatureLabel')}
              type="number"
              placeholder={t('patients.surveillance.temperaturePlaceholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 30, max: 45, step: '0.1' } }}
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 30, message: t('patients.shared.form.min', { min: 30 }) },
                max: { value: 45, message: t('patients.shared.form.max', { max: 45 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="rr"
              label={t('patients.surveillance.rrLabel')}
              type="number"
              placeholder={t('patients.surveillance.rrPlaceholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
                max: { value: 100, message: t('patients.shared.form.max', { max: 100 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="spo2"
              label={t('patients.surveillance.spo2Label')}
              type="number"
              placeholder={t('patients.surveillance.spo2Placeholder')}
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              rules={{
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
                max: { value: 100, message: t('patients.shared.form.max', { max: 100 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Autocomplete
              control={control}
              name="o2_supply"
              label={t('patients.surveillance.o2SupplyLabel')}
              options={O2_OPTIONS}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              control={control}
              name="note"
              label={t('common.note')}
              placeholder={t('patients.surveillance.notePlaceholder')}
              disabled={viewOnly}
              rules={{
                maxLength: {
                  value: 1000,
                  message: t('patients.surveillance.noteMaxLength'),
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="outlined" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={isProcessing}>
          {surveillance ? t('common.save') : t('common.create')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default SurveillanceForm;
