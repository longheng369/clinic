import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import UnitForm from './partials/createOrEdit';
import { IUnit } from '@/interfaces/IUnit';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/searchBar';
import { formatCreatedDateTime } from '@/utils/date';
import { Box, Button, Typography } from '@mui/material';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const Unit = () => {
  const { openModal, openAlert } = useModal();

  const { units, search: searchProp } = usePage<{
    units: PaginatedData<IUnit>;
    search: string | null;
  }>().props;

  const [searchTerm, setSearchTerm] = useState(searchProp ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchTerm || '') === (searchProp || '')) return;
      if (searchTerm) {
        router.get(
          '/settings/units',
          { search: searchTerm, page: 1 },
          { preserveState: true, replace: true },
        );
      } else {
        router.get(
          '/settings/units',
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

      router.get('/settings/units', params, {
        preserveState: true,
        replace: true,
      });
    },
    [searchProp],
  );

  const handleCreate = () => {
    openModal({
      title: (
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
          New Unit
        </Typography>
      ),
      content: <UnitForm />,
      config: { preventClickAway: true },
    });
  };

  const handleEdit = (unit: IUnit) => {
    openModal({
      title: (
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
          Edit{' '}
          <Typography variant="h6" component="span">
            {unit.name}
          </Typography>
        </Typography>
      ),
      content: <UnitForm unit={unit} />,
      config: { preventClickAway: true },
    });
  };

  const handleDelete = (unit: IUnit) => {
    openAlert({
      message: 'Delete this unit?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => router.delete(`/settings/units/${unit.id}`),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ឈ្មោះ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'description',
      headerName: 'ការពិពណ៌នា',
      flex: 1,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams<IUnit>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'created_at',
      headerName: 'បានបង្កើត',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IUnit) =>
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
          onClick={() => handleEdit(params.row as IUnit)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={`Delete ${params.row.name}`}
          onClick={() => handleDelete(params.row as IUnit)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <Head title="Units" />
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
            <Typography variant="h5">Units</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your clinic units
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
              placeholder="Search unit"
            />
            <Button
              onClick={handleCreate}
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              New Unit
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
          <DataGrid
            rows={units.data}
            columns={columns}
            rowCount={units.total}
            paginationMode="server"
            paginationModel={{
              page: units.current_page - 1,
              pageSize: units.per_page,
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

export default Unit;
