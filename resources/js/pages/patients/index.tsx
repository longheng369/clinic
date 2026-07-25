import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import PatientForm from './partials/createOrEdit'
import { IPatient } from '@/interfaces/IPatient'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { useState, useEffect } from 'react'
import SearchBar from '@/components/searchBar'
import { formatDob } from '@/utils/date'

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
    const { openModal, closeModal, openAlert } = useModal()

    const { patients, search: searchProp } = usePage<{
        patients: PaginatedData<IPatient>
        search: string | null
    }>().props

    const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

    useEffect(() => {
        const timeout = setTimeout(() => {
            if ((searchTerm || '') === (searchProp || '')) return
            if (searchTerm) {
                router.get('/patients', { search: searchTerm }, { preserveState: true, replace: true })
            } else {
                router.get('/patients', {}, { preserveState: true, replace: true })
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchTerm])

    const baseUrl = searchProp
        ? `/patients?search=${encodeURIComponent(searchProp)}`
        : '/patients'

    const handleCreate = () => {
        openModal({
            title: 'New Patient',
            content: <PatientForm onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '4xl' }
        })
    }

    const handleEdit = (patient: IPatient) => {
        openModal({
            title: `Edit ${patient.khmer_first_name} ${patient.khmer_last_name}`,
            content: <PatientForm patient={{...patient, date_of_birth: formatDob(patient.date_of_birth)}} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '4xl' }
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

    const columns: Column<IPatient>[] = [
        {
            header: 'Khmer Name',
            className: 'font-medium text-gray-900',
            cell: (p) => <span className='font-khmer text-[16px]'>{p.khmer_last_name} {p.khmer_first_name}</span>,
        },
        {
            header: 'English Name',
            className: '',
            cell: (p) => p.first_name
                ? `${p.last_name ?? ''} ${p.first_name}`.trim()
                : <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Phone',
            className: 'whitespace-nowrap',
            cell: (p) => p.phone_number,
        },
        {
            header: 'Gender',
            className: '',
            cell: (p) => (
                <span className={`capitalize ${p.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`}>
                    {p.gender}
                </span>
            ),
        },
        {
            header: 'DOB',
            className: 'whitespace-nowrap',
            cell: (p) => formatDob(p.date_of_birth),
        },
        {
            header: 'Blood',
            className: '',
            cell: (p) => p.blood_group ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (p) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => router.visit(`/patients/${p.id}`)} aria-label={`View ${p.khmer_first_name}`}>
                        <Eye size={16} />
                    </IconButton>
                    <IconButton color='info' onClick={() => handleEdit(p)} aria-label={`Edit ${p.khmer_first_name}`}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(p)} aria-label={`Delete ${p.khmer_first_name}`}>
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = patients

    return (
        <>
            <Head title="Patients" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Manage your clinic patients
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search patient'/>
                        <Button onClick={handleCreate} size="lg" variant="gradient">
                            <Plus size={20} /> New Patient
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(p) => p.id}
                    columns={columns}
                    emptyMessage="No patients found"
                    emptyDescription="Get started by creating a new patient."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </>
    )
}

export default Patient
