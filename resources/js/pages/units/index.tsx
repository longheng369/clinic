import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import UnitForm from './partials/createOrEdit'
import { IUnit } from '@/interfaces/IUnit'
import { Box, Button, Stack, Typography } from '@mui/material'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { useState, useEffect } from 'react'
import SearchBar from '@/components/searchBar'
import { formatCreatedDateTime } from '@/utils/date'

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
            router.get('/settings/units', { search: searchTerm }, { preserveState: true, replace: true })
         } else {
            router.get('/settings/units', {}, { preserveState: true, replace: true })
         }
      }, 300)

      return () => clearTimeout(timeout)
   }, [searchTerm])

   const baseUrl = searchProp
      ? `/settings/units?search=${encodeURIComponent(searchProp)}`
      : '/settings/units'

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

   const columns: Column<IUnit>[] = [
      {
         header: 'ឈ្មោះ',
         classNames: {},
         cell: (unit) => unit.name,
      },
      {
         header: 'ការពិពណ៌នា',
         classNames: {},
         cell: (unit) => unit.description ?? <Typography component="span" sx={{ color: 'text.disabled' }}>&mdash;</Typography>,
      },
      {
         header: 'បានបង្កើត',
         classNames: {},
         cell: (unit) => formatCreatedDateTime(unit.created_at),
      },
      {
         header: 'សកម្មភាព',
         classNames: {},
         cell: (unit) => (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
               <IconButton onClick={() => handleEdit(unit)} aria-label={`Edit ${unit.name}`}>
                  <Pencil size={16} />
               </IconButton>
               <IconButton color="error" onClick={() => handleDelete(unit)} aria-label={`Delete ${unit.name}`}>
                  <Trash2 size={16} />
               </IconButton>
            </Stack>
         ),
      },
   ]

   const { data, ...pagination } = units

   return (
      <>
         <Head title="Units" />
         <Box sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{mb: 3, alignItems: { md: 'center' , justifyContent: 'space-between'}}}>
               <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Units</Typography>
                  <Typography variant="body2" color="text.secondary">
                            Manage your clinic units
                  </Typography>
               </Box>
               <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search unit'/>
                  <Button
                     onClick={handleCreate}
                     size="large"
                     variant="contained"
                  >
                     <Plus size={20} /> New Unit
                  </Button>
               </Stack>
            </Stack>

            <DataTable
               data={data}
               keyExtractor={(unit) => unit.id}
               columns={columns}
               emptyMessage="No units found"
               emptyDescription="Get started by creating a new unit."
               pagination={pagination}
               baseUrl={baseUrl}
            />
         </Box>
      </>
   )
}

export default Unit
