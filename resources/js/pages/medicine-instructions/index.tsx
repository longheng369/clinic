import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import MedicineInstructionForm from './partials/createOrEdit';
import { IMedicineInstruction } from '@/interfaces/IMedicineInstruction';
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

const MedicineInstructions = () => {
  const { openModal, openAlert } = useModal();
  const { medicineInstructions, search: searchProp } = usePage<{
    medicineInstructions: IPagination<IMedicineInstruction>;
    search: string | null;
  }>().props;
  const { searchTerm, setSearchTerm } = useDebouncedSearch({
    route: '/settings/medicine-instructions',
    searchProp,
  });

  const handlePaginationModelChange = usePagination({
    route: '/settings/medicine-instructions',
    search: searchProp,
  });

  const handleCreate = () => {
    openModal({
      title: 'New Medicine Instruction',
      content: <MedicineInstructionForm />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleEdit = (medicineInstruction: IMedicineInstruction) => {
    openModal({
      title: 'Edit Medicine Instruction',
      content: <MedicineInstructionForm medicineInstruction={medicineInstruction} />,
      config: { preventClickAway: true, maxWidth: 'sm' },
    });
  };

  const handleDelete = (medicineInstruction: IMedicineInstruction) => {
    openAlert({
      message: 'Delete this medicine instruction?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () =>
        router.delete(`/settings/medicine-instructions/${medicineInstruction.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ឈ្មោះ',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'description',
      headerName: 'ការពិពណ៌នា',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'created_at',
      headerName: 'បានបង្កើត',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IMedicineInstruction) =>
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
          onClick={() => handleEdit(params.row as IMedicineInstruction)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.name}`}
          onClick={() => handleDelete(params.row as IMedicineInstruction)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Medicine Instructions" />
      <Stack sx={{ p: 4, height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">Medicine Instructions</Typography>
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
              placeholder="Search instruction"
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
            rows={medicineInstructions.data}
            columns={columns}
            rowCount={medicineInstructions.total}
            paginationMode="server"
            paginationModel={{
              page: medicineInstructions.current_page - 1,
              pageSize: medicineInstructions.per_page,
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

export default MedicineInstructions;
