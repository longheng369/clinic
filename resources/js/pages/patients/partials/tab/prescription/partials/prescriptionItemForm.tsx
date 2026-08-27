import { IPrescriptionItemFormData } from '@/interfaces/IPrescription';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import { Box, DialogActions, DialogContent, Grid, Button, Typography } from '@mui/material';
import Select from '@/components/form/select';
import { MEDICINE_INSTRUCTION } from '@/config/prescription';
import Autocomplete from '@/components/form/autocomplete';
import { MEDICINE_ROUTE } from '@/config/mar';
import { useModal } from '@/components/modal';

interface Props {
  onSave: (data: IPrescriptionItemFormData) => void;
  onClose: () => void;
  medicines: { id: number; name: string; unit?: { name: string } | null; dosage?: string | null }[];
  defaultValues?: IPrescriptionItemFormData;
}

type PrescriptionItemFormValues = Omit<
  IPrescriptionItemFormData,
  'medicine' | 'unit' | 'instruction'
> & {
  medicine: number | '';
  unit: string | '';
  instruction: string | null;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const PrescriptionItemForm: FC<Props> = ({
  onSave,
  medicines,
  defaultValues,
}) => {
  const { closeModal } = useModal();
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
        route: '',
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
      MEDICINE_INSTRUCTION.find((opt) => opt.value === values.instruction) ??
      null;

    if (!medicine) {
      return;
    }

    onSave({
      ...values,
      medicine,
      unit: { id: 0, name: values.unit || (medicine.unit?.name ?? '') },
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
              label="Medicine"
              options={medicines.map((medicine) => ({
                label: medicine.name,
                value: medicine.id,
              }))}
              rules={{ required: 'Medicine is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="route"
              label="Route"
              options={MEDICINE_ROUTE}
              rules={{ required: 'Route is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="quantity"
              label="Quantity"
              type="number"
              rules={{
                required: 'Quantity is required',
                min: { value: 1, message: 'Min 1' },
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
              Unit
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
              label="Morning"
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="afternoon"
              label="Afternoon"
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="evening"
              label="Evening"
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="night"
              label="Night"
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="numberOfDay"
              label="Number of Days"
              type="number"
              rules={{ valueAsNumber: true }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="instruction"
              label="Instruction"
              options={MEDICINE_INSTRUCTION}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input control={control} name="notes" label="Notes" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={closeModal} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          {defaultValues ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default PrescriptionItemForm;
