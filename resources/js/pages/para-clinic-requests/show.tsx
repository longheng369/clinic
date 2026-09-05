import { Head, Link, router } from '@inertiajs/react';
import { IParaClinicRequest } from '@/interfaces/IParaClinicRequest';
import {
  ArrowLeft,
  FileText,
  Image,
  File,
  Upload,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useModal } from '@/components/modal';
import { useToast } from '@/components/toast';

const STATUS_COLORS: Record<
  string,
  'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'
> = {
  Draft: 'default',
  Requested: 'info',
  'Waiting Result': 'warning',
  'Result Received': 'success',
  Reviewed: 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

const PAYMENT_COLORS: Record<
  string,
  'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'
> = { Unpaid: 'error', Partial: 'warning', Paid: 'success' };

const STATUS_TRANSITIONS: Record<string, string[]> = {
  Draft: ['Requested', 'Cancelled'],
  Requested: ['Waiting Result', 'Cancelled'],
  'Waiting Result': ['Result Received', 'Cancelled'],
  'Result Received': ['Reviewed', 'Completed'],
  Reviewed: ['Completed'],
  Completed: [],
  Cancelled: [],
};

const fileIcon = (mime: string) =>
  mime.startsWith('image/') ? (
    <Image size={20} color="#1976d2" />
  ) : mime.includes('pdf') ? (
    <FileText size={20} color="#d32f2f" />
  ) : (
    <File size={20} color="#757575" />
  );

const formatSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const Show = ({ request }: { request: IParaClinicRequest }) => {
  const { openAlert } = useModal();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    router.post(`/para-clinic-requests/${request.id}/attachments`, formData, {
      onSuccess: () =>
        toast('File uploaded successfully!', { variant: 'success' }),
      onError: (err) =>
        toast(Object.values(err).join(', ') || 'Upload failed', {
          variant: 'error',
        }),
      onFinish: () => setIsUploading(false),
    });
    e.target.value = '';
  };

  const handleDeleteAttachment = (a: { id: number; file_name: string }) =>
    openAlert({
      message: `Delete ${a.file_name}?`,
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () =>
        router.delete(
          `/para-clinic-requests/${request.id}/attachments/${a.id}`,
        ),
    });

  const handleStatusChange = (status: string) =>
    router.patch(
      `/para-clinic-requests/${request.id}/status`,
      { status },
      {
        onSuccess: () =>
          toast(`Status updated to ${status}`, { variant: 'success' }),
      },
    );

  const handleMarkPaid = () =>
    router.patch(
      `/para-clinic-requests/${request.id}/payment`,
      { payment_status: 'Paid' },
      {
        onSuccess: () =>
          toast('Payment status updated to Paid', { variant: 'success' }),
      },
    );

  const transitions = STATUS_TRANSITIONS[request.status] ?? [];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Head title={`Request ${request.request_number}`} />
      <Box
        sx={{
          borderBottom: '1px solid #cbd5e1',
          bgcolor: '#fff',
          px: 4,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/para-clinic-requests">
            <IconButton aria-label="Back to para clinic requests" size="small" sx={{ color: 'text.secondary' }}>
              <ArrowLeft size={20} />
            </IconButton>
          </Link>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {request.request_number}
              </Typography>
              <Chip
                size="small"
                label={request.status}
                color={STATUS_COLORS[request.status] ?? 'default'}
              />
              <Chip
                size="small"
                label={request.payment_status}
                color={PAYMENT_COLORS[request.payment_status] ?? 'default'}
              />
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {request.request_date} · Created by {request.created_by ?? 'N/A'}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {request.status !== 'Completed' &&
            request.status !== 'Cancelled' && (
            <>
              {request.status === 'Waiting Result' && (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<Upload size={16} />}
                  disabled={isUploading}
                >
                    Upload Result
                  <input
                    hidden
                    type="file"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                </Button>
              )}
              {transitions.map((s) => (
                <Button
                  key={s}
                  variant="outlined"
                  onClick={() => handleStatusChange(s)}
                >
                    Mark as {s}
                </Button>
              ))}
            </>
          )}
          <Link href={`/para-clinic-requests/${request.id}`}>
            <Button variant="outlined">Print</Button>
          </Link>
        </Stack>
      </Box>
      <Box sx={{ p: { xs: 2, md: 4 }, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}
            >
              General Information
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              sx={{ flexWrap: 'wrap', gap: 3 }}
            >
              {[
                [
                  'Patient',
                  request.patient
                    ? `${request.patient.khmer_last_name} ${request.patient.khmer_first_name}`
                    : null,
                ],
                ['Doctor', request.doctor?.name ?? null],
                ['Request Date', request.request_date],
                ['Provisional Diagnosis', request.provisional_diagnosis],
              ].map(([label, value]) => (
                <InfoItem
                  key={label as string}
                  label={label as string}
                  value={value as string | null}
                />
              ))}
            </Stack>
            {request.clinical_reason && (
              <InfoItem label="Clinical Reason" value={request.clinical_reason} />
            )}
            {request.notes && (
              <InfoItem label="Notes" value={request.notes} />
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}
            >
              Diagnostic Tests ({request.tests.length})
            </Typography>
            {request.tests.length === 0 ? (
              <Typography color="text.secondary">No tests added.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Test Name', 'Price', 'Priority', 'Instruction'].map(
                      (h) => (
                        <TableCell key={h}>{h}</TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {request.tests.map((t, i) => (
                    <TableRow key={t.id ?? i}>
                      <TableCell>{t.test_name}</TableCell>
                      <TableCell>${(t.price ?? 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.priority}
                          color={
                            t.priority === 'STAT'
                              ? 'error'
                              : t.priority === 'Urgent'
                                ? 'warning'
                                : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>{t.instruction ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}
            >
              Attachments
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<Upload size={16} />}
              disabled={isUploading}
            >
              Upload File
              <input
                hidden
                type="file"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.5 }}
              color="text.secondary"
            >
              Max file size: 20 MB
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {request.attachments.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                  No files uploaded yet.
                </Typography>
              ) : (
                request.attachments.map((a) => (
                  <Stack
                    key={a.id}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      p: 1.5,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      alignItems: 'center',
                    }}
                  >
                    {fileIcon(a.mime_type)}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {a.file_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatSize(a.file_size)}
                        {a.uploaded_by && ` • by ${a.uploaded_by}`}
                      </Typography>
                    </Box>
                    <Button
                      component="a"
                      href={`/para-clinic-requests/attachments/${a.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteAttachment(a)}
                      aria-label={`Delete ${a.file_name}`}
                      color="error"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>
                ))
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}
            >
              Billing
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
              <InfoItem
                label="Fee"
                value={`$${(request.fee ?? 0).toFixed(2)}`}
              />
              <InfoItem
                label="Payment Status"
                value={
                  <Chip
                    size="small"
                    label={request.payment_status}
                    color={PAYMENT_COLORS[request.payment_status] ?? 'default'}
                  />
                }
              />
              <InfoItem label="Payment Date" value={request.payment_date} />
            </Stack>
            {request.payment_status !== 'Paid' && (
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleMarkPaid}
              >
                Mark as Paid
              </Button>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}
            >
              Timeline
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                ● Created · {new Date(request.created_at).toLocaleString()}
                {request.created_by && ` by ${request.created_by}`}
              </Typography>
              {request.updated_at !== request.created_at && (
                <Typography variant="body2">
                  ● Last updated ·{' '}
                  {new Date(request.updated_at).toLocaleString()}
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box sx={{ minWidth: 160, flex: '1 1 18%', mt: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      color={
        value === null || value === undefined ? 'text.disabled' : 'text.primary'
      }
    >
      {value ?? '—'}
    </Typography>
  </Box>
);

export default Show;
