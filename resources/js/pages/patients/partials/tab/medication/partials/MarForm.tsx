import { Box, DialogActions, DialogContent, Grid, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import NumberInput from '@/components/form/number';
import Select from '@/components/form/select';
import {
  IMedicationOrder,
  IMedicationOrderFormData,
} from '@/interfaces/IMedicationOrder';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

const INTERVAL_OPTIONS = [
  { value: 'QD', label: 'patients.medication.interval.qd' },
  { value: 'BID', label: 'patients.medication.interval.bid' },
  { value: 'TID', label: 'patients.medication.interval.tid' },
  { value: 'QID', label: 'patients.medication.interval.qid' },
  { value: 'QHS', label: 'patients.medication.interval.qhs' },
  { value: 'PRN', label: 'patients.medication.interval.prn' },
];

interface MedicationFormProps {
  patientId: number;
  activeVisits: {
    id: number;
    type: string;
    visit_date: string;
    created_by?: string;
  }[];
  medicines: { id: number; name: string }[];
  routes: { id: number; name: string }[];
  order?: IMedicationOrder;
  selectedVisitId?: number;
  onClose: () => void;
}

const MarForm = ({
  patientId,
  activeVisits,
  medicines,
  routes,
  order,
  selectedVisitId,
  onClose,
}: MedicationFormProps) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultStartsAt = now.toISOString().slice(0, 16);

  const getStartsAtValue = () => {
    if (order?.starts_at) {
      const d = new Date(order.starts_at);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }
    return defaultStartsAt;
  };

  const { control, handleSubmit } = useForm<IMedicationOrderFormData>({
    defaultValues: order
      ? {
        visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
        medicine_id: order.medicine?.id ?? null,
        route_id: order.route?.id ?? null,
        dosage: order.dosage,
        unit: order.unit,
        interval: order.interval,
        duration: order.duration,
        starts_at: getStartsAtValue(),
        notes: order.notes ?? '',
      }
      : {
        visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
        medicine_id: null,
        route_id: null,
        dosage: null,
        unit: '',
        interval: '',
        duration: null,
        starts_at: defaultStartsAt,
        notes: '',
      },
  });

  const medicineOptions = medicines.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);

    if (order) {
      router.put(
        `/patients/${patientId}/medications/${order.id}`,
        { ...data },
        {
          onSuccess: () => {
            onClose();
          },
          onFinish: () => setIsProcessing(false),
        },
      );
    } else {
      router.post(
        `/patients/${patientId}/medications`,
        { ...data },
        {
          onSuccess: () => {
            onClose();
          },
          onFinish: () => setIsProcessing(false),
        },
      );
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={3}>
          <Grid size={{ md: 6 }}>
            <Select
              label={t('patients.shared.form.medicine')}
              control={control}
              name="medicine_id"
              options={medicineOptions}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              label={t('patients.shared.form.route')}
              control={control}
              name="route_id"
              options={routes.map((route) => ({
                value: route.id,
                label: route.name,
              }))}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              label={t('patients.shared.form.interval')}
              control={control}
              name="interval"
              options={INTERVAL_OPTIONS.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <NumberInput
              label={t('patients.medication.dosage')}
              control={control}
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              placeholder={t('patients.medication.dosagePlaceholder')}
              name="dosage"
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 0, message: t('patients.shared.form.min', { min: 0 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label={t('patients.shared.form.unit')}
              control={control}
              type="text"
              placeholder={t('patients.medication.unitPlaceholder')}
              name="unit"
              rules={{ required: t('patients.shared.form.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <NumberInput
              label={t('patients.medication.duration')}
              control={control}
              slotProps={{ htmlInput: { min: 1, max: 365 } }}
              placeholder={t('patients.medication.durationPlaceholder')}
              name="duration"
              rules={{
                required: t('patients.shared.form.required'),
                min: { value: 1, message: t('patients.shared.form.min', { min: 1 }) },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label={t('patients.medication.startsAt')}
              control={control}
              type="datetime-local"
              name="starts_at"
              rules={{ required: t('patients.shared.form.required') }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              label={t('patients.shared.form.notes')}
              control={control}
              name="notes"
              placeholder={t('patients.medication.notesPlaceholder')}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button type="button" onClick={() => onClose()} variant="outlined">
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isProcessing} variant="contained">
            {order ? t('common.save') : t('common.create')}
          </Button>
        </DialogActions>
      </DialogContent>
    </Box>
  );
};

export default MarForm;
