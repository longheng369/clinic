import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useToast } from '@/components/toast';
import { useModal } from '@/components/modal';
import { DollarSign } from 'lucide-react';

type Props = {
  requestId: number;
  fee: number;
  currentPaymentStatus: string;
  currentPaidAmount?: number;
};

const ParaClinicPayment = ({ requestId, fee, currentPaymentStatus, currentPaidAmount = 0 }: Props) => {
  const { closeModal } = useModal();
  const { toast } = useToast();
  const [paidAmount, setPaidAmount] = useState(currentPaidAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  const remaining = fee - paidAmount;
  const newTotal = paidAmount;

  const getPaymentStatus = (amount: number) => {
    if (amount >= fee && fee > 0) return 'paid';
    if (amount > 0 && amount < fee) return 'partial';
    return 'unpaid';
  };

  const newStatus = getPaymentStatus(newTotal);

  const handleSubmit = () => {
    setIsProcessing(true);

    router.patch(
      `/para-clinic-requests/${requestId}/payment`,
      { paid_amount: newTotal },
      {
        onSuccess: () => {
          closeModal();
          toast('Payment updated successfully!', { variant: 'success' });
          router.reload({ only: ['paraClinicRequests'] });
        },
        onError: (errors) => {
          const msg = Object.values(errors).flat().join(', ');
          toast(msg || 'Failed to update payment.', { variant: 'error' });
        },
        onFinish: () => setIsProcessing(false),
      },
    );
  };

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Summary */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1.5,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <DollarSign size={24} color="text.secondary" />
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Total Fee
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                ${fee.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>

          {/* Payment Input */}
          <TextField
            label="Paid Amount"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            slotProps={{ htmlInput: { step: '0.01', min: '0', max: fee } }}
            fullWidth
            variant="standard"
          />

          {/* Status Preview */}
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Payment Status
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={newStatus === 'unpaid' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => setPaidAmount(0)}
              >
                Unpaid
              </Button>
              <Button
                size="small"
                variant={newStatus === 'partial' ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => setPaidAmount(fee / 2)}
              >
                Partial
              </Button>
              <Button
                size="small"
                variant={newStatus === 'paid' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => setPaidAmount(fee)}
              >
                Fully Paid
              </Button>
            </Stack>
          </Stack>

          {/* Breakdown */}
          <Stack spacing={1} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Total Fee
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                ${fee.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Amount Paid
              </Typography>
              <Typography variant="body2" fontWeight={500} color="success.main">
                ${paidAmount.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
              <Typography variant="body2" fontWeight={500} color={remaining > 0 ? 'error.main' : 'success.main'}>
                ${remaining.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} type="button" variant="outlined">
          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          Update Payment
        </Button>
      </DialogActions>
    </>
  );
};

export default ParaClinicPayment;
