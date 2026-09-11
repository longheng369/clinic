import { Box, DialogContent } from '@mui/material';
import { Button } from '@/components/ui/button';
import DoseStatusBadge from '../../DoseStatusBadge';
import { formatCreatedDateTime } from '@/utils/date';
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder';

interface AdministrationHistoryDialogProps {
  order: IMedicationOrder;
  onClose: () => void;
}

const AdministrationHistoryDialog = ({
  order,
  onClose,
}: AdministrationHistoryDialogProps) => {
  const sortedAdmins = [...order.administrations].sort(
    (a, b) =>
      new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
  );

  const givenCount = sortedAdmins.filter((a) => a.status === 'provided').length;
  const missedCount = sortedAdmins.filter((a) => a.status === 'missed').length;
  const refusedCount = sortedAdmins.filter(
    (a) => a.status === 'refused',
  ).length;

  return (
    <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Summary */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: 12,
              color: '#166534',
            }}
          >
            <strong>{givenCount}</strong> Given
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: '#fffbeb',
              border: '1px solid #fde68a',
              fontSize: 12,
              color: '#92400e',
            }}
          >
            <strong>{missedCount}</strong> Missed
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: '#faf5ff',
              border: '1px solid #e9d5ff',
              fontSize: 12,
              color: '#6b21a8',
            }}
          >
            <strong>{refusedCount}</strong> Refused
          </Box>
        </Box>

        {/* Administration List */}
        {sortedAdmins.length === 0 ? (
          <Box
            sx={{ textAlign: 'center', py: 4, color: '#94a3b8', fontSize: 13 }}
          >
            No administration records yet.
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sortedAdmins.map((admin) => {
              return (
                <Box
                  key={admin.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 1,
                    borderBottom: '1px solid #f1f5f9',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ fontSize: 12, color: '#94a3b8', minWidth: 28 }}>
                      {admin.administration_no != null
                        ? `#${admin.administration_no}`
                        : ''}
                    </Box>
                    <Box sx={{ fontSize: 13, color: '#475569', minWidth: 130 }}>
                      {formatCreatedDateTime(admin.scheduled_at)}
                    </Box>
                    <DoseStatusBadge administration={admin} />
                    {admin.administered_at && (
                      <Box sx={{ fontSize: 12, color: '#94a3b8' }}>
                        at{' '}
                        {new Date(admin.administered_at).toLocaleTimeString(
                          'en-US',
                          { hour: '2-digit', minute: '2-digit', hour12: false },
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    {admin.status === 'provided' && admin.administered_by && (
                      <Box sx={{ fontSize: 12, color: '#64748b' }}>
                        by {admin.administered_by}
                        {admin.unit_price != null && (
                          <Box component="span" sx={{ color: '#94a3b8' }}>
                            &nbsp;&mdash;&nbsp;$
                            {Number(admin.unit_price).toFixed(2)}
                          </Box>
                        )}
                      </Box>
                    )}
                    {(admin.status === 'missed' ||
                      admin.status === 'refused' ||
                      admin.status === 'cancelled') &&
                      admin.reason && (
                      <Box sx={{ fontSize: 12, color: '#94a3b8' }}>
                          &mdash; {admin.reason}
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </Box>
      </Box>
    </DialogContent>
  );
};

export default AdministrationHistoryDialog;
