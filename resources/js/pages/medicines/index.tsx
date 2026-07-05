import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Search, X } from 'lucide-react'
import MedicineForm from './partials/createOrEdit'
import { IMedicine } from '@/interfaces/IMedicine'
import { IUnit } from '@/interfaces/IUnit';
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

const Medicine = () => {
    const { openModal, closeModal, openAlert } = useModal()

    const { medicines, units, search: searchProp } = usePage<{
        medicines: PaginatedData<IMedicine>
        units: IUnit[]
        search: string | null
    }>().props

    const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm === searchProp) return
            if (searchTerm) {
                router.get('/medicines', { search: searchTerm }, { preserveState: true, replace: true })
            } else {
                router.get('/medicines', {}, { preserveState: true, replace: true })
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchTerm])

    const handleClear = () => {
        setSearchTerm('')
    }

    const baseUrl = searchProp
        ? `/medicines?search=${encodeURIComponent(searchProp)}`
        : '/medicines'

    const handleCreate = () => {
        openModal({
            title: 'New Medicine',
            content: <MedicineForm units={units} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleEdit = (medicine: IMedicine) => {
        openModal({
            title: `Edit ${medicine.name}`,
            content: <MedicineForm medicine={medicine} units={units} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '2xl' }
        })
    }

    const handleDelete = (medicine: IMedicine) => {
        openAlert({
            message: 'Delete this medicine?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/medicines/${medicine.id}`)
        })
    }

    const columns: Column<IMedicine>[] = [
        {
            header: 'Name',
            className: 'font-medium text-gray-900',
            cell: (med) => med.name,
        },
        {
            header: 'Type',
            cell: (med) => med.type,
        },
        {
            header: 'Category',
            cell: (med) => med.category?.name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Unit',
            cell: (med) => med.unit?.name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Dosage',
            cell: (med) => med.dosage ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Unit Price',
            cell: (med) => med.unit_price != null ? `$${Number(med.unit_price).toFixed(2)}` : <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Created',
            className: 'whitespace-nowrap',
            cell: (med) =>
                new Date(med.created_at).toLocaleString('en-US', {
                    timeZone: 'Asia/Phnom_Penh',
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }),
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (med) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(med)} aria-label={`Edit ${med.name}`}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(med)} aria-label={`Delete ${med.name}`}>
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = medicines

    return (
        <>
            <Head title="Medicines" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your clinic medicines
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <TextInput
                                type="text"
                                placeholder="Search medicines..."
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
                            New Medicine
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(med) => med.id}
                    columns={columns}
                    emptyMessage="No medicines found"
                    emptyDescription="Get started by creating a new medicine."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </>
    )
}

export default Medicine
