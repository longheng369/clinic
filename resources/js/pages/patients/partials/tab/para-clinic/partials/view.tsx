import { useEffect, useState } from 'react';
import { Chip, DialogContent, Stack, CircularProgress } from '@mui/material';
import { useToast } from '@/components/toast';
import { IParaClinicRequest } from '@/interfaces/IParaClinicRequest';

type Props = {
  requestId: number;
};

const STATUS_OPTIONS: Record<string, string> = {
  draft: 'Draft',
  requested: 'Requested',
  waiting_result: 'Waiting Result',
  result_received: 'Result Received',
  reviewed: 'Reviewed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'> = {
  draft: 'default',
  requested: 'info',
  waiting_result: 'warning',
  result_received: 'success',
  reviewed: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const ParaClinicView = ({ requestId }: Props) => {
  const [data, setData] = useState<IParaClinicRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/para-clinic-requests/${requestId}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
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
  }, [requestId, toast]);

  if (isLoading) {
    return (
      <DialogContent dividers>
        <Stack sx={{ alignItems: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      </DialogContent>
    );
  }

  if (!data) return null;

  const tests = data.tests ?? [];
  const totalFee = tests.reduce((sum, t) => sum + (t.price ?? 0), 0) || (data.fee ?? 0);

  return (
    <DialogContent dividers>
      <Stack spacing={3}>
        <Chip
          size="small"
          label={STATUS_OPTIONS[data.status] ?? data.status}
          color={STATUS_COLORS[data.status] ?? 'default'}
          sx={{ fontWeight: 500, alignSelf: 'flex-start' }}
        />

        <p className="text-base font-semibold">General Information</p>

        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <p className="text-xs text-gray-500">Request Date & Time</p>
            <p className="text-sm text-gray-900">{data.request_date || '—'}</p>
          </div>

          <div className="border-b border-gray-200 pb-2">
            <p className="text-xs text-gray-500">Diagnosis</p>
            <p className="text-sm text-gray-900">{data.provisional_diagnosis || '—'}</p>
          </div>

          <div className="border-b border-gray-200 pb-2">
            <p className="text-xs text-gray-500">Clinical Reason</p>
            <p className="text-sm text-gray-900">{data.clinical_reason || '—'}</p>
          </div>

          <div className="border-b border-gray-200 pb-2">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-sm text-gray-900">{data.notes || '—'}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">Diagnostic Tests</p>
          {tests.length > 0 ? (
            <Stack spacing={1}>
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between rounded border border-gray-200 px-3 py-2"
                >
                  <span className="text-sm">{test.test_name}</span>
                  <span className="text-sm font-medium">
                    ${test.price?.toFixed(2) ?? '0.00'}
                  </span>
                </div>
              ))}
            </Stack>
          ) : (
            <p className="text-sm text-gray-900">—</p>
          )}
        </div>

        <p className="text-base font-semibold pt-1 border-t border-gray-200">
          Total: ${totalFee.toFixed(2)}
        </p>
      </Stack>
    </DialogContent>
  );
};

export default ParaClinicView;
