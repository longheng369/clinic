import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import VaccineForm from './partials/createOrEdit';
import { IVaccine } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import SearchBar from '@/components/searchBar';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { formatCreatedDateTime } from '@/utils/date';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
} from '@mui/x-data-grid';
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

const Vaccine = () => {
  const { t } = useTranslation();
  const { openModal, closeModal, openAlert } = useModal();

  const { vaccines, search: searchProp, units } = usePage<{
    vaccines: PaginatedData<IVaccine>;
    search: string | null;
    units: IUnit[];
  }>().props;

  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/vaccines',
    searchProp,
    onBeforeNavigate: () =>
      setPaginationModel((prev) => ({ ...prev, page: 0 })),
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    {
      page: Math.max(vaccines.current_page - 1, 0),
      pageSize: vaccines.per_page,
    },
  );

  const handleCreate = () => {
    openModal({
      title: t('vaccines.new'),
      content: (
        <VaccineForm units={units} onClose={() => closeModal()} />
      ),
      config: { preventClickAway: true, maxWidth: '4xl' },
    });
  };

  const handleEdit = (vaccine: IVaccine) => {
    openModal({
      title: t('vaccines.editTitle', { name: vaccine.name }),
      content: (
        <VaccineForm
          vaccine={vaccine}
          units={units}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true, maxWidth: '4xl', scroll: 'body' },
    });
  };

  const handleDelete = (vaccine: IVaccine) => {
    openAlert({
      message: t('vaccines.deleteMessage'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () => router.delete(`/vaccines/${vaccine.id}`),
    });
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    router.get(
      '/vaccines',
      {
        ...(searchProp ? { search: searchProp } : {}),
        page: model.page + 1,
        per_page: model.pageSize,
      },
      { preserveState: true },
    );
  };

  const columns: GridColDef<IVaccine>[] = [
    {
      field: 'name',
      headerName: t('vaccines.columnName'),
      flex: 1,
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'description',
      headerName: t('vaccines.columnDescription'),
      flex: 2,
      minWidth: 240,
      sortable: false,
    },
    {
      field: 'created_at',
      headerName: t('vaccines.columnCreated'),
      width: 200,
      sortable: false,
      renderCell: (params) => formatCreatedDateTime(params.row.created_at),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('vaccines.columnActions'),
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('common.edit')}
          onClick={() => handleEdit(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('common.delete')}
          onClick={() => handleDelete(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  const { data, total } = vaccines;
  const pageSizeOptions = [...new Set([vaccines.per_page, 10, 25, 50])].sort(
    (a, b) => a - b,
  );

  return (
    <>
      <Head title={t('vaccines.title')} />
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
          <Typography variant="h5">{t('vaccines.heading')}</Typography>
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
              placeholder={t('vaccines.searchPlaceholder')}
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              {t('vaccines.new')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={data}
            columns={columns}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
            sx={{ height: '100%' }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Vaccine;
