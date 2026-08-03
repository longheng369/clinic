import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import PatientForm from './partials/createOrEdit'
import { IPatient } from '@/interfaces/IPatient'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/components/searchBar'
import { formatDob } from '@/utils/date'
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

const Patient = () => {
    const { openModal, openAlert } = useModal()

    const { patients, search: searchProp } = usePage<{
        patients: PaginatedData<IPatient>
        search: string | null
    }>().props

    const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

    useEffect(() => {
        const timeout = setTimeout(() => {
            if ((searchTerm || '') === (searchProp || '')) return
            if (searchTerm) {
                router.get('/patients', { search: searchTerm, page: 1 }, { preserveState: true, replace: true })
            } else {
                router.get('/patients', {}, { preserveState: true, replace: true })
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchTerm])

    const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
        const page = model.page + 1
        const params: Record<string, string | number> = { page }
        if (searchProp) params.search = searchProp
        router.get('/patients', params, { preserveState: true, replace: true })
    }, [searchProp])

    const handleCreate = () => {
        openModal({
            title: <Typography variant='h5' sx={{ fontWeight: 'medium' }}>New Patient</Typography>,
            content: <PatientForm />,
            config: { preventClickAway: true, maxWidth: '4xl' },
        })
    }

    const handleEdit = (patient: IPatient) => {
        openModal({
            title: <Typography variant='h5' sx={{ fontWeight: 'medium' }}>Edit <Typography variant='h6' component='span' sx={{ fontFamily: 'var(--font-khmer)'}}>{patient.khmer_first_name} {patient.khmer_last_name}</Typography></Typography>,
            content: <PatientForm patient={{ ...patient, date_of_birth: formatDob(patient.date_of_birth) }} />,
            config: { preventClickAway: true, maxWidth: '4xl' },
        })
    }

    const handleDelete = (patient: IPatient) => {
        openAlert({
            message: 'Delete this patient?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patient.id}`)
        })
    }

    const columns: GridColDef[] = [
        {
            field: 'khmer_name',
            headerName: 'ឈ្មោះខ្មែរ',
            flex: 1,
            minWidth: 180,
            valueGetter: (_value, row: IPatient) => `${row.khmer_last_name} ${row.khmer_first_name}`,
            renderCell: (params: GridRenderCellParams<IPatient>) =>
                <span className="font-khmer">{params.value}</span>,
        },
        {
            field: 'english_name',
            headerName: 'ឈ្មោះ​ជា​ភាសា​អង់គ្លេស',
            flex: 1,
            minWidth: 180,
            valueGetter: (_value, row: IPatient) =>
                row.first_name ? `${row.last_name ?? ''} ${row.first_name}`.trim() : null,
            renderCell: (params: GridRenderCellParams<IPatient>) =>
                params.value ?? <span className="text-gray-300">&mdash;</span>,
        },
        { field: 'phone_number', headerName: 'លេខទូរស័ព្ទ', flex: 1, minWidth: 130 },
        {
            field: 'gender',
            headerName: 'ភេទ',
            flex: 1,
            minWidth: 90,
            renderCell: (params: GridRenderCellParams<IPatient>) => (
                <span className={`capitalize ${params.value === 'male' ? 'text-blue-600' : 'text-pink-600'}`}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'date_of_birth',
            headerName: 'ថ្ងៃខែឆ្នាំកំណើត',
            flex: 1,
            minWidth: 130,
            valueGetter: (_value, row: IPatient) => formatDob(row.date_of_birth),
        },
        {
            field: 'blood_group',
            headerName: 'ប្រភេទឈាម',
            flex: 1,
            minWidth: 110,
            renderCell: (params: GridRenderCellParams<IPatient>) =>
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
                    label={`View ${params.row.khmer_first_name}`}
                    onClick={() => router.visit(`/patients/${params.id}`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    key={`edit-${params.id}`}
                    icon={<Pencil size={16} className="text-blue-500" />}
                    label={`Edit ${params.row.khmer_first_name}`}
                    onClick={() => handleEdit(params.row as IPatient)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    key={`delete-${params.id}`}
                    icon={<Trash2 size={16} className="text-red-500" />}
                    label={`Delete ${params.row.khmer_first_name}`}
                    onClick={() => handleDelete(params.row as IPatient)}
                    showInMenu={false}
                />,
            ],
        },
    ]

    return (
        <>
            <Head title="Patients" />
            <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'Background', p: 2, borderRadius: 1 }}>
                    <Box>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Patients</Typography>
                        <Typography variant='body2' sx={{ color: 'gray' }}>Manage your clinic patients</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search patient' />
                        <Button
                            onClick={handleCreate}
                            variant='contained'
                            startIcon={<Plus size={16} />}
                        >
                            New Patient
                        </Button>
                    </Box>
                </Box>

                <DataGrid
                    rows={patients.data}
                    columns={columns}
                    rowCount={patients.total}
                    paginationMode="server"
                    paginationModel={{ page: patients.current_page - 1, pageSize: patients.per_page }}
                    onPaginationModelChange={handlePaginationModelChange}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        mt: 3,
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

export default Patient
