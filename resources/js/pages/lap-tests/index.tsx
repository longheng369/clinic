import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import LapTestForm from './partials/createOrEdit';
import { ILapTest } from '@/interfaces/ILapTest';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/searchBar';
import { formatCreatedDateTime } from '@/utils/date';
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

const LapTests = () => {
  const { openModal, openAlert } = useModal();

  const { lapTests, search: searchProp } = usePage<{
    lapTests: PaginatedData<ILapTest>;
    search: string | null;
  }>().props;

  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;
      if (searchTerm) {
        router.get(
          '/settings/lap-tests',
          { search: searchTerm, page: 1 },
          { preserveState: true, replace: true },
        );
      } else {
        router.get(
          '/settings/lap-tests',
          {},
          { preserveState: true, replace: true },
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      const page = model.page + 1;
      const params: Record<string, string | number> = { page };
      if (searchProp) params.search = searchProp;
      router.get('/settings/lap-tests', params, {
        preserveState: true,
        replace: true,
      });
    },
    [searchProp],
  );

  const handleCreate = () => {
    openModal({
      title: 'New Lap Test',
      content: <LapTestForm />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleEdit = (lapTest: ILapTest) => {
    openModal({
      title: 'Edit Lap Test',
      content: <LapTestForm lapTest={lapTest} />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleDelete = (lapTest: ILapTest) => {
    openAlert({
      message: 'Delete this lap test?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/settings/lap-tests/${lapTest.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ឈ្មោះ',
      flex: 1,
      minWidth: 500,
    },
    {
      field: 'price',
      headerName: 'តម្លៃ',
      flex: 1,
      minWidth: 200,
      valueGetter: (_value, row: ILapTest) => `$${row.price.toFixed(2)}`,
    },
    {
      field: 'description',
      headerName: 'ការពិពណ៌នា',
      flex: 1,
      minWidth: 500,
    },
    {
      field: 'created_at',
      headerName: 'កាលបរិច្ឆេទបង្កើត',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: ILapTest) =>
        formatCreatedDateTime(row.created_at),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'សកម្មភាព',
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={`Edit ${params.row.name}`}
          onClick={() => handleEdit(params.row as ILapTest)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.name}`}
          onClick={() => handleDelete(params.row as ILapTest)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Lap Tests" />
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
            <Typography variant="h5">Lap Tests</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your lab tests
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
              placeholder="Search lap test"
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New Lap Test
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={lapTests.data}
            columns={columns}
            rowCount={lapTests.total}
            paginationMode="server"
            paginationModel={{
              page: lapTests.current_page - 1,
              pageSize: lapTests.per_page,
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

export default LapTests;
