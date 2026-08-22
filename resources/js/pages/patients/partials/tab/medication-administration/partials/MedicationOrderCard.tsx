import { Box } from '@mui/material';
import { router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Clock, History, StopCircle, AlertTriangle } from 'lucide-react';
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder';
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration';
import { getEffectiveStatus } from '../../DoseStatusBadge';
import { formatCreatedDateTime } from '@/utils/date';

interface MedicationOrderCardProps {
  order: IMedicationOrder;
  visitId: number;
  onAdminister: (
    order: IMedicationOrder,
    administration: IMedicationAdministration,
  ) => void;
  onNotAdministered: (
    order: IMedicationOrder,
    administration: IMedicationAdministration,
    variant: 'missed' | 'refused',
  ) => void;
  onViewHistory: (order: IMedicationOrder) => void;
}

function getNextAvailableInfo(order: IMedicationOrder): {
  lastGiven: string | null;
  nextAvailable: string | null;
  hasPending: boolean;
  nextAdmin: IMedicationAdministration | null;
} {
  const sorted = [...order.administrations].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
  );

  const provided = sorted.filter((a) => a.status === 'provided');
  const lastGiven =
    provided.length > 0
      ? (provided[provided.length - 1].administered_at ??
        provided[provided.length - 1].scheduled_at)
      : null;

  const pending = sorted.filter(
    (a) =>
      getEffectiveStatus(a) === 'pending' ||
      getEffectiveStatus(a) === 'overdue',
  );
  const nextAdmin = pending.length > 0 ? pending[0] : null;
  const nextAvailable = nextAdmin ? nextAdmin.scheduled_at : null;

  return {
    lastGiven: lastGiven ? formatCreatedDateTime(lastGiven) : null,
    nextAvailable: nextAvailable ? formatCreatedDateTime(nextAvailable) : null,
    hasPending: pending.length > 0,
    nextAdmin,
  };
}

const MedicationOrderCard = ({
  order,
  visitId,
  onAdminister,
  onNotAdministered,
  onViewHistory,
}: MedicationOrderCardProps) => {
  const { openAlert } = useModal();
  const medicineName = order.medicine?.name ?? 'Unknown';
  const { lastGiven, nextAvailable, hasPending, nextAdmin } =
    getNextAvailableInfo(order);

  const isActive = order.status === 'active';
  const isOnHold = order.status === 'on_hold';
  const isStopped = order.status === 'stopped';
  const isCompleted = order.status === 'completed';

  const handleStop = () => {
    openAlert({
      message: `Stop ${medicineName}?`,
      description: 'All pending doses will be cancelled.',
      variant: 'danger',
      confirmLabel: 'Stop',
      onConfirm: () =>
        router.post(`/visits/${visitId}/medications/${order.id}/stop`, {}),
    });
  };

  const handleResume = () => {
    router.post(`/visits/${visitId}/medications/${order.id}/resume`, {});
  };

  const handleAdministerClick = () => {
    if (nextAdmin) {
      onAdminister(order, nextAdmin);
    }
  };

  const handleMissedClick = () => {
    if (nextAdmin) {
      onNotAdministered(order, nextAdmin, 'missed');
    }
  };

  const handleRefusedClick = () => {
    if (nextAdmin) {
      onNotAdministered(order, nextAdmin, 'refused');
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        bgcolor: '#fff',
        overflow: 'hidden',
        opacity: isStopped ? 0.6 : 1,
      }}
    >
      {/* Card Header */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Medicine name + status */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}
            >
              <Box sx={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>
                {medicineName}
              </Box>
              <StatusChip status={order.status} />
            </Box>
            {/* Dosage / Route / Interval */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                color: '#64748b',
                fontSize: 13,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                {order.dosage} {order.unit}
              </Box>
              <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
              <Box>{order.route}</Box>
              <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
              <Box>{order.interval}</Box>
            </Box>
            {order.notes && (
              <Box sx={{ fontSize: 12, color: '#94a3b8', mt: 0.5 }}>
                {order.notes}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Timing Info */}
      <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={14} color="#94a3b8" />
          <Box sx={{ fontSize: 12, color: '#94a3b8' }}>Last:</Box>
          <Box
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: lastGiven ? '#1e293b' : '#94a3b8',
            }}
          >
            {lastGiven ?? 'Not given'}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={14} color={hasPending ? '#3b82f6' : '#94a3b8'} />
          <Box sx={{ fontSize: 12, color: '#94a3b8' }}>Next:</Box>
          <Box
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: hasPending ? '#1e293b' : '#94a3b8',
            }}
          >
            {nextAvailable ??
              (isCompleted
                ? 'Completed'
                : isStopped
                  ? 'Stopped'
                  : 'None scheduled')}
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {isActive && hasPending && (
          <>
            <Button variant="default" size="sm" onClick={handleAdministerClick}>
              Administer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMissedClick}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <AlertTriangle size={14} /> Missed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefusedClick}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              Refused
            </Button>
          </>
        )}
        {isActive && !hasPending && (
          <Box sx={{ fontSize: 12, color: '#94a3b8' }}>No pending doses</Box>
        )}
        {isOnHold && (
          <Button variant="outline" size="sm" onClick={handleResume}>
            Resume
          </Button>
        )}
        {isCompleted && (
          <Box sx={{ fontSize: 12, color: '#3b82f6' }}>Treatment completed</Box>
        )}
        <Box sx={{ flex: 1 }} />
        <Button variant="ghost" size="sm" onClick={() => onViewHistory(order)}>
          <History size={14} /> History
        </Button>
        {(isActive || isOnHold) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
            className="text-red-600 hover:bg-red-50"
          >
            <StopCircle size={14} /> Stop
          </Button>
        )}
      </Box>
    </Box>
  );
};

function StatusChip({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700' },
    stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
  };
  const badge = config[status] ?? config.active;

  return (
    <Box
      className={badge.className}
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.125,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 500,
      }}
    >
      {badge.label}
    </Box>
  );
}

export default MedicationOrderCard;
