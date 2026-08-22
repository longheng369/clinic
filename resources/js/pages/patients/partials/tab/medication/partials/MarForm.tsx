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
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { MEDICINE_ROUTE } from '@/config/mar';

const INTERVAL_OPTIONS = [
  { value: 'QD', label: 'QD (Once daily)' },
  { value: 'BID', label: 'BID (Twice daily)' },
  { value: 'TID', label: 'TID (Three times daily)' },
  { value: 'QID', label: 'QID (Four times daily)' },
  { value: 'QHS', label: 'QHS (At bedtime)' },
  { value: 'PRN', label: 'PRN (As needed)' },
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
  order?: IMedicationOrder;
  selectedVisitId?: number;
  onClose: () => void;
}

const MarForm = ({
  patientId,
  activeVisits,
  medicines,
  order,
  selectedVisitId,
  onClose,
}: MedicationFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
          route: order.route,
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
          route: '',
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
            toast('Medication updated!', { variant: 'success' });
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
            toast('Added to drug chart!', { variant: 'success' });
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
              label="Medicine"
              control={control}
              name="medicine_id"
              options={medicineOptions}
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              label="Route"
              control={control}
              name="route"
              options={MEDICINE_ROUTE}
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              label="Interval"
              control={control}
              name="interval"
              options={INTERVAL_OPTIONS}
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <NumberInput
              label="Dosage"
              control={control}
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              placeholder="e.g. 500"
              name="dosage"
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label="Unit"
              control={control}
              type="text"
              placeholder="e.g. mg, g, ml"
              name="unit"
              rules={{ required: 'Required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <NumberInput
              label="Duration (total doses)"
              control={control}
              slotProps={{ htmlInput: { min: 1, max: 365 } }}
              placeholder="e.g. 3"
              name="duration"
              rules={{
                required: 'Required',
                min: { value: 1, message: 'Min 1' },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label="Start Date & Time"
              control={control}
              type="datetime-local"
              name="starts_at"
              rules={{ required: 'Required' }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              label="Notes"
              control={control}
              name="notes"
              placeholder="Optional notes..."
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button type="button" onClick={() => onClose()} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing} variant="contained">
            {order ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Box>
  );
};

export default MarForm;
