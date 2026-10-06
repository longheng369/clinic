import { Box, Typography, Paper, Button, TextField } from '@mui/material';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { DollarSign, Receipt, CreditCard, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BillingData {
  consultation_fees: number;
  medication_costs: number;
  paraclinic_costs: number;
  prescription_costs: number;
  fee: number;
  paid_amount: number;
  balance: number;
  payment_status: string;
  payment_date: string | null;
}

type Props = {
  visitId: number;
};

const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  Unpaid: { label: 'patients.shared.status.unpaid', className: 'bg-red-100 text-red-700' },
  Partial: { label: 'patients.shared.status.partial', className: 'bg-amber-100 text-amber-700' },
  Paid: { label: 'patients.shared.status.paid', className: 'bg-green-100 text-green-700' },
};

const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

const BillingTab = ({ visitId }: Props) => {
  const { t } = useTranslation();
  const { billing } = usePage<{ billing: BillingData | null }>().props;

  const [paidAmount, setPaidAmount] = useState(billing?.paid_amount ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  if (!billing) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Receipt size={40} style={{ color: '#cbd5e1', marginBottom: 8 }} />
        <Box sx={{ fontSize: 18, fontWeight: 600, color: '#475569', mb: 1 }}>
          {t('patients.billing.noData')}
        </Box>
        <Box sx={{ color: '#94a3b8', fontSize: 14 }}>
          {t('patients.billing.selectVisit')}
        </Box>
      </Box>
    );
  }

  const computedTotal = billing.fee;
  const balance = computedTotal - paidAmount;
  const statusBadge =
    PAYMENT_STATUS[billing.payment_status] ?? PAYMENT_STATUS.Unpaid;

  const handleSave = () => {
    setIsSaving(true);
    router.patch(
      `/visits/${visitId}/billing`,
      {
        paid_amount: paidAmount,
      },
      {
        onFinish: () => setIsSaving(false),
      },
    );
  };

  const handleMarkPaid = () => {
    const total = billing.fee;
    setPaidAmount(total);
    setIsSaving(true);
    router.patch(
      `/visits/${visitId}/billing`,
      {
        paid_amount: total,
        payment_status: 'Paid',
      },
      {
        onFinish: () => setIsSaving(false),
      },
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
            {t('patients.billing.summary')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#94a3b8', mt: 0.5 }}>
            {t('patients.billing.subtitle')}
          </Typography>
        </Box>
        <Box
          className={statusBadge.className}
          sx={{
            display: 'inline-block',
            px: 2.5,
            py: 0.5,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {t(statusBadge.label)}
        </Box>
      </Box>

      {/* Breakdown */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: '#475569',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('patients.billing.chargeBreakdown')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                }}
              />
              <Typography sx={{ fontSize: 14, color: '#475569' }}>
                {t('patients.billing.consultationFees')}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
            >
              {formatCurrency(billing.consultation_fees)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                }}
              />
              <Typography sx={{ fontSize: 14, color: '#475569' }}>
                {t('patients.billing.medicationCosts')}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
            >
              {formatCurrency(billing.medication_costs)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#f59e0b',
                }}
              />
              <Typography sx={{ fontSize: 14, color: '#475569' }}>
                {t('patients.billing.paraclinicCosts')}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
            >
              {formatCurrency(billing.paraclinic_costs)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#8b5cf6',
                }}
              />
              <Typography sx={{ fontSize: 14, color: '#475569' }}>
                {t('patients.billing.prescriptionCosts')}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
            >
              {formatCurrency(billing.prescription_costs)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Totals */}
      <Box
        sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}
      >
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Calculator size={18} style={{ color: '#64748b' }} />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('patients.billing.totals')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                {t('patients.billing.fee')}
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
              >
                {formatCurrency(billing.fee)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CreditCard size={18} style={{ color: '#64748b' }} />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('patients.billing.payment')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                {t('patients.shared.status.paid')}
              </Typography>
              <TextField
                size="small"
                type="number"
                value={paidAmount || ''}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Typography
                        sx={{ mr: 0.5, color: '#94a3b8', fontSize: 14 }}
                      >
                        $
                      </Typography>
                    ),
                    sx: { fontSize: 14, width: 120 },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1.5,
                borderTop: '2px solid #e2e8f0',
              }}
            >
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}
              >
                {t('patients.billing.balance')}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: balance > 0 ? '#dc2626' : '#16a34a',
                }}
              >
                {formatCurrency(balance)}
              </Typography>
            </Box>
            {billing.payment_date && (
              <Typography sx={{ fontSize: 12, color: '#94a3b8', mt: 1 }}>
                {t('patients.billing.lastPayment')}{' '}
                {new Date(billing.payment_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<DollarSign size={16} />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {t('patients.billing.saveChanges')}
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={handleMarkPaid}
          disabled={isSaving}
        >
          {t('patients.billing.markFullyPaid')}
        </Button>
      </Box>
    </Box>
  );
};

export default BillingTab;
