import { router, usePage, Link as InertiaLink } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { IConsultation } from '@/interfaces/IConsultation'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid'
import { useCallback } from 'react'
import type React from 'react'
import { formatCreatedDateTime } from '@/utils/date'
import { Box, Button, Typography } from '@mui/material'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

const ConsultationTab = ({ patientId }: { patientId: number }) => {
   const { openAlert } = useModal()
   const { consultations } = usePage<{ consultations: PaginatedData<IConsultation> }>().props
   const { data: rows, total, current_page, per_page } = consultations

   const handleDelete = (consultation: IConsultation) => {
      openAlert({
         message: 'Delete this consultation?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/patients/${patientId}/consultations/${consultation.id}`),
      })
   }

   const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
      router.get(`/patients/${patientId}`, { page: String(model.page + 1), tab: 'consultation' }, { preserveState: true, replace: true })
   }, [patientId])

   const columns: GridColDef[] = [
      {
         field: 'created_at',
         headerName: 'កាលបរិច្ឆេទ',
         flex: 1,
         minWidth: 150,
         valueGetter: (_value, row: IConsultation) => formatCreatedDateTime(row.created_at),
      },
      {
         field: 'chief_complaint',
         headerName: 'រោគសញ្ញាចំបង',
         flex: 2,
         minWidth: 220,
         renderCell: (params: GridRenderCellParams<IConsultation>) => (
            <Box component="span" sx={{ display: 'block', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
               {params.value}
            </Box>
         ),
      },
      {
         field: 'diagnosis',
         headerName: 'រោគវិនិច្ឆ័យ',
         flex: 1,
         minWidth: 150,
         renderCell: (params: GridRenderCellParams<IConsultation>) =>
            params.value ?? <span className="text-gray-300">&mdash;</span>,
      },
      {
         field: 'weight',
         headerName: 'ទម្ងន់ (គីឡូក្រាម)',
         flex: 1,
         minWidth: 120,
         renderCell: (params: GridRenderCellParams<IConsultation>) =>
            params.value ?? <span className="text-gray-300">&mdash;</span>,
      },
      {
         field: 'fee',
         headerName: 'តម្លៃ ($)',
         flex: 1,
         minWidth: 110,
         valueGetter: (_: never, row: IConsultation) => row.fee != null ? row.fee.toFixed(2) : null,
         renderCell: (params: GridRenderCellParams<IConsultation>) =>
            params.value ?? <span className="text-gray-300">&mdash;</span>,
      },
      {
         field: 'recorded_by',
         headerName: 'អ្នកកត់ត្រា',
         flex: 1,
         minWidth: 130,
         renderCell: (params: GridRenderCellParams<IConsultation>) =>
            params.value ?? <span className="text-gray-300">&mdash;</span>,
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'សកម្មភាព',
         width: 150,
         getActions: (params) => [
            <GridActionsCellItem
               key={`view-${params.id}`}
               icon={<Eye size={16} className="text-gray-500" />}
               label="View consultation"
               onClick={() => router.visit(`/patients/${patientId}/consultations/${params.row.id}`)}
               showInMenu={false}
            />,
            <GridActionsCellItem
               key={`edit-${params.id}`}
               icon={<Pencil size={16} className="text-blue-500" />}
               label="Edit consultation"
               onClick={() => router.visit(`/patients/${patientId}/consultations/${params.row.id}/edit`)}
               showInMenu={false}
            />,
            <GridActionsCellItem
               key={`delete-${params.id}`}
               icon={<Trash2 size={16} className="text-red-500" />}
               label="Delete consultation"
               onClick={() => handleDelete(params.row as IConsultation)}
               showInMenu={false}
            />,
         ],
      },
   ]

   return (
      <Box>
         <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Consultation records for this patient
            </Typography>
            <Button
               component={InertiaLink as React.ElementType}
               href={`/patients/${patientId}/consultations/create`}
               variant="contained"
               startIcon={<Plus size={16} />}
            >
                    New Consultation
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
            sx={{
               '& .MuiDataGrid-columnHeaderTitle': {
                  fontFamily: 'var(--font-khmer)',
                  fontWeight: 'bold',
               },
            }}
         />
      </Box>
   )
}

export default ConsultationTab