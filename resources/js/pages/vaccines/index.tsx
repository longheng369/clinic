import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Syringe } from 'lucide-react'
import VaccineForm from './partials/createOrEdit'
import { IVaccine } from '@/interfaces/IVaccine'
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

const Vaccine = () => {
   const { openModal, closeModal, openAlert } = useModal()

   const { vaccines, search: searchProp } = usePage<{
        vaccines: PaginatedData<IVaccine>
        search: string | null
    }>().props

   const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

   useEffect(() => {
      const timeout = setTimeout(() => {
         if ((searchTerm || '') === (searchProp || '')) return
         if (searchTerm) {
            router.get('/vaccines', { search: searchTerm }, { preserveState: true, replace: true })
         } else {
            router.get('/vaccines', {}, { preserveState: true, replace: true })
         }
      }, 300)

      return () => clearTimeout(timeout)
   }, [searchTerm])

   const baseUrl = searchProp
      ? `/vaccines?search=${encodeURIComponent(searchProp)}`
      : '/vaccines'

   const handleCreate = () => {
      openModal({
         title: 'New Vaccine',
         content: <VaccineForm onClose={() => closeModal()} />,
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleEdit = (vaccine: IVaccine) => {
      openModal({
         title: `Edit ${vaccine.name}`,
         content: <VaccineForm vaccine={vaccine} onClose={() => closeModal()} />,
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleDelete = (vaccine: IVaccine) => {
      openAlert({
         message: 'Delete this vaccine?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/vaccines/${vaccine.id}`),
      })
   }

   const summarizeRules = (vaccine: IVaccine): string => {
      const ruleCount = vaccine.rules.length
      const totalDoses = vaccine.rules.reduce((sum, r) => sum + r.doses.length, 0)
      if (ruleCount === 1) {
         return `${totalDoses} dose${totalDoses > 1 ? 's' : ''}`
      }
      return `${ruleCount} age rules, ${totalDoses} doses total`
   }

   const columns: Column<IVaccine>[] = [
      {
         header: 'ឈ្មោះ',
         classNames: {},
         cell: (v) => v.name,
      },
      {
         header: 'ការពិពណ៌នា',
         classNames: {},
         cell: (v) => v.description ?? <Typography component="span" sx={{ color: 'text.disabled' }}>&mdash;</Typography>,
      },
      {
         header: 'កាលវិភាគ',
         classNames: {},
         cell: (v) => (
            <Typography component="span" variant="body2" color="text.secondary">{summarizeRules(v)}</Typography>
         ),
      },
      {
         header: 'បានបង្កើត',
         classNames: {},
         cell: (v) => formatCreatedDateTime(v.created_at),
      },
      {
         header: 'សកម្មភាព',
         classNames: {},
         cell: (v) => (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
               <IconButton onClick={() => handleEdit(v)} aria-label={`Edit ${v.name}`}>
                  <Pencil size={16} />
               </IconButton>
               <IconButton color="error" onClick={() => handleDelete(v)} aria-label={`Delete ${v.name}`}>
                  <Trash2 size={16} />
               </IconButton>
            </Stack>
         ),
      },
   ]

   const { data, ...pagination } = vaccines

   return (
      <>
         <Head title="Vaccines" />
         <Box sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{mb: 3, alignItems: { md: 'center' , justifyContent: 'space-between'}}}>
               <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Syringe size={24} color="var(--mui-palette-primary-main)" />
                  <Box>
                     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Vaccines</Typography>
                     <Typography variant="body2" color="text.secondary">Manage vaccine definitions and dose schedules</Typography>
                  </Box>
               </Stack>
               <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search vaccine'/>
                  <Button
                     onClick={handleCreate}
                     size="large"
                     variant="contained"
                  >
                     <Plus size={20} /> New Vaccine
                  </Button>
               </Stack>
            </Stack>

            <DataTable
               data={data}
               keyExtractor={(v) => v.id}
               columns={columns}
               emptyMessage="No vaccines found"
               emptyDescription="Get started by creating a new vaccine."
               pagination={pagination}
               baseUrl={baseUrl}
            />
         </Box>
      </>
   )
}

export default Vaccine
