import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Syringe } from 'lucide-react'
import VaccineForm from './partials/createOrEdit'
import { IVaccine } from '@/interfaces/IVaccine'
import { Button } from '@/components/ui/button'
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
            header: 'Name',
            className: 'font-medium text-gray-900',
            cell: (v) => v.name,
        },
        {
            header: 'Description',
            className: 'max-w-xs truncate',
            cell: (v) => v.description ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Schedule',
            className: 'whitespace-nowrap',
            cell: (v) => (
                <span className="text-xs text-gray-500">{summarizeRules(v)}</span>
            ),
        },
        {
            header: 'Created',
            className: 'whitespace-nowrap',
            cell: (v) => formatCreatedDateTime(v.created_at),
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (v) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(v)} aria-label={`Edit ${v.name}`}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(v)} aria-label={`Delete ${v.name}`}>
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = vaccines

    return (
        <>
            <Head title="Vaccines" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Syringe size={24} className="text-primary-500" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Vaccines</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage vaccine definitions and dose schedules
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search vaccine'/>
                        <Button
                            onClick={handleCreate}
                            size="lg"
                            variant="gradient"
                        >
                            <Plus size={20} /> New Vaccine
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(v) => v.id}
                    columns={columns}
                    emptyMessage="No vaccines found"
                    emptyDescription="Get started by creating a new vaccine."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </>
    )
}

export default Vaccine
