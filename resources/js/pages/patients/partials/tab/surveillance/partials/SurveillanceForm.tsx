import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import {
  ISurveillance,
  ISurveillanceFormData,
} from '@/interfaces/ISurveillance';
import { IOption } from '@/interfaces/IOption';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';

const O2_OPTIONS: IOption<string>[] = [
  { value: 'Room Air', label: 'Room Air' },
  { value: 'Nasal Cannula', label: 'Nasal Cannula' },
  { value: 'Face Mask', label: 'Face Mask' },
  { value: 'Non-Rebreather Mask', label: 'Non-Rebreather Mask' },
  { value: 'Ventilator', label: 'Ventilator' },
  { value: 'CPAP/BiPAP', label: 'CPAP/BiPAP' },
  { value: 'High Flow Nasal Cannula', label: 'High Flow Nasal Cannula' },
];

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
    },
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const options = {
      onSuccess: () => {
        onClose();
        toast(
          surveillance
            ? 'Surveillance record updated!'
            : 'Surveillance record created!',
          { variant: 'success' },
        );
      },
      onError: (errors: Record<string, string>) => {
        const msg =
          Object.values(errors).join(', ') ||
          'Failed to save surveillance record';
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
              label="Systolic (mmHg)"
              type="number"
              placeholder="e.g. 120"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 300 } }}
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 300, message: 'Max 300' },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="diastolic"
              label="Diastolic (mmHg)"
              type="number"
              placeholder="e.g. 80"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 200 } }}
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 200, message: 'Max 200' },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="pulse"
              label="Pulse (bpm)"
              type="number"
              placeholder="e.g. 72"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 300 } }}
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 300, message: 'Max 300' },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="temperature"
              label="Temperature (°C)"
              type="number"
              placeholder="e.g. 36.5"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 30, max: 45, step: '0.1' } }}
              rules={{
                required: 'Required',
                min: { value: 30, message: 'Min 30' },
                max: { value: 45, message: 'Max 45' },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="rr"
              label="RR (breaths/min)"
              type="number"
              placeholder="e.g. 16"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 100, message: 'Max 100' },
              }}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <Input
              control={control}
              name="spo2"
              label="SpO₂ (%)"
              type="number"
              placeholder="e.g. 98"
              disabled={viewOnly}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              rules={{
                required: 'Required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 100, message: 'Max 100' },
              }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Select
              control={control}
              name="o2_supply"
              label="O₂ Supply"
              options={O2_OPTIONS}
              disabled={viewOnly}
              rules={{ required: 'This field is required' }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isProcessing}>
          {surveillance ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default SurveillanceForm;
