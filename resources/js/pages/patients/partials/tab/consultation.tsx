import { Link, router, usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { IConsultation } from '@/interfaces/IConsultation'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
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

const ConsultationTab = ({ patientId }: { patientId: number }) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { consultations } = usePage<{ consultations: PaginatedData<IConsultation> }>().props

    const handleDelete = (c: IConsultation) => {
        openAlert({
            message: 'Delete this consultation?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patientId}/consultations/${c.id}`),
        })
    }

    const columns: Column<IConsultation>[] = [
        {
            header: 'កាលបរិច្ឆេទ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => formatCreatedDateTime(c.created_at),
        },
        {
            header: 'រោគសញ្ញាចម្បង',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => (
                <span className="max-w-xs truncate block">{c.chief_complaint}</span>
            ),
        },
        {
            header: 'រោគវិនិច្ឆ័យ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => c.diagnosis ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'ទម្ងន់ (គីឡូក្រាម)',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => c.weight ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'តម្លៃ ($)',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => c.fee != null ? c.fee.toFixed(2) : <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'អ្នកកត់ត្រា',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (c) => c.recorded_by ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'សកម្មភាព',
            classNames: { header: 'font-khmer text-end tracking-wide' },
            cell: (c) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => router.visit(`/patients/${patientId}/consultations/${c.id}`)} aria-label="View consultation">
                        <Eye size={16} />
                    </IconButton>
                    <IconButton onClick={() => router.visit(`/patients/${patientId}/consultations/${c.id}/edit`)} aria-label="Edit consultation">
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(c)} aria-label="Delete consultation">
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = consultations
    const baseUrl = `/patients/${patientId}`

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Consultation records for this patient</p>
                <Link href={`/patients/${patientId}/consultations/create`}>
                    <Button variant="gradient"><Plus size={18} /> New Consultation</Button>
                </Link>
            </div>

            <DataTable
                data={data}
                keyExtractor={(c) => c.id}
                columns={columns}
                emptyMessage="No consultation records"
                emptyDescription="Create a consultation for this patient."
                pagination={pagination}
                baseUrl={baseUrl}
            />
        </div>
    )
}

export default ConsultationTab
