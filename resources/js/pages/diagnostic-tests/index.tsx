import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import DiagnosticTestForm from './partials/createOrEdit';
import { IDiagnosticTest } from '@/interfaces/IDiagnosticTest';
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

const DiagnosticTests = () => {
  const { openModal, openAlert } = useModal();
  const { diagnosticTests, search: searchProp } = usePage<{
    diagnosticTests: IPagination<IDiagnosticTest>;
    search: string | null;
  }>().props;
  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/settings/diagnostic-tests',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/settings/diagnostic-tests',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: 'New Diagnostic Test',
      content: <DiagnosticTestForm />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleEdit = (diagnosticTest: IDiagnosticTest) => {
    openModal({
      title: 'Edit Diagnostic Test',
      content: <DiagnosticTestForm diagnosticTest={diagnosticTest} />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleDelete = (diagnosticTest: IDiagnosticTest) => {
    openAlert({
      message: 'Delete this diagnostic test?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/settings/diagnostic-tests/${diagnosticTest.id}`),
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
      valueGetter: (_value, row: IDiagnosticTest) => `$${row.price.toFixed(2)}`,
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
      valueGetter: (_value, row: IDiagnosticTest) =>
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
          onClick={() => handleEdit(params.row as IDiagnosticTest)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.name}`}
          onClick={() => handleDelete(params.row as IDiagnosticTest)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Diagnostic Tests" />
      <Stack sx={{ p: 4, height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">Diagnostic Tests</Typography>
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
              placeholder="Search diagnostic test"
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
            rows={diagnosticTests.data}
            columns={columns}
            rowCount={diagnosticTests.total}
            paginationMode="server"
            paginationModel={{
              page: diagnosticTests.current_page - 1,
              pageSize: diagnosticTests.per_page,
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

export default DiagnosticTests;
