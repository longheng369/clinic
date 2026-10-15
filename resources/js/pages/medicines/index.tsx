import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import MedicineForm from './partials/createOrEdit';
import { IMedicine } from '@/interfaces/IMedicine';
import { IUnit } from '@/interfaces/IUnit';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import SearchBar from '@/components/searchBar';
import { formatDate } from '@/utils/date';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const Medicine = () => {
  const { t } = useTranslation();
  const { openModal, openAlert } = useModal();

  const {
    medicines,
    units,
    search: searchProp,
  } = usePage<{
    medicines: PaginatedData<IMedicine>;
    units: IUnit[];
    search: string | null;
  }>().props;

  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/medicines',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/medicines',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: (
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
          {t('medicines.new')}
        </Typography>
      ),
      content: <MedicineForm units={units} />,
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleEdit = (medicine: IMedicine) => {
    openModal({
      title: t('medicines.editAction', { name: medicine.name }),
      content: <MedicineForm medicine={medicine} units={units} />,
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleDelete = (med: IMedicine) => {
    openAlert({
      message: t('medicines.deleteMessage'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () => router.delete(`/medicines/${med.id}`),
    });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('medicines.columnName'), flex: 1, minWidth: 150 },
    { field: 'type', headerName: t('medicines.columnType'), flex: 1, minWidth: 120 },
    {
      field: 'category',
      headerName: t('medicines.columnCategory'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IMedicine) => row.category?.name ?? null,
      renderCell: (params: GridRenderCellParams<IMedicine>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'unit',
      headerName: t('medicines.columnUnit'),
      flex: 1,
      minWidth: 100,
      valueGetter: (_value, row: IMedicine) => row.unit?.name ?? null,
      renderCell: (params: GridRenderCellParams<IMedicine>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'dosage',
      headerName: t('medicines.columnDosage'),
      flex: 1,
      minWidth: 120
    },
    {
      field: 'unit_price',
      headerName: t('medicines.columnUnitPrice'),
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row: IMedicine) =>
        row.unit_price != null ? `$${Number(row.unit_price).toFixed(2)}` : null,
      renderCell: (params: GridRenderCellParams<IMedicine>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'created_at',
      headerName: t('medicines.columnCreated'),
      flex: 1,
      minWidth: 160,
      valueGetter: (_value, row: IMedicine) => formatDate(row.created_at),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('medicines.columnActions'),
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('medicines.editAction', { name: params.row.name })}
          onClick={() => handleEdit(params.row as IMedicine)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('medicines.deleteAction', { name: params.row.name })}
          onClick={() => handleDelete(params.row as IMedicine)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title={t('medicines.title')} />
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
            <Typography variant="h5">{t('medicines.title')}</Typography>
            <Typography variant="body1" color="textSecondary">
              {t('medicines.subtitle')}
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
              placeholder={t('medicines.searchPlaceholder')}
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              {t('medicines.new')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={medicines.data}
            columns={columns}
            rowCount={medicines.total}
            paginationMode="server"
            paginationModel={{
              page: medicines.current_page - 1,
              pageSize: medicines.per_page,
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[20]}
            disableRowSelectionOnClick
            sx={{
              height: '100%',
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Medicine;
