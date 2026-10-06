import { IPrescriptionItemFormData } from '@/interfaces/IPrescription';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import { Box, DialogActions, DialogContent, Grid, Button, Typography } from '@mui/material';
import Select from '@/components/form/select';
import { IOption } from '@/interfaces/IOption';
import Autocomplete from '@/components/form/autocomplete';
import { useModal } from '@/components/modal';
import { useTranslation } from 'react-i18next';

interface Props {
  onSave: (data: IPrescriptionItemFormData) => void;
  onClose: () => void;
  medicines: { id: number; name: string; unit?: { id: number; name: string } | null; dosage?: string | null }[];
  routes: { id: number; name: string }[];
  instructions: IOption<number>[];
  defaultValues?: IPrescriptionItemFormData;
}

type PrescriptionItemFormValues = Omit<
  IPrescriptionItemFormData,
  'medicine' | 'unit' | 'instruction'
> & {
  medicine: number | '';
  unit: string | '';
  instruction: number | null;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const PrescriptionItemForm: FC<Props> = ({
  onSave,
  medicines,
  routes,
  instructions,
  defaultValues,
}) => {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  const { control, handleSubmit, watch, setValue } = useForm<PrescriptionItemFormValues>({
    defaultValues: defaultValues
      ? {
        ...defaultValues,
        medicine: defaultValues.medicine?.id ?? '',
        unit: defaultValues.unit?.name ?? '',
        instruction: defaultValues.instruction?.value ?? null,
      }
      : {
        medicine: '',
        unit: '',
        route_id: null,
        notes: null,
        quantity: null,
        morning: null,
        afternoon: null,
        evening: null,
        night: null,
        numberOfDay: null,
        instruction: null,
      },
  });

  // Watch medicine changes to auto-set unit and dosage
  const medicineId = watch('medicine');
  useEffect(() => {
    if (medicineId) {
      const medicine = medicines.find((m) => m.id === medicineId);
      if (medicine) {
        setValue('unit', medicine.unit?.name ?? '', { shouldValidate: true });
        if (!watch('morning') && !watch('afternoon') && !watch('evening') && !watch('night')) {
          const medDosage = medicine.dosage ? parseFloat(medicine.dosage) : null;
          if (medDosage) setValue('morning', medDosage, { shouldValidate: true });
        }
      }
    } else {
      setValue('unit', '', { shouldValidate: true });
    }
  }, [medicineId, medicines, setValue, watch]);

  const onSubmit = (values: PrescriptionItemFormValues) => {
    const medicine = medicines.find((option) => option.id === values.medicine);
    const instruction =
      instructions.find((opt) => opt.value === values.instruction) ??
      null;

    if (!medicine) {
      return;
    }

    onSave({
      ...values,
      medicine,
      unit: medicine.unit ?? { id: 0, name: values.unit || '' },
      instruction,
      quantity: toNullableNumber(values.quantity),
      morning: toNullableNumber(values.morning),
      afternoon: toNullableNumber(values.afternoon),
      evening: toNullableNumber(values.evening),
      night: toNullableNumber(values.night),
      numberOfDay: toNullableNumber(values.numberOfDay),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ borderTop: 1, borderColor: 'divider' }}
    >
      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="medicine"
              label={t('patients.shared.form.medicine')}
              options={medicines.map((medicine) => ({
                label: medicine.name,
                value: medicine.id,
              }))}
              rules={{ required: t('patients.prescription.medicineRequired') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="route_id"
              label={t('patients.shared.form.route')}
              options={routes.map((route) => ({
                value: route.id,
                label: route.name,
              }))}
              rules={{ required: t('patients.prescription.routeRequired') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="quantity"
              label={t('patients.prescription.quantity')}
              type="number"
              rules={{
                required: t('patients.prescription.quantityRequired'),
                min: { value: 1, message: t('patients.shared.form.min', { min: 1 }) },
                valueAsNumber: true,
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.25rem',
              }}
            >
              {t('patients.shared.form.unit')}
            </label>
            <Typography variant="body1" color="text.secondary">
              {watch('unit') || '—'}
            </Typography>
            <input
              type="hidden"
              name="unit"
              value={watch('unit') || ''}
              onChange={(e) => setValue('unit', e.target.value)}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="morning"
              label={t('patients.prescription.morning')}
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="afternoon"
              label={t('patients.prescription.afternoon')}
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="evening"
              label={t('patients.prescription.evening')}
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="night"
              label={t('patients.prescription.night')}
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="numberOfDay"
              label={t('patients.prescription.numberOfDays')}
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="instruction"
              label={t('patients.prescription.instruction')}
              options={instructions}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input control={control} name="notes" label={t('patients.shared.form.notes')} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={closeModal} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {defaultValues ? t('common.save') : t('patients.prescription.add')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default PrescriptionItemForm;
