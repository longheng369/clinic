import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import ParaClinicForm from './partials/createOrEdit';
import { IParaClinicRequest } from '@/interfaces/IParaClinicRequest';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useModal } from '@/components/modal';
import SearchBar from '@/components/searchBar';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

type ChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

const STATUS_COLORS: Record<string, ChipColor> = {
  Draft: 'default',
  Requested: 'info',
  'Waiting Result': 'warning',
  'Result Received': 'success',
  Reviewed: 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

const PAYMENT_COLORS: Record<string, ChipColor> = {
  Unpaid: 'error',
  Partial: 'warning',
  Paid: 'success',
};

const STATUS_OPTIONS = [
  '',
  'Draft',
  'Requested',
  'Waiting Result',
  'Result Received',
  'Reviewed',
  'Completed',
  'Cancelled',
];

const PAYMENT_OPTIONS = ['', 'Unpaid', 'Partial', 'Paid'];

interface PreselectedPatient {
  id: number;
  khmer_first_name: string;
  khmer_last_name: string;
}

const Index = () => {
  const { openModal, closeModal, openAlert } = useModal();
  const {
    requests,
    search: searchProp,
    filters,
    auth,
    patient,
  } = usePage<{
    requests: PaginatedData<IParaClinicRequest>;
    search: string | null;
    filters: {
      status: string | null;
      payment_status: string | null;
      date_from: string | null;
      date_to: string | null;
    };
    auth: { user: { id: number; name: string } };
    patient: PreselectedPatient | null;
  }>().props;

  const [searchTerm, setSearchTerm] = useState(searchProp ?? ''),
    [filterStatus, setFilterStatus] = useState(filters.status ?? ''),
    [filterPayment, setFilterPayment] = useState(filters.payment_status ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;
      router.get(
        '/para-clinic-requests',
        searchTerm ? { search: searchTerm, page: 1 } : {},
        { preserveState: true, replace: true },
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, searchProp]);

  const navigateToRequests = useCallback(
    (params: Record<string, string | number>) => {
      router.get('/para-clinic-requests', params, {
        preserveState: true,
        replace: true,
      });
    },
    [],
  );

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      const params: Record<string, string | number> = {
        page: model.page + 1,
      };
      if (searchProp) params.search = searchProp;
      if (filterStatus) params.status = filterStatus;
      if (filterPayment) params.payment_status = filterPayment;
      if (patient) params.patient_id = patient.id;
      navigateToRequests(params);
    },
    [navigateToRequests, searchProp, filterStatus, filterPayment, patient],
  );

  const handleFilter = useCallback(
    (
      value: string,
      key: 'status' | 'payment_status',
      setter: (v: string) => void,
    ) => {
      setter(value);
      const params: Record<string, string> = {};
      if (searchProp) params.search = searchProp;
      const nextStatus = key === 'status' ? value : filterStatus;
      const nextPayment = key === 'payment_status' ? value : filterPayment;
      if (nextStatus) params.status = nextStatus;
      if (nextPayment) params.payment_status = nextPayment;
      navigateToRequests(params);
    },
    [navigateToRequests, searchProp, filterStatus, filterPayment],
  );

  const handleCreate = (preselectedPatient?: PreselectedPatient | null) =>
    openModal({
      title: 'New Para Clinic Request',
      content: (
        <ParaClinicForm
          authUser={auth.user}
          preselectedPatient={preselectedPatient}
          onClose={closeModal}
        />
      ),
      config: { preventClickAway: true, maxWidth: '4xl' },
    });

  useEffect(() => {
    if (patient) handleCreate(patient);
  }, []);

  const handleEdit = (r: IParaClinicRequest) =>
    openModal({
      title: `Edit Request ${r.request_number}`,
      content: (
        <ParaClinicForm request={r} authUser={auth.user} onClose={closeModal} />
      ),
      config: { preventClickAway: true, maxWidth: '4xl' },
    });

  const handleDelete = (r: IParaClinicRequest) =>
    openAlert({
      message: `Delete request ${r.request_number}?`,
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/para-clinic-requests/${r.id}`),
    });

  const columns: GridColDef[] = [
    {
      field: 'request_number',
      headerName: 'លេខស្នើសុំ',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'patient',
      headerName: 'អ្នកជំងឺ',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IParaClinicRequest) =>
        row.patient
          ? `${row.patient.khmer_last_name} ${row.patient.khmer_first_name}`
          : null,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'doctor',
      headerName: 'វេជ្ជបណ្ឌិត',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row: IParaClinicRequest) =>
        row.doctor?.name ?? null,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'external_facility_name',
      headerName: 'មន្ទីរពិសោធន៍',
      flex: 1,
      minWidth: 170,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'request_date',
      headerName: 'កាលបរិច្ឆេទ',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'ស្ថានភាព',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) => (
        <Chip
          size="small"
          label={params.value}
          color={STATUS_COLORS[params.value] ?? 'default'}
        />
      ),
    },
    {
      field: 'payment_status',
      headerName: 'ការទូទាត់',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<IParaClinicRequest>) => (
        <Chip
          size="small"
          label={params.value}
          color={PAYMENT_COLORS[params.value] ?? 'default'}
        />
      ),
    },
    {
      field: 'total_amount',
      headerName: 'ចំនួនទឹកប្រាក់',
      flex: 1,
      minWidth: 130,
      valueGetter: (_value, row: IParaClinicRequest) =>
        `$${(row.total_amount ?? 0).toFixed(2)}`,
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
          label={`View ${params.row.request_number}`}
          onClick={() => router.visit(`/para-clinic-requests/${params.id}`)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={`Edit ${params.row.request_number}`}
          onClick={() => handleEdit(params.row as IParaClinicRequest)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.request_number}`}
          onClick={() => handleDelete(params.row as IParaClinicRequest)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Para Clinic Requests" />
      <Box
        sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5">Para Clinic Requests</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your request to external service
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient request"
            />
            <Button
              onClick={() => handleCreate()}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New Request
            </Button>
          </Box>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ mt: 3 }}
        >
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) =>
              handleFilter(e.target.value, 'status', setFilterStatus)
            }
            displayEmpty
            sx={{ minWidth: 180 }}
            slotProps={{ input: { 'aria-label': 'Filter by status' } }}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o || 'All Statuses'}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={filterPayment}
            onChange={(e) =>
              handleFilter(e.target.value, 'payment_status', setFilterPayment)
            }
            displayEmpty
            sx={{ minWidth: 180 }}
            slotProps={{ input: { 'aria-label': 'Filter by payment status' } }}
          >
            {PAYMENT_OPTIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o || 'All Payments'}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Box sx={{ flex: 1, mt: 2, minHeight: 0 }}>
          <DataGrid
            rows={requests.data}
            columns={columns}
            rowCount={requests.total}
            paginationMode="server"
            paginationModel={{
              page: requests.current_page - 1,
              pageSize: requests.per_page,
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[20]}
            disableRowSelectionOnClick
            sx={{ height: '100%' }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
