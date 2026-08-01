import { Head, usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus } from 'lucide-react'
import MedicineForm from './partials/createOrEdit'
import { IUnit } from '@/interfaces/IUnit';
import Button from '@mui/material/Button'

const Medicine = () => {
    const { openModal, closeModal } = useModal()

    const { units } = usePage<{
        units: IUnit[]
    }>().props

    const handleCreate = () => {
        openModal({
            title: 'New Medicine',
            content: <MedicineForm units={units} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    // const columns: Column<IMedicine>[] = [
    //     {
    //         header: 'ឈ្មោះ',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.name,
    //     },
    //     {
    //         header: 'ប្រភេទ',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.type,
    //     },
    //     {
    //         header: 'ប្រភេទចំណាត់ថ្នាក់',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.category?.name ?? <span className="text-gray-300">&mdash;</span>,
    //     },
    //     {
    //         header: 'ឯកតា',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.unit?.name ?? <span className="text-gray-300">&mdash;</span>,
    //     },
    //     {
    //         header: 'កម្រិត',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.dosage ?? <span className="text-gray-300">&mdash;</span>,
    //     },
    //     {
    //         header: 'តម្លៃឯកតា',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => med.unit_price != null ? `$${Number(med.unit_price).toFixed(2)}` : <span className="text-gray-300">&mdash;</span>,
    //     },
    //     {
    //         header: 'បានបង្កើត',
    //         classNames: { header: 'font-khmer tracking-wide' },
    //         cell: (med) => formatCreatedDateTime(med.created_at)
    //     },
    //     {
    //         header: 'សកម្មភាព',
    //         classNames: { header: 'font-khmer text-end tracking-wide' },
    //         cell: (med) => (
    //             <div className="flex items-center justify-end">
    //                 <IconButton onClick={() => handleEdit(med)} aria-label={`Edit ${med.name}`}>
    //                     <Pencil size={16} />
    //                 </IconButton>
    //                 <IconButton color="error" onClick={() => handleDelete(med)} aria-label={`Delete ${med.name}`}>
    //                     <Trash2 size={16} />
    //                 </IconButton>
    //             </div>
    //         ),
    //     },
    // ]

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
                    </div>

                    <Button onClick={handleCreate} variant='contained' startIcon={<Plus size={16} />}>New Medicine</Button>
                </div>

                {/* <DataTable
                    data={data}
                    keyExtractor={(med) => med.id}
                    columns={columns}
                    emptyMessage="No medicines found"
                    emptyDescription="Get started by creating a new medicine."
                    pagination={pagination}
                    baseUrl={baseUrl}
                /> */}
            </div>
        </>
    )
}

export default Medicine
