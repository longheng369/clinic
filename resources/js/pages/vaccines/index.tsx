import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import VaccineForm from './partials/createOrEdit';
import { IVaccine } from '@/interfaces/IVaccine';
import { Box, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/searchBar';
import { formatCreatedDateTime } from '@/utils/date';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
} from '@mui/x-data-grid';

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
  const { openModal, closeModal, openAlert } = useModal();

  const { vaccines, search: searchProp } = usePage<{
    vaccines: PaginatedData<IVaccine>;
    search: string | null;
  }>().props;

  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    {
      page: Math.max(vaccines.current_page - 1, 0),
      pageSize: vaccines.per_page,
    },
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      if (searchTerm) {
        router.get(
          '/vaccines',
          { search: searchTerm },
          { preserveState: true, replace: true },
        );
      } else {
        router.get('/vaccines', {}, { preserveState: true, replace: true });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleCreate = () => {
    openModal({
      title: 'New Vaccine',
      content: <VaccineForm onClose={() => closeModal()} />,
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleEdit = (vaccine: IVaccine) => {
    openModal({
      title: `Edit ${vaccine.name}`,
      content: <VaccineForm vaccine={vaccine} onClose={() => closeModal()} />,
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleDelete = (vaccine: IVaccine) => {
    openAlert({
      message: 'Delete this vaccine?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/vaccines/${vaccine.id}`),
    });
  };

  const summarizeRules = (vaccine: IVaccine): string => {
    const ruleCount = vaccine.rules.length;
    const totalDoses = vaccine.rules.reduce(
      (sum, r) => sum + r.doses.length,
      0,
    );
    if (ruleCount === 1) {
      return `${totalDoses} dose${totalDoses > 1 ? 's' : ''}`;
    }
    return `${ruleCount} age rules, ${totalDoses} doses total`;
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
      headerName: 'ឈ្មោះ',
      flex: 1,
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'description',
      headerName: 'ការពិពណ៌នា',
      flex: 2,
      minWidth: 240,
      sortable: false,
      renderCell: (params) =>
        params.value ?? (
          <Typography component="span" sx={{ color: 'text.disabled' }}>
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'schedule',
      headerName: 'កាលវិភាគ',
      flex: 1,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => (
        <Typography component="span" variant="body2" color="text.secondary">
          {summarizeRules(params.row)}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'បានបង្កើត',
      width: 200,
      sortable: false,
      renderCell: (params) => formatCreatedDateTime(params.row.created_at),
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
          label="Edit"
          onClick={() => handleEdit(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label="Delete"
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
      <Head title="Vaccines" />
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
            <Typography variant="h5">Vaccines</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage vaccine definitions and dose schedules
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
              placeholder="Search vaccine"
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New Vaccine
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
