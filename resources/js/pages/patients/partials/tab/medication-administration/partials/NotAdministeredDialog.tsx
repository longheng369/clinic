import { Box, DialogActions, DialogContent } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder';
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration';

type NotAdministeredFormData = {
  reason: string;
  note: string;
};

interface NotAdministeredDialogProps {
  order: IMedicationOrder;
  administration: IMedicationAdministration;
  visitId: number;
  variant: 'missed' | 'refused';
  onClose: () => void;
}

const MISSED_REASONS = [
  { value: 'Patient absent', label: 'Patient absent' },
  { value: 'Patient unavailable', label: 'Patient unavailable' },
  { value: 'Medication unavailable', label: 'Medication unavailable' },
  { value: 'Patient condition', label: 'Patient condition' },
  { value: 'Other', label: 'Other' },
];

const REFUSED_REASONS = [
  { value: 'Patient declined', label: 'Patient declined' },
  {
    value: 'Patient reported no pain/symptoms',
    label: 'Patient reported no pain/symptoms',
  },
  { value: 'Side effects concerns', label: 'Side effects concerns' },
  { value: 'Patient taking alternative', label: 'Patient taking alternative' },
  { value: 'Other', label: 'Other' },
];

const NotAdministeredDialog = ({
  order,
  administration,
  visitId,
  variant,
  onClose,
}: NotAdministeredDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const reasons = variant === 'missed' ? MISSED_REASONS : REFUSED_REASONS;
  const title =
    variant === 'missed' ? 'Record Missed Dose' : 'Record Refused Dose';
  const endpoint = variant === 'missed' ? 'missed' : 'refused';

  const { control, handleSubmit } = useForm<NotAdministeredFormData>({
    defaultValues: { reason: '', note: '' },
  });

  const medicineName = order.medicine?.name ?? 'Unknown';
  const scheduledTime = new Date(
    administration.scheduled_at,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    router.post(
      `/visits/${visitId}/doses/${administration.id}/${endpoint}`,
      {
        reason: data.reason,
        note: data.note || null,
      },
      {
        onSuccess: () => {
          onClose();
          toast(`Dose recorded as ${variant}.`, { variant: 'success' });
        },
        onError: (errors) => {
          const message = Object.values(errors)[0];
          toast(
            typeof message === 'string'
              ? message
              : `Unable to record ${variant} dose.`,
            { variant: 'error' },
          );
        },
        onFinish: () => setIsProcessing(false),
      },
    );
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Medication Summary */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: variant === 'missed' ? '#fffbeb' : '#faf5ff',
              border: `1px solid ${variant === 'missed' ? '#fde68a' : '#e9d5ff'}`,
            }}
          >
            <Box
              sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b', mb: 1 }}
            >
              {title}
            </Box>
            <Box
              sx={{
                fontSize: 13,
                color: '#475569',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Box>
                Medicine: <strong>{medicineName}</strong>
              </Box>
              <Box>
                Dose:{' '}
                <strong>
                  {order.dosage} {order.unit}
                </strong>
              </Box>
              <Box>
                Route: <strong>{order.route}</strong>
              </Box>
              <Box>
                Scheduled: <strong>{scheduledTime}</strong>
              </Box>
            </Box>
          </Box>

          {/* Reason */}
          <Select
            label="Reason"
            control={control}
            name="reason"
            options={reasons}
            rules={{ required: 'Please select a reason' }}
          />

          {/* Notes */}
          <Input
            label="Notes (optional)"
            control={control}
            name="note"
            placeholder="Additional details..."
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing} variant="destructive">
          Confirm {variant === 'missed' ? 'Missed' : 'Refused'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default NotAdministeredDialog;
