import { Box, DialogActions, DialogContent } from '@mui/material';
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder';
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration';

type AdministerFormData = {
  note: string;
};

interface AdministerDialogProps {
  order: IMedicationOrder;
  administration: IMedicationAdministration;
  visitId: number;
  onClose: () => void;
}

const AdministerDialog = ({
  order,
  administration,
  visitId,
  onClose,
}: AdministerDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit } = useForm<AdministerFormData>({
    defaultValues: { note: '' },
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
      `/visits/${visitId}/doses/${administration.id}/administer`,
      {
        ...data,
      },
      {
        onSuccess: () => {
          onClose();
          toast('Dose administered successfully.', { variant: 'success' });
        },
        onError: (errors) => {
          const message = Object.values(errors)[0];
          toast(
            typeof message === 'string'
              ? message
              : 'Unable to administer dose.',
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
          {/* Verification Checklist */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
            >
              <ShieldCheck size={16} color="#16a34a" />
              <Box sx={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                Verify Before Administering
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                fontSize: 13,
                color: '#1e293b',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: '#16a34a' }}>&#10003;</Box>
                <Box>
                  Medicine: <strong>{medicineName}</strong>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: '#16a34a' }}>&#10003;</Box>
                <Box>
                  Dose:{' '}
                  <strong>
                    {order.dosage} {order.unit}
                  </strong>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: '#16a34a' }}>&#10003;</Box>
                <Box>
                  Route: <strong>{order.route}</strong>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: '#16a34a' }}>&#10003;</Box>
                <Box>
                  Scheduled: <strong>{scheduledTime}</strong>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Notes */}
          <Input
            label="Notes (optional)"
            control={control}
            name="note"
            placeholder="Any observations..."
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing} variant="default">
          Confirm Administer
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AdministerDialog;
