import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import UnitForm from './partials/createOrEdit'
import { IUnit } from '@/interfaces/IUnit'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/components/searchBar'
import { formatCreatedDateTime } from '@/utils/date'
import { Box, Button, Stack, Typography } from '@mui/material'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

const Unit = () => {
   const { openModal, closeModal, openAlert } = useModal()

   const { units, search: searchProp } = usePage<{
      units: PaginatedData<IUnit>
      search: string | null
   }>().props

   const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

   useEffect(() => {
      const timeout = setTimeout(() => {
         if ((searchTerm || '') === (searchProp || '')) return
         if (searchTerm) {
            router.get('/settings/units', { search: searchTerm, page: 1 }, { preserveState: true, replace: true })
         } else {
            router.get('/settings/units', {}, { preserveState: true, replace: true })
         }
      }, 300)

      return () => clearTimeout(timeout)
   }, [searchTerm])

   const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
      const page = model.page + 1
      const params: Record<string, string | number> = { page }

      if (searchProp) params.search = searchProp

      router.get('/settings/units', params, { preserveState: true, replace: true })
   }, [searchProp])

   const handleCreate = () => {
      openModal({
         title: 'New Unit',
         content: <UnitForm onClose={() => closeModal()} />,
         config: { preventClickAway: true }
      })
   }

   const handleEdit = (unit: IUnit) => {
      openModal({
         title: `Edit ${unit.name}`,
         content: <UnitForm unit={unit} onClose={() => closeModal()} />,
         config: { preventClickAway: true }
      })
   }

   const handleDelete = (unit: IUnit) => {
      openAlert({
         message: 'Delete this unit?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/settings/units/${unit.id}`)
      })
   }

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
            params.value ?? <Typography component="span" color="text.disabled">&mdash;</Typography>,
      },
      {
         field: 'created_at',
         headerName: 'បានបង្កើត',
         flex: 1,
         minWidth: 180,
         valueGetter: (_value, row: IUnit) => formatCreatedDateTime(row.created_at),
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
   ]

   return (
      <>
         <Head title="Units" />
         <Box sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
               <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Units</Typography>
                  <Typography variant="body2" color="text.secondary">
                     Manage your clinic units
                  </Typography>
               </Box>
               <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search unit" />
                  <Button
                     onClick={handleCreate}
                     size="large"
                     variant="contained"
                     startIcon={<Plus size={20} />}
                  >
                     New Unit
                  </Button>
               </Stack>
            </Stack>

            <DataGrid
               rows={units.data}
               columns={columns}
               rowCount={units.total}
               paginationMode="server"
               paginationModel={{ page: units.current_page - 1, pageSize: units.per_page }}
               onPaginationModelChange={handlePaginationModelChange}
               pageSizeOptions={[10]}
               disableRowSelectionOnClick
               autoHeight
               sx={{
                  mt: 3,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                     borderRight: 1,
                     borderColor: 'divider',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                     borderBottom: 1,
                     borderColor: 'divider',
                  },
                  '& .MuiDataGrid-cell': {
                     borderBottom: 0,
                  },
                  '& .MuiDataGrid-row': {
                     borderBottom: 1,
                     borderColor: 'divider',
                  },
                  '& .MuiDataGrid-row:last-child': {
                     borderBottom: 0,
                  },
                  '& .MuiDataGrid-columnHeader:last-child, & .MuiDataGrid-cell:last-child': {
                     borderRight: 0,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                     fontFamily: 'var(--font-khmer)',
                     fontWeight: 'bold',
                  },
               }}
            />
         </Box>
      </>
   )
}

export default Unit
