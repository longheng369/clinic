import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import UnitForm from './partials/createOrEdit'
import { IUnit } from '@/interfaces/IUnit'
import Button from '@/components/button/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'

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

    const { units } = usePage<{
        units: PaginatedData<IUnit>
    }>().props

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
            header: 'Name',
            className: 'font-medium text-gray-900',
            cell: (unit) => unit.name,
        },
        {
            header: 'Description',
            className: 'max-w-xs truncate',
            cell: (unit) => unit.description ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Created',
            className: 'whitespace-nowrap',
            cell: (unit) =>
                new Date(unit.created_at).toLocaleString('en-US', {
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
            cell: (unit) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(unit)} aria-label={`Edit ${unit.name}`}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(unit)} aria-label={`Delete ${unit.name}`}>
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = units

    return (
        <>
            <Head title="Units" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Units</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your clinic units
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        startIcon={<Plus size={20} />}
                    >
                        New Unit
                    </Button>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(unit) => unit.id}
                    columns={columns}
                    emptyMessage="No units found"
                    emptyDescription="Get started by creating a new unit."
                    pagination={pagination}
                    baseUrl="/settings/units"
                />
            </div>
        </>
    )
}

export default Unit
