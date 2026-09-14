import { router, usePage } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Trash2, Plus, Eye } from 'lucide-react';
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
import ParaClinicView from '@/pages/patients/partials/tab/para-clinic/partials/view';

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
  const { openAlert, openModal } = useModal();
  const { paraClinicRequests } = usePage<{
    paraClinicRequests: PaginatedData<IParaClinicRequest>;
  }>().props;
  const { data: rows, total, current_page, per_page } = paraClinicRequests;

  const handleDelete = (request: IParaClinicRequest) => {
    openAlert({
      message: 'Delete this para clinic request?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
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

  const openRequestForm = () => {
    openModal({
      title: 'New Para Clinic Request',
      content: <ParaClinicForm patientId={patientId} visitId={selectedVisitId} />,
      config: { preventClickAway: true }
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
      headerName: 'លេខស្នើសុំ',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'request_date',
      headerName: 'កាលបរិច្ឆេទ',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'status',
      headerName: 'ស្ថានភាព',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) => (
        <Chip
          size="small"
          label={params.value}
          color={STATUS_COLORS[params.value] ?? 'default'}
        />
      ),
    },
    {
      field: 'fee',
      headerName: 'ចំនួនទឹកប្រាក់',
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
      headerName: 'សកម្មភាព',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Eye size={16} color="#64748b" />}
          label="View request"
          onClick={() => handleView(params.row as IParaClinicRequest)}
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
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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