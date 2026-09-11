import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { useModal } from '@/components/modal';
import SearchBar from '@/components/searchBar';
import { formatDate } from '@/utils/date';
import AppointmentForm from './partials/createOrEdit';
import { IAppointment } from '@/interfaces/IAppointment';

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
  scheduled: 'info',
  completed: 'success',
  cancelled: 'default',
  no_show: 'error',
};

const TYPE_COLORS: Record<string, ChipColor> = {
  consultation: 'primary',
  vaccination: 'warning',
  follow_up: 'secondary',
  checkup: 'success',
  other: 'default',
};

type Props = {
  appointments: PaginatedData<IAppointment>;
  search: string | null;
  dateFilter: string | null;
  statusFilter: string | null;
};

const Appointment = () => {
  const { openModal, openAlert } = useModal();
  const { appointments, search: searchProp, dateFilter, statusFilter } =
    usePage<Props>().props;
  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');
  const [date, setDate] = useState(dateFilter ?? '');
  const [status, setStatus] = useState(statusFilter ?? '');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: Math.max(appointments.current_page - 1, 0),
    pageSize: appointments.per_page,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        (searchTerm || '') === (searchProp || '') &&
        (date || '') === (dateFilter || '') &&
        (status || '') === (statusFilter || '')
      ) {
        return;
      }

      setPaginationModel((prev) => ({ ...prev, page: 0 }));

      const params: Record<string, string | number> = { page: 1 };
      if (searchTerm) params.search = searchTerm;
      if (date) params.date = date;
      if (status) params.status = status;

      router.get('/appointments', params, {
        preserveState: true,
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, date, status, searchProp, dateFilter, statusFilter]);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);

      const params: Record<string, string | number> = {
        page: model.page + 1,
      };
      if (searchTerm) params.search = searchTerm;
      if (date) params.date = date;
      if (status) params.status = status;

      router.get('/appointments', params, {
        preserveState: true,
        replace: true,
      });
    },
    [searchTerm, date, status],
  );

  const handleCreate = () =>
    openModal({
      title: 'New Appointment',
      content: <AppointmentForm />,
      config: { preventClickAway: true, maxWidth: '4xl' },
    });

  const handleEdit = (appointment: IAppointment) =>
    openModal({
      title: 'Edit Appointment',
      content: <AppointmentForm appointment={appointment} />,
      config: { preventClickAway: true, maxWidth: '4xl' },
    });

  const handleView = (appointment: IAppointment) =>
    openModal({
      title: 'View Appointment',
      content: <AppointmentForm appointment={appointment} readOnly />,
      config: { preventClickAway: true, maxWidth: '4xl' },
    });

  const handleDelete = (appointment: IAppointment) =>
    openAlert({
      message: 'Delete this appointment?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/appointments/${appointment.id}`),
    });

  const columns: GridColDef[] = [
    {
      field: 'patient',
      headerName: 'អ្នកជំងឺ',
      flex: 1.1,
      minWidth: 190,
      valueGetter: (_value, row: IAppointment) =>
        row.patient
          ? `${row.patient.khmer_last_name} ${row.patient.khmer_first_name}`
          : null,
      renderCell: (params: GridRenderCellParams<IAppointment>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'appointment_date',
      headerName: 'កាលបរិច្ឆេទ',
      flex: 0.8,
      minWidth: 130,
      valueGetter: (_value, row: IAppointment) =>
        formatDate(row.appointment_date),
    },
    {
      field: 'appointment_time',
      headerName: 'ម៉ោង',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<IAppointment>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'type',
      headerName: 'ប្រភេទ',
      flex: 0.9,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<IAppointment>) => (
        <Chip
          size="small"
          label={(params.value as string)?.replace('_', ' ')}
          color={TYPE_COLORS[params.value as string] ?? 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'ស្ថានភាព',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<IAppointment>) => (
        <Chip
          size="small"
          label={(params.value as string)?.replace('_', ' ')}
          color={STATUS_COLORS[params.value as string] ?? 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'notes',
      headerName: 'កំណត់ចំណាំ',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams<IAppointment>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'has_vaccine_alerts',
      headerName: 'វ៉ាក់សាំង',
      flex: 0.7,
      minWidth: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<IAppointment>) =>
        params.value ? (
          <Chip size="small" color="error" label="⚠ ជិតដល់" />
        ) : (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'សកម្មភាព',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Eye size={16} color="#64748b" />}
          label="View appointment"
          onClick={() => handleView(params.row as IAppointment)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label="Edit appointment"
          onClick={() => handleEdit(params.row as IAppointment)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label="Delete appointment"
          onClick={() => handleDelete(params.row as IAppointment)}
          showInMenu={false}
        />,
      ],
    },
  ];

  const pageSizeOptions = [...new Set([appointments.per_page, 10, 20, 25])].sort(
    (a, b) => a - b,
  );

  return (
    <>
      <Head title="កាលវិភាគ" />
      <Box
        sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Paper
          variant="outlined"
          sx={{
            mb: 3,
            p: 3,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Appointment
            </Typography>
            <Typography variant="body1" color="textSecondary">
              manage appointment
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label={`${appointments.total} total`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={status ? status.replace('_', ' ') : 'All statuses'}
              variant="outlined"
              color={status ? (STATUS_COLORS[status] ?? 'default') : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            mb: 3,
            p: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xs: 'stretch', xl: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ flex: 1, minWidth: 0 }}
          >
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name"
              fullWidth
            />
            <TextField
              size="small"
              fullWidth
              type="date"
              label="Appointment date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { 'aria-label': 'Filter by date' },
              }}
            />
            <Select
              size="small"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
              slotProps={{ input: { 'aria-label': 'Filter by status' } }}
            >
              <MenuItem value="">All status</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="no_show">No Show</MenuItem>
            </Select>
          </Stack>
          <Button
            onClick={handleCreate}
            variant="contained"
            size="large"
            startIcon={<Plus size={16} />}
            sx={{ minWidth: { xs: '100%', md: 180 } }}
          >
            New Appointment
          </Button>
        </Paper>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid
            rows={appointments.data}
            columns={columns}
            rowCount={appointments.total}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
};

export default Appointment;
