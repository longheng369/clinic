import { Box } from '@mui/material';
import { router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import IconButton from '@/components/button/iconButton';
import { Check, X, AlertTriangle } from 'lucide-react';
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration';
import DoseStatusBadge, { getEffectiveStatus } from './DoseStatusBadge';
import { formatCreatedDateTime } from '@/utils/date';

interface DoseRowProps {
  administration: IMedicationAdministration;
  visitId: number;
  orderStatus: string;
}

const DoseRow = ({ administration, visitId, orderStatus }: DoseRowProps) => {
  const { openAlert } = useModal();
  const effective = getEffectiveStatus(administration);
  const actionEnabled =
    orderStatus === 'active' &&
    (effective === 'pending' || effective === 'overdue');

  const handleProvide = () => {
    router.post(`/visits/${visitId}/doses/${administration.id}/administer`, {});
  };

  const handleMissed = () => {
    openAlert({
      message: 'Record as missed?',
      description: 'Select a reason for the missed dose.',
      variant: 'warning',
      confirmLabel: 'Patient absent',
      onConfirm: () =>
        router.post(`/visits/${visitId}/doses/${administration.id}/missed`, {
          reason: 'Patient absent',
        }),
    });
  };

  const handleRefused = () => {
    openAlert({
      message: 'Record as refused?',
      description: 'Select a reason the patient refused.',
      variant: 'warning',
      confirmLabel: 'Patient declined',
      onConfirm: () =>
        router.post(`/visits/${visitId}/doses/${administration.id}/refused`, {
          reason: 'Patient declined',
        }),
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2,
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ fontSize: 13, color: '#475569', minWidth: 36 }}>
          {administration.administration_no != null
            ? `#${administration.administration_no}`
            : ''}
        </Box>
        <Box sx={{ fontSize: 13, color: '#64748b', minWidth: 140 }}>
          {formatCreatedDateTime(administration.scheduled_at)}
        </Box>
        <DoseStatusBadge administration={administration} />
        {administration.status === 'provided' &&
          administration.administered_by && (
            <Box sx={{ fontSize: 13, color: '#64748b' }}>
              by {administration.administered_by}
              {administration.unit_price != null && (
                <Box component="span" sx={{ color: '#94a3b8' }}>
                  &nbsp;&mdash;&nbsp;$
                  {Number(administration.unit_price).toFixed(2)}
                </Box>
              )}
            </Box>
          )}
        {(administration.status === 'missed' ||
          administration.status === 'refused' ||
          administration.status === 'cancelled') &&
          administration.reason && (
            <Box sx={{ fontSize: 13, color: '#94a3b8' }}>
              &mdash; {administration.reason}
            </Box>
          )}
        {administration.note && (
          <Box sx={{ fontSize: 13, color: '#94a3b8' }}>
            {administration.note}
          </Box>
        )}
      </Box>
      {actionEnabled && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            onClick={handleProvide}
            aria-label="Provide dose"
            title="Provide"
          >
            <Check size={16} />
          </IconButton>
          <IconButton
            onClick={handleMissed}
            aria-label="Missed dose"
            title="Missed"
          >
            <AlertTriangle size={16} />
          </IconButton>
          <IconButton
            color="error"
            onClick={handleRefused}
            aria-label="Refused dose"
            title="Refused"
          >
            <X size={16} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DoseRow;
