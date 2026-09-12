import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import MedicationRouteForm from './partials/createOrEdit';
import { IMedicationRoute } from '@/interfaces/IMedicationRoute';
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

const MedicationRoutes = () => {
  const { openModal, openAlert } = useModal();
  const { medicationRoutes, search: searchProp } = usePage<{
    medicationRoutes: IPagination<IMedicationRoute>;
    search: string | null;
  }>().props;
  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/settings/routes',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/settings/routes',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: 'New Route',
      content: <MedicationRouteForm />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleEdit = (medicationRoute: IMedicationRoute) => {
    openModal({
      title: 'Edit Route',
      content: <MedicationRouteForm medicationRoute={medicationRoute} />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleDelete = (medicationRoute: IMedicationRoute) => {
    openAlert({
      message: 'Delete this route?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () =>
        router.delete(`/settings/routes/${medicationRoute.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ឈ្មោះ',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'ការពិពណ៌នា',
      flex: 1,
      minWidth: 220
    },
    {
      field: 'created_at',
      headerName: 'បានបង្កើត',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IMedicationRoute) =>
        formatCreatedDateTime(row.created_at),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'សកម្មភាព',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={`Edit ${params.row.name}`}
          onClick={() => handleEdit(params.row as IMedicationRoute)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.name}`}
          onClick={() => handleDelete(params.row as IMedicationRoute)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Routes" />
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
          <Typography variant="h5">Routes</Typography>
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
              placeholder="Search route"
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={medicationRoutes.data}
            columns={columns}
            rowCount={medicationRoutes.total}
            paginationMode="server"
            paginationModel={{
              page: medicationRoutes.current_page - 1,
              pageSize: medicationRoutes.per_page,
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

export default MedicationRoutes;
