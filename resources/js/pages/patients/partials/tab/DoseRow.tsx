import { Box } from '@mui/material';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      message: t('patients.vaccination.recordMissedTitle'),
      description: t('patients.vaccination.recordMissedDesc'),
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
      message: t('patients.vaccination.recordRefusedTitle'),
      description: t('patients.vaccination.recordRefusedDesc'),
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
            {t('patients.shared.by', { name: administration.administered_by })}
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
            aria-label={t('patients.vaccination.provideDose')}
            title={t('patients.vaccination.provide')}
          >
            <Check size={16} color="#15803d" />
          </IconButton>
          <IconButton
            onClick={handleMissed}
            aria-label={t('patients.vaccination.missedDose')}
            title={t('patients.shared.status.missed')}
          >
            <AlertTriangle size={16} color="#c2410c" />
          </IconButton>
          <IconButton
            color="error"
            onClick={handleRefused}
            aria-label={t('patients.vaccination.refusedDose')}
            title={t('patients.shared.status.refused')}
          >
            <X size={16} color="#7e22ce" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DoseRow;
