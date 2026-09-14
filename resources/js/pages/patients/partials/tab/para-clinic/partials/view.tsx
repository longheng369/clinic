import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useToast } from '@/components/toast';
import { Skeleton } from '@mui/material';

interface ParaClinicRequestDetail {
  id: number;
  request_number: string;
  request_date: string;
  external_facility_name: string | null;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status: string;
  fee: number;
  payment_status: string;
  payment_date: string | null;
  tests: {
    id: number;
    test_name: string;
    test_category: string;
    priority: string;
    instruction: string | null;
    price: number;
  }[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'> = {
  Draft: 'default',
  Requested: 'info',
  'Waiting Result': 'warning',
  'Result Received': 'success',
  Reviewed: 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

type Props = {
  requestId: number;
};

const ParaClinicView = ({ requestId }: Props) => {
  const [data, setData] = useState<ParaClinicRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/para-clinic-requests/${requestId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setData)
      .catch(() => toast('Failed to load request details.', { variant: 'error' }))
      .finally(() => setIsLoading(false));
  }, [requestId, toast]);

  if (isLoading) {
    return (
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="rectangular" height={100} />
        </Stack>
      </DialogContent>
    );
  }

  if (!data) return null;

  return (
    <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {data.request_number}
            </Typography>
            <Chip
              size="small"
              label={data.status}
              color={STATUS_COLORS[data.status] ?? 'default'}
            />
            <Chip
              size="small"
              label={data.payment_status}
              variant="outlined"
              color={data.payment_status === 'Paid' ? 'success' : 'default'}
            />
          </Stack>
        </Grid>

        {/* General Info */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            General Information
          </Typography>
          <Divider sx={{ mb: 1 }} />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Request Date</Typography>
          <Typography variant="body2">{data.request_date}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Fee</Typography>
          <Typography variant="body2">${data.fee.toFixed(2)}</Typography>
        </Grid>
        {data.external_facility_name && (
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">External Facility</Typography>
            <Typography variant="body2">{data.external_facility_name}</Typography>
          </Grid>
        )}
        {data.payment_date && (
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">Payment Date</Typography>
            <Typography variant="body2">{data.payment_date}</Typography>
          </Grid>
        )}

        {/* Clinical Info */}
        {(data.provisional_diagnosis || data.clinical_reason || data.notes) && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Clinical Information
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            {data.provisional_diagnosis && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Provisional Diagnosis</Typography>
                <Typography variant="body2">{data.provisional_diagnosis}</Typography>
              </Grid>
            )}
            {data.clinical_reason && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Clinical Reason</Typography>
                <Typography variant="body2">{data.clinical_reason}</Typography>
              </Grid>
            )}
            {data.notes && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Notes</Typography>
                <Typography variant="body2">{data.notes}</Typography>
              </Grid>
            )}
          </>
        )}

        {/* Tests */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Diagnostic Tests ({data.tests.length})
          </Typography>
          <Divider sx={{ mb: 1 }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Stack spacing={1}>
            {data.tests.map((test) => (
              <Box
                key={test.id}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <Typography variant="body2" fontWeight={500}>
                      {test.test_name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label={test.priority} variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                      <Typography variant="caption" color="text.secondary">
                        {test.test_category}
                      </Typography>
                    </Stack>
                    {test.instruction && (
                      <Typography variant="caption" color="text.secondary">
                        Instruction: {test.instruction}
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="body2" fontWeight={500}>
                    ${test.price.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Meta */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" spacing={2}>
            {data.created_by && (
              <Typography variant="caption" color="text.secondary">
                Created by {data.created_by}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {data.created_at}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default ParaClinicView;
