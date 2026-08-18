import { usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { ISurveillance } from '@/interfaces/ISurveillance'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid'
import { useCallback } from 'react'
import { formatCreatedDateTime } from '@/utils/date'
import { Box, Typography, Button } from '@mui/material'
import SurveillanceForm from './partials/SurveillanceForm'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

type Props = {
   patientId: number
   visitId: number | null
}

const SurveillanceTab = ({ patientId, visitId }: Props) => {
   const { openModal, closeModal, openAlert } = useModal()
   const { surveillance } = usePage<{
      surveillance: PaginatedData<ISurveillance>
   }>().props
   const { data: rows, total, current_page, per_page } = surveillance

   const handleCreate = () => {
      openModal({
         title: 'New Surveillance Record',
         content: (
            <SurveillanceForm
               patientId={patientId}
               defaultVisitId={visitId}
               onClose={closeModal}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleEdit = (s: ISurveillance) => {
      openModal({
         title: 'Edit Surveillance Record',
         content: (
            <SurveillanceForm
               patientId={patientId}
               surveillance={s}
               defaultVisitId={visitId}
               onClose={closeModal}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleDelete = (s: ISurveillance) => {
      openAlert({
         message: 'Delete this surveillance record?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/patients/${patientId}/surveillance/${s.id}`),
      })
   }

   const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
      router.get(`/patients/${patientId}`, { page: String(model.page + 1), tab: 'surveillance' }, { preserveState: true, replace: true, only: ['surveillance'] })
   }, [patientId])

   const columns: GridColDef[] = [
      {
         field: 'created_at',
         headerName: 'កាលបរិច្ឆេទ',
         flex: 1,
         minWidth: 150,
         valueGetter: (_value, row: ISurveillance) => formatCreatedDateTime(row.created_at),
      },
      {
         field: 'blood_pressure',
         headerName: 'សម្ពាធឈាម',
         flex: 1,
         minWidth: 120,
         valueGetter: (_value, row: ISurveillance) => `${row.systolic}/${row.diastolic}`,
      },
      {
         field: 'pulse',
         headerName: 'ជីពចរ',
         flex: 1,
         minWidth: 90,
      },
      {
         field: 'temperature',
         headerName: 'សីតុណ្ហភាព',
         flex: 1,
         minWidth: 110,
         valueGetter: (_value, row: ISurveillance) => row.temperature.toFixed(1),
      },
      {
         field: 'rr',
         headerName: 'ដង្ហើម',
         flex: 1,
         minWidth: 90,
      },
      {
         field: 'spo2',
         headerName: 'អុកស៊ីសែន',
         flex: 1,
         minWidth: 90,
      },
      {
         field: 'o2_supply',
         headerName: 'ការផ្គត់ផ្គង់ O₂',
         flex: 1,
         minWidth: 140,
      },
      {
         field: 'created_by',
         headerName: 'អ្នកកត់ត្រា',
         flex: 1,
         minWidth: 130,
         renderCell: (params: GridRenderCellParams<ISurveillance>) =>
            params.value ?? <Box>&mdash;</Box>,
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
               label="Edit surveillance"
               onClick={() => handleEdit(params.row as ISurveillance)}
               showInMenu={false}
            />,
            <GridActionsCellItem
               key={`delete-${params.id}`}
               icon={<Trash2 size={16} color="#dc2626" />}
               label="Delete surveillance"
               onClick={() => handleDelete(params.row as ISurveillance)}
               showInMenu={false}
            />,
         ],
      },
   ]

   return (
      <Box>
         <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Vital signs and surveillance records
            </Typography>
            <Button
               variant="contained"
               startIcon={<Plus size={16} />}
               onClick={handleCreate}
            >
               New Record
            </Button>
         </Box>

         <DataGrid
            rows={rows}
            columns={columns}
            rowCount={total}
            paginationMode="server"
            paginationModel={{ page: current_page - 1, pageSize: per_page }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            autoHeight
         />
      </Box>
   )
}

export default SurveillanceTab
