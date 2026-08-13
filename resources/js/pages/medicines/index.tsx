import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import MedicineForm from './partials/createOrEdit'
import { IMedicine } from '@/interfaces/IMedicine'
import { IUnit } from '@/interfaces/IUnit'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/components/searchBar'
import { formatDate } from '@/utils/date'
import { Box, Typography, Button } from '@mui/material';

interface PaginatedData<T> {
   data: T[]
   current_page: number
   last_page: number
   per_page: number
   total: number
   from: number
   to: number
}

const Medicine = () => {
   const { openModal, openAlert } = useModal()

   const { medicines, units, search: searchProp } = usePage<{
      medicines: PaginatedData<IMedicine>
      units: IUnit[]
      search: string | null
   }>().props

   const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

   useEffect(() => {
      const timeout = setTimeout(() => {
         if ((searchTerm || '') === (searchProp || '')) return
         if (searchTerm) {
            router.get('/medicines', { search: searchTerm, page: 1 }, { preserveState: true, replace: true })
         } else {
            router.get('/medicines', {}, { preserveState: true, replace: true })
         }
      }, 300)

      return () => clearTimeout(timeout)
   }, [searchTerm])

   const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
      const page = model.page + 1
      const params: Record<string, string | number> = { page }
      if (searchProp) params.search = searchProp
      router.get('/medicines', params, { preserveState: true, replace: true })
   }, [searchProp])

   const handleCreate = () => {
      openModal({
         title: <Typography variant='h5' sx={{ fontWeight: 'medium' }}>New Medicine</Typography>,
         content: <MedicineForm units={units} />,
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleEdit = (medicine: IMedicine) => {
      openModal({
         title: `Edit ${medicine.name}`,
         content: <MedicineForm medicine={medicine} units={units} />,
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleDelete = (med: IMedicine) => {
      openAlert({
         message: 'Delete this medicine?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/medicines/${med.id}`)
      })
   }

   const columns: GridColDef[] = [
      { field: 'name', headerName: 'ឈ្មោះ', flex: 1, minWidth: 150 },
      { field: 'type', headerName: 'ប្រភេទ', flex: 1, minWidth: 120 },
      {
         field: 'category',
         headerName: 'ប្រភេទចំណាត់ថ្នាក់',
         flex: 1,
         minWidth: 180,
         valueGetter: (_value, row: IMedicine) => row.category?.name ?? null,
         renderCell: (params: GridRenderCellParams<IMedicine>) =>
            params.value ?? <Typography component="span" color="text.disabled">&mdash;</Typography>,
      },
      {
         field: 'unit',
         headerName: 'ឯកតា',
         flex: 1,
         minWidth: 100,
         valueGetter: (_value, row: IMedicine) => row.unit?.name ?? null,
         renderCell: (params: GridRenderCellParams<IMedicine>) =>
            params.value ?? <Typography component="span" color="text.disabled">&mdash;</Typography>,
      },
      {
         field: 'dosage',
         headerName: 'កម្រិត',
         flex: 1,
         minWidth: 120,
         renderCell: (params: GridRenderCellParams<IMedicine>) =>
            params.value ?? <Typography component="span" color="text.disabled">&mdash;</Typography>,
      },
      {
         field: 'unit_price',
         headerName: 'តម្លៃឯកតា',
         flex: 1,
         minWidth: 120,
         valueGetter: (_value, row: IMedicine) => row.unit_price != null ? `$${Number(row.unit_price).toFixed(2)}` : null,
         renderCell: (params: GridRenderCellParams<IMedicine>) =>
            params.value ?? <Typography component="span" color="text.disabled">&mdash;</Typography>,
      },
      {
         field: 'created_at',
         headerName: 'បានបង្កើត',
         flex: 1,
         minWidth: 160,
         valueGetter: (_value, row: IMedicine) => formatDate(row.created_at),
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'សកម្មភាព',
         width: 120,
         getActions: (params) => [
            <GridActionsCellItem
               key={`edit-${params.id}`}
               icon={<Pencil size={16} color="#2563eb" />}
               label={`Edit ${params.row.name}`}
               onClick={() => handleEdit(params.row as IMedicine)}
               showInMenu={false}
            />,
            <GridActionsCellItem
               key={`delete-${params.id}`}
               icon={<Trash2 size={16} color="#dc2626" />}
               label={`Delete ${params.row.name}`}
               onClick={() => handleDelete(params.row as IMedicine)}
               showInMenu={false}
            />,
         ],
      },
   ]

   return (
      <>
         <Head title="Medicines" />
         <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <Box>
                  <Typography variant='h5'>Medicines</Typography>
                  <Typography variant='body1' color='textSecondary'>Manage your clinic medicines</Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search medicine' />
                  <Button
                     onClick={handleCreate}
                     variant='contained'
                     startIcon={<Plus size={16} />}
                  >
                     New Medicine
                  </Button>
               </Box>
            </Box>

            <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
               <DataGrid
                  rows={medicines.data}
                  columns={columns}
                  rowCount={medicines.total}
                  paginationMode="server"
                  paginationModel={{ page: medicines.current_page - 1, pageSize: medicines.per_page }}
                  onPaginationModelChange={handlePaginationModelChange}
                  pageSizeOptions={[20]}
                  disableRowSelectionOnClick
                  sx={{
                     height: '100%',
                     '& .MuiDataGrid-columnHeaderTitle': {
                        fontFamily: 'var(--font-khmer)',
                        fontWeight: 'bold',
                     },
                  }}
               />
            </Box>
         </Box>
      </>
   )
}

export default Medicine
