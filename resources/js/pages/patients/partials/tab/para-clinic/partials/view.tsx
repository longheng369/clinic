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
import {
  FileText,
  Stethoscope,
  TestTube,
  User,
  Clock,
} from 'lucide-react';

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

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Grid size={{ xs: 12 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      {icon}
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
    <Divider sx={{ mb: 1.5 }} />
  </Grid>
);

const Field = ({ label, value, span = 6 }: { label: string; value: React.ReactNode; span?: number }) => (
  <Grid size={{ xs: span }}>
    <Typography variant="caption" color="text.secondary" fontWeight={500}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.25 }}>
      {value || '—'}
    </Typography>
  </Grid>
);

const ParaClinicView = ({ requestId }: Props) => {
  const [data, setData] = useState<ParaClinicRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`/para-clinic-requests/${requestId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          toast('Failed to load request details.', { variant: 'error' });
        }
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [requestId]);

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

  const totalFee = data.tests.reduce((sum, t) => sum + t.price, 0);

  return (
    <DialogContent sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
      <Grid container spacing={2.5}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h6" fontWeight={700}>
              {data.request_number}
            </Typography>
            <Chip
              size="small"
              label={data.status}
              color={STATUS_COLORS[data.status] ?? 'default'}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              size="small"
              label={data.payment_status}
              variant="outlined"
              color={data.payment_status === 'Paid' ? 'success' : 'default'}
              sx={{ fontWeight: 500 }}
            />
          </Stack>
        </Grid>

        {/* General Info */}
        <SectionHeader icon={<FileText size={16} color="text.secondary" />} title="General Information" />
        <Field label="Request Date & Time" value={data.request_date} />
        <Field label="Fee" value={`$${data.fee.toFixed(2)}`} />
        <Field
          label="External Facility"
          value={data.external_facility_name}
        />
        <Field
          label="Payment Date"
          value={data.payment_date}
        />

        {/* Clinical Info */}
        <SectionHeader icon={<Stethoscope size={16} color="text.secondary" />} title="Clinical Information" />
        <Field
          label="Provisional Diagnosis"
          value={data.provisional_diagnosis}
          span={data.clinical_reason || data.notes ? 6 : 12}
        />
        <Field
          label="Clinical Reason"
          value={data.clinical_reason}
          span={data.provisional_diagnosis || data.notes ? 6 : 12}
        />
        {data.notes && (
          <Field label="Notes" value={data.notes} span={12} />
        )}

        {/* Diagnostic Tests */}
        <SectionHeader icon={<TestTube size={16} color="text.secondary" />} title={`Diagnostic Tests (${data.tests.length})`} />
        <Grid size={{ xs: 12 }}>
          <Stack spacing={1}>
            {data.tests.map((test, index) => (
              <Box
                key={test.id}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  bgcolor: 'grey.50',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {index + 1}. {test.test_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {test.test_category}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600} color="primary.main">
                    ${test.price.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'primary.50',
              borderRadius: 1.5,
              border: 1,
              borderColor: 'primary.200',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600} color="primary.main">
                Total ({data.tests.length} tests)
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">
                ${totalFee.toFixed(2)}
              </Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Meta */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" spacing={2} alignItems="center">
            {data.created_by && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <User size={12} color="text.secondary" />
                <Typography variant="caption" color="text.secondary">
                  {data.created_by}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Clock size={12} color="text.secondary" />
              <Typography variant="caption" color="text.secondary">
                {data.created_at}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default ParaClinicView;
