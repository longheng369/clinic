import { Link, router, usePage } from '@inertiajs/react'
import { IParaclinicRequest } from '@/interfaces/IParaclinicRequest'
import DataTable, { type Column } from '@/components/table/DataTable'
import Button from '@/components/button/button'
import { Plus } from 'lucide-react'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

const STATUS_BADGES: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Requested: 'bg-blue-100 text-blue-700',
    'Waiting Result': 'bg-amber-100 text-amber-700',
    'Result Received': 'bg-green-100 text-green-700',
    Reviewed: 'bg-indigo-100 text-indigo-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
}

const ParaclinicByPatientTab = ({ patientId }: { patientId: number }) => {
    const { paraclinicRequests } = usePage<{ paraclinicRequests: PaginatedData<IParaclinicRequest> }>().props

    const columns: Column<IParaclinicRequest>[] = [
        {
            header: 'Request #',
            className: 'font-medium text-gray-900 whitespace-nowrap',
            cell: (r) => (
                <Link href={`/paraclinic-requests/${r.id}`} className="text-primary-600 hover:text-primary-700">
                    {r.request_number}
                </Link>
            ),
        },
        {
            header: 'Doctor',
            cell: (r) => r.doctor?.name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Facility',
            cell: (r) => r.external_facility_name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Date',
            className: 'whitespace-nowrap',
            cell: (r) => r.request_date,
        },
        {
            header: 'Status',
            cell: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[r.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {r.status}
                </span>
            ),
        },
        {
            header: 'Amount',
            className: 'text-end',
            cell: (r) => `$${(r.total_amount ?? 0).toFixed(2)}`,
        },
    ]

    const { data, ...pagination } = paraclinicRequests
    const baseUrl = `/patients/${patientId}`

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Paraclinic test requests for this patient</p>
                <Link href={`/paraclinic-requests?patient_id=${patientId}`}>
                    <Button startIcon={<Plus size={18} />}>New Request</Button>
                </Link>
            </div>

            <DataTable
                data={data}
                keyExtractor={(r) => r.id}
                columns={columns}
                emptyMessage="No paraclinic requests"
                emptyDescription="Create a paraclinic request for this patient."
                pagination={pagination}
                baseUrl={baseUrl}
            />
        </div>
    )
}

export default ParaclinicByPatientTab
