import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import MedicineInstructionForm from './partials/createOrEdit';
import { IMedicineInstruction } from '@/interfaces/IMedicineInstruction';
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

const MedicineInstructions = () => {
  const { openModal, openAlert } = useModal();

  const { medicineInstructions, search: searchProp } = usePage<{
    medicineInstructions: PaginatedData<IMedicineInstruction>;
    search: string | null;
  }>().props;

  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;
      if (searchTerm) {
        router.get(
          '/settings/medicine-instructions',
          { search: searchTerm, page: 1 },
          { preserveState: true, replace: true },
        );
      } else {
        router.get(
          '/settings/medicine-instructions',
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
      router.get('/settings/medicine-instructions', params, {
        preserveState: true,
        replace: true,
      });
    },
    [searchProp],
  );

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
      field: 'code',
      headerName: 'កូដ',
      flex: 1,
      minWidth: 160,
    },
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
            <Typography variant="h5">Medicine Instructions</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your medicine instructions
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
              placeholder="Search instruction"
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New Instruction
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
      </Box>
    </>
  );
};

export default MedicineInstructions;
