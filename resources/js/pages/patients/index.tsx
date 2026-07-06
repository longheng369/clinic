import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Search, X, Eye } from 'lucide-react'
import PatientForm from './partials/createOrEdit'
import { IPatient } from '@/interfaces/IPatient'
import Button from '@/components/button/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import TextInput from '@/components/textInput'
import { useState, useEffect } from 'react'

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

    const handleClear = () => {
        setSearchTerm('')
    }

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
            content: <PatientForm patient={patient} onClose={() => closeModal()} />,
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
            cell: (p) => p.date_of_birth,
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
                    <IconButton onClick={() => handleEdit(p)} aria-label={`Edit ${p.khmer_first_name}`}>
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
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your clinic patients
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <TextInput
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-8 w-64 py-2!"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <Button
                            onClick={handleCreate}
                            startIcon={<Plus size={20} />}
                        >
                            New Patient
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
