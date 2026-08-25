import { router, usePage, Link as InertiaLink } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Eye, Trash2, Plus } from 'lucide-react';
import { IParaClinicRequest } from '@/interfaces/IParaClinicRequest';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { useCallback } from 'react';
import type React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';

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

const ParaClinicByPatientTab = ({ patientId }: { patientId: number }) => {
  const { openAlert } = useModal();
  const { paraClinicRequests } = usePage<{
    paraClinicRequests: PaginatedData<IParaClinicRequest>;
  }>().props;
  const { data: rows, total, current_page, per_page } = paraClinicRequests;

  const handleDelete = (request: IParaClinicRequest) => {
    openAlert({
      message: 'Delete this paraclinic request?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () =>
        router.delete(`/paraclinic-requests/${request.id}`),
    });
  };

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      router.get(
        `/patients/${patientId}`,
        { page: String(model.page + 1), tab: 'para-clinic' },
        { preserveState: true, replace: true, only: ['paraClinicRequests'] },
      );
    },
    [patientId],
  );

  const columns: GridColDef[] = [
    {
      field: 'request_number',
      headerName: 'លេខស្នើសុំ',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) => (
        <InertiaLink
          href={`/paraclinic-requests/${params.row.id}`}
          style={{ color: 'inherit' }}
        >
          {params.value}
        </InertiaLink>
      ),
    },
    {
      field: 'doctor.name',
      headerName: 'វេជ្ជបណ្ឌិត',
      flex: 1,
      minWidth: 150,
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
      field: 'external_facility_name',
      headerName: 'មន្ទីរពិសោធន៍',
      flex: 1,
      minWidth: 180,
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
      field: 'request_date',
      headerName: 'កាលបរិច្ឆេទ',
      flex: 1,
      minWidth: 130,
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
      field: 'total_amount',
      headerName: 'ចំនួនទឹកប្រាក់',
      flex: 1,
      minWidth: 130,
      valueGetter: (_: never, row: IParaClinicRequest) =>
        row.total_amount != null ? `$${row.total_amount.toFixed(2)}` : null,
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
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Eye size={16} color="#64748b" />}
          label="View request"
          onClick={() =>
            router.visit(`/paraclinic-requests/${params.row.id}`)
          }
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
          component={InertiaLink as React.ElementType}
          href={`/para-clinic-requests?patient_id=${patientId}`}
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