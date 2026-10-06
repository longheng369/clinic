import { router, usePage } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Trash2, Plus, Eye, Pencil } from 'lucide-react';
import { IParaClinicRequest } from '@/interfaces/IParaClinicRequest';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { Box, Button, Chip, Typography } from '@mui/material';
import ParaClinicForm from '@/pages/patients/partials/tab/para-clinic/partials/createOrEdit';
import ParaClinicView, { STATUS_OPTIONS } from '@/pages/patients/partials/tab/para-clinic/partials/view';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS: Record<
  string,
  'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'
> = {
  draft: 'default',
  requested: 'info',
  waiting_result: 'warning',
  result_received: 'success',
  reviewed: 'primary',
  completed: 'success',
  cancelled: 'error',
};

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const ParaClinicByPatientTab = ({ patientId, selectedVisitId }: { patientId: number; selectedVisitId: number | null }) => {
  const { t } = useTranslation();
  const { openAlert, openModal } = useModal();
  const { paraClinicRequests, consultationDiagnoses } = usePage<{
    paraClinicRequests: PaginatedData<IParaClinicRequest>;
    consultationDiagnoses: string[];
  }>().props;
  const { data: rows, total, current_page, per_page } = paraClinicRequests;

  const handleDelete = (request: IParaClinicRequest) => {
    openAlert({
      message: t('patients.paraClinic.deleteConfirm'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () =>
        router.delete(`/para-clinic-requests/${request.id}`),
    });
  };

  const handleView = (request: IParaClinicRequest) => {
    openModal({
      title: request.request_number,
      content: <ParaClinicView requestId={request.id} />,
    });
  };

  const handleEdit = (request: IParaClinicRequest) => {
    openModal({
      title: t('patients.paraClinic.editTitle', {
        request_number: request.request_number,
      }),
      content: <ParaClinicForm requestId={request.id} patientId={patientId} visitId={selectedVisitId} consultationDiagnoses={consultationDiagnoses} />,
      config: { preventClickAway: true, scroll: 'body' }
    });
  };

  const openRequestForm = () => {
    openModal({
      title: t('patients.paraClinic.newRequestTitle'),
      content: (
        <ParaClinicForm patientId={patientId} visitId={selectedVisitId} consultationDiagnoses={consultationDiagnoses} />
      ),
      config: { preventClickAway: true, scroll: 'body' },
    });
  }

  const handlePaginationModelChange = usePagination({
    route: `/patients/${patientId}`,
    extraParams: { tab: 'para-clinic' },
    only: ['paraClinicRequests'],
  });

  const columns: GridColDef[] = [
    {
      field: 'request_number',
      headerName: t('patients.paraClinic.colRequestNumber'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'request_date',
      headerName: t('patients.paraClinic.colRequestDate'),
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'clinical_reason',
      headerName: t('patients.paraClinic.colClinicalReason'),
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'notes',
      headerName: t('common.note'),
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'status',
      headerName: t('patients.paraClinic.colStatus'),
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) => (
        <Chip
          size="small"
          label={
            STATUS_OPTIONS[params.value]
              ? t(STATUS_OPTIONS[params.value])
              : params.value
          }
          color={STATUS_COLORS[params.value] ?? 'default'}
        />
      ),
    },
    {
      field: 'fee',
      headerName: t('patients.paraClinic.colFee'),
      flex: 1,
      minWidth: 130,
      valueGetter: (_: never, row: IParaClinicRequest) =>
        row.fee != null ? `$${row.fee.toFixed(2)}` : null,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) =>
        params.value ?? (
          <Box sx={{}}>
            <Typography component="span" color="text.disabled">
              &mdash;
            </Typography>
          </Box>
        ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('common.action'),
      width: 130,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Eye size={16} color="#64748b" />}
          label={t('patients.paraClinic.viewRequest')}
          onClick={() => handleView(params.row as IParaClinicRequest)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label="Edit request"
          onClick={() => handleEdit(params.row as IParaClinicRequest)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label="Delete request"
          onClick={() => handleDelete(params.row as IParaClinicRequest)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2">
          Para clinic test requests for this patient
        </Typography>
        <Button
          onClick={openRequestForm}
          variant="contained"
          startIcon={<Plus size={16} />}
        >
          New Request
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        paginationMode="server"
        paginationModel={{ page: current_page - 1, pageSize: per_page }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};

export default ParaClinicByPatientTab;