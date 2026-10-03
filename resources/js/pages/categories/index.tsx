import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CategoryForm from './partials/createOrEdit';
import { ICategory } from '@/interfaces/ICategory';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import SearchBar from '@/components/searchBar';
import { formatCreatedDateTime } from '@/utils/date';
import { Box, Typography, Button, Stack } from '@mui/material';
import { IPagination } from '@/interfaces/IPagination';
import { useTranslation } from 'react-i18next';

const Category = () => {
  const { t } = useTranslation();
  const { openModal, openAlert } = useModal();
  const { categories, search: searchProp } = usePage<{
    categories: IPagination<ICategory>;
    search: string | null;
  }>().props;
  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/settings/categories',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/settings/categories',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: t('categories.createTitle'),
      content: <CategoryForm />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleEdit = (category: ICategory) => {
    openModal({
      title: t('categories.editTitle'),
      content: <CategoryForm category={category} />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleDelete = (category: ICategory) => {
    openAlert({
      message: t('categories.deleteMessage'),
      description: t('categories.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('categories.delete'),
      onConfirm: () => router.delete(`/settings/categories/${category.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('categories.columnName'),
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'description',
      headerName: t('categories.columnDescription'),
      flex: 1,
      minWidth: 220
    },
    {
      field: 'created_at',
      headerName: t('categories.columnCreated'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: ICategory) =>
        formatCreatedDateTime(row.created_at),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('categories.columnActions'),
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('categories.editAction', { name: params.row.name })}
          onClick={() => handleEdit(params.row as ICategory)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('categories.deleteAction', { name: params.row.name })}
          onClick={() => handleDelete(params.row as ICategory)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title={t('categories.title')} />
      <Stack
        sx={{ p: 4, height: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">{t('categories.title')}</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('categories.searchPlaceholder')}
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              {t('categories.new')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={categories.data}
            columns={columns}
            rowCount={categories.total}
            paginationMode="server"
            paginationModel={{
              page: categories.current_page - 1,
              pageSize: categories.per_page,
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[20]}
            disableRowSelectionOnClick
            sx={{ height: '100%' }}
          />
        </Box>
      </Stack>
    </>
  );
};

export default Category;
