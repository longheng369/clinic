import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import CategoryForm from './partials/createOrEdit'
import { ICategory } from '@/interfaces/ICategory'
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

const Category = () => {
    const { openModal, closeModal, openAlert } = useModal()

    const { categories } = usePage<{
        categories: PaginatedData<ICategory>
    }>().props

    const handleCreate = () => {
        openModal({
            title: 'New Category',
            content: <CategoryForm onClose={() => closeModal()} />,
            config: { preventClickAway: true }
        })
    }

    const handleEdit = (category: ICategory) => {
        openModal({
            title: `Edit ${category.name}`,
            content: <CategoryForm category={category} onClose={() => closeModal()} />,
            config: { preventClickAway: true }
        })
    }

    const handleDelete = (cat: ICategory) => {
        openAlert({
            message: 'Delete this category?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/settings/categories/${cat.id}`)
        })
    }

    const columns: Column<ICategory>[] = [
        {
            header: 'Name',
            className: 'font-medium text-gray-900',
            cell: (cat) => cat.name,
        },
        {
            header: 'Description',
            className: 'max-w-xs truncate',
            cell: (cat) => cat.description ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Created',
            className: 'whitespace-nowrap',
            cell: (cat) =>
                new Date(cat.created_at).toLocaleString('en-US', {
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
            cell: (cat) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(cat)} aria-label={`Edit ${cat.name}`}>
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cat)} aria-label={`Delete ${cat.name}`}>
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = categories

    return (
        <>
            <Head title="Categories" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your clinic categories
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        startIcon={<Plus size={20} />}
                    >
                        New Category
                    </Button>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(cat) => cat.id}
                    columns={columns}
                    emptyMessage="No categories found"
                    emptyDescription="Get started by creating a new category."
                    pagination={pagination}
                    baseUrl="/settings/categories"
                />
            </div>
        </>
    )
}

export default Category
