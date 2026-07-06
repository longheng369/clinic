import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus, Search, X, Eye, ArrowUpDown } from 'lucide-react'
import ParaclinicForm from './partials/createOrEdit'
import { IParaclinicRequest } from '@/interfaces/IParaclinicRequest'
import Button from '@/components/button/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import TextInput from '@/components/textInput'
import Select from '@/components/form/select'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

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

const PAYMENT_BADGES: Record<string, string> = {
    Unpaid: 'bg-red-50 text-red-600',
    Partial: 'bg-amber-50 text-amber-600',
    Paid: 'bg-green-50 text-green-600',
}

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Requested', label: 'Requested' },
    { value: 'Waiting Result', label: 'Waiting Result' },
    { value: 'Result Received', label: 'Result Received' },
    { value: 'Reviewed', label: 'Reviewed' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
]

const PAYMENT_OPTIONS = [
    { value: '', label: 'All Payments' },
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Paid', label: 'Paid' },
]

const Index = () => {
    const { openModal, closeModal, openAlert } = useModal()
    const { requests, search: searchProp, filters, auth } = usePage<{
        requests: PaginatedData<IParaclinicRequest>
        search: string | null
        filters: { status: string | null; payment_status: string | null; date_from: string | null; date_to: string | null }
        auth: { user: { id: number; name: string } }
    }>().props

    const [searchTerm, setSearchTerm] = useState(searchProp ?? '')
    const { control, watch } = useForm({ defaultValues: { status: filters.status ?? '', payment_status: filters.payment_status ?? '' } })
    const filterStatus = watch('status')
    const filterPayment = watch('payment_status')

    useEffect(() => {
        const timeout = setTimeout(() => {
            if ((searchTerm || '') === (searchProp || '')) return
            if (searchTerm) {
                router.get('/paraclinic-requests', { search: searchTerm }, { preserveState: true, replace: true })
            } else {
                router.get('/paraclinic-requests', {}, { preserveState: true, replace: true })
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [searchTerm])

    useEffect(() => {
        const params: Record<string, string> = {}
        if (filterStatus) params.status = filterStatus
        if (filterPayment) params.payment_status = filterPayment
        router.get('/paraclinic-requests', params, { preserveState: true, replace: true })
    }, [filterStatus, filterPayment])

    const handleClear = () => setSearchTerm('')

    const baseUrl = searchProp
        ? `/paraclinic-requests?search=${encodeURIComponent(searchProp)}`
        : '/paraclinic-requests'

    const handleCreate = () => {
        openModal({
            title: 'New Paraclinic Request',
            content: <ParaclinicForm authUser={auth.user} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '4xl' },
        })
    }

    const handleEdit = (r: IParaclinicRequest) => {
        openModal({
            title: `Edit Request ${r.request_number}`,
            content: <ParaclinicForm request={r} authUser={auth.user} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '4xl' },
        })
    }

    const handleDelete = (r: IParaclinicRequest) => {
        openAlert({
            message: `Delete request ${r.request_number}?`,
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/paraclinic-requests/${r.id}`),
        })
    }

    const columns: Column<IParaclinicRequest>[] = [
        {
            header: 'Request #',
            className: 'font-medium text-gray-900 whitespace-nowrap',
            cell: (r) => r.request_number,
        },
        {
            header: 'Patient',
            cell: (r) => r.patient ? `${r.patient.khmer_last_name} ${r.patient.khmer_first_name}` : <span className="text-gray-300">&mdash;</span>,
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
            header: 'Payment',
            cell: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_BADGES[r.payment_status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {r.payment_status}
                </span>
            ),
        },
        {
            header: 'Amount',
            className: 'text-end whitespace-nowrap',
            cell: (r) => `$${(r.total_amount ?? 0).toFixed(2)}`,
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (r) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => router.visit(`/paraclinic-requests/${r.id}`)} aria-label="View request">
                        <Eye size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(r)} aria-label="Edit request">
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(r)} aria-label="Delete request">
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = requests

    return (
        <>
            <Head title="Paraclinic Requests" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Paraclinic Requests</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage diagnostic test requests for patients</p>
                    </div>
                    <Button onClick={handleCreate} startIcon={<Plus size={20} />}>
                        New Request
                    </Button>
                </div>

                <div className="mb-4 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <TextInput
                            type="text"
                            placeholder="Search by request number or patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-8 w-full py-2!"
                        />
                        {searchTerm && (
                            <button type="button" onClick={handleClear} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="w-44">
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                router.get('/paraclinic-requests', { status: e.target.value || null }, { preserveState: true, replace: true })
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-44">
                        <select
                            value={filterPayment}
                            onChange={(e) => {
                                router.get('/paraclinic-requests', { payment_status: e.target.value || null }, { preserveState: true, replace: true })
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        >
                            {PAYMENT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(r) => r.id}
                    columns={columns}
                    emptyMessage="No paraclinic requests found"
                    emptyDescription="Get started by creating a new request."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </>
    )
}

export default Index
