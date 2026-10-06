import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import PatientForm from './partials/createOrEdit';
import { IPatient } from '@/interfaces/IPatient';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/searchBar';
import { formatDob } from '@/utils/date';
import { Box, Typography, Button } from '@mui/material';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const Patient = () => {
  const { openModal, openAlert } = useModal();
  const { t } = useTranslation();

  const { patients, search: searchProp } = usePage<{
    patients: PaginatedData<IPatient>;
    search: string | null;
  }>().props;

  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/patients',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/patients',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: t('patients.list.newPatient'),
      content: <PatientForm />,
      config: { preventClickAway: true, maxWidth: '4xl' },
    });
  };

  const handleEdit = (patient: IPatient) => {
    openModal({
      title: (
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
          {t('common.edit')}{' '}
          <Typography
            variant="h6"
            component="span"
            sx={{ fontFamily: 'var(--font-khmer)' }}
          >
            {patient.khmer_first_name} {patient.khmer_last_name}
          </Typography>
        </Typography>
      ),
      content: <PatientForm patient={patient} />,
      config: { preventClickAway: true, maxWidth: '4xl' },
    });
  };

  const handleDelete = (patient: IPatient) => {
    openAlert({
      message: t('patients.list.deleteTitle'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () => router.delete(`/patients/${patient.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'khmer_name',
      headerName: t('patients.list.colKhmerName'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IPatient) =>
        `${row.khmer_last_name} ${row.khmer_first_name}`,
    },
    {
      field: 'english_name',
      headerName: t('patients.list.colEnglishName'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IPatient) =>
        row.first_name
          ? `${row.last_name ?? ''} ${row.first_name}`.trim()
          : null,
      renderCell: (params: GridRenderCellParams<IPatient>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'phone_number',
      headerName: t('patients.list.colPhone'),
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'gender',
      headerName: t('patients.list.colGender'),
      flex: 1,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<IPatient>) => (
        <Typography
          component="span"
          sx={{
            textTransform: 'capitalize',
            color: params.value === 'male' ? 'info.main' : 'error.main',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'date_of_birth',
      headerName: t('patients.list.colDob'),
      flex: 1,
      minWidth: 130,
      valueGetter: (_value, row: IPatient) => formatDob(row.date_of_birth),
    },
    {
      field: 'blood_group',
      headerName: t('patients.list.colBloodGroup'),
      flex: 1,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<IPatient>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('patients.list.colActions'),
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={<Eye size={16} color="#64748b" />}
          label={t('patients.list.viewAction', {
            khmer_first_name: params.row.khmer_first_name,
          })}
          onClick={() => router.visit(`/patients/${params.id}`)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('patients.list.editAction', {
            khmer_first_name: params.row.khmer_first_name,
          })}
          onClick={() => handleEdit(params.row as IPatient)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('patients.list.deleteAction', {
            khmer_first_name: params.row.khmer_first_name,
          })}
          onClick={() => handleDelete(params.row as IPatient)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title={t('patients.list.title')} />
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
          <Typography variant="h5">{t('patients.list.title')}</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <SearchBar
              sx={{ width: 350 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('patients.list.searchPlaceholder')}
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              {t('patients.list.newPatient')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={patients.data}
            columns={columns}
            rowCount={patients.total}
            paginationMode="server"
            paginationModel={{
              page: patients.current_page - 1,
              pageSize: patients.per_page,
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

export default Patient;
