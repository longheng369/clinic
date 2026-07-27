import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import AppointmentForm from './partials/createOrEdit'
import { IAppointment } from '@/interfaces/IAppointment'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { formatDob } from '@/utils/date'
import { useState, useEffect } from 'react'
import SearchBar from '@/components/searchBar'

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
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
    no_show: 'bg-red-100 text-red-700',
}

const TYPE_BADGES: Record<string, string> = {
    consultation: 'bg-primary-100 text-primary-700',
    vaccination: 'bg-amber-100 text-amber-700',
    follow_up: 'bg-purple-100 text-purple-700',
    checkup: 'bg-teal-100 text-teal-700',
    other: 'bg-gray-100 text-gray-600',
}

const Appointment = () => {
    const { openModal, closeModal, openAlert } = useModal()

    const { appointments, search: searchProp, dateFilter, statusFilter } = usePage<{
        appointments: PaginatedData<IAppointment>
        search: string | null
        dateFilter: string | null
        statusFilter: string | null
    }>().props

    const [searchTerm, setSearchTerm] = useState(searchProp ?? '')
    const [date, setDate] = useState(dateFilter ?? '')
    const [status, setStatus] = useState(statusFilter ?? '')

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params: Record<string, string> = {}
            if (searchTerm) params.search = searchTerm
            if (date) params.date = date
            if (status) params.status = status
            router.get('/appointments', params, { preserveState: true, replace: true })
        }, 300)
        return () => clearTimeout(timeout)
    }, [searchTerm, date, status])

    const baseUrl = '/appointments'

    const handleCreate = () => {
        openModal({
            title: 'New Appointment',
            content: <AppointmentForm onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleEdit = (appointment: IAppointment) => {
        openModal({
            title: 'Edit Appointment',
            content: <AppointmentForm appointment={appointment} onClose={() => closeModal()} />,
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleDelete = (appointment: IAppointment) => {
        openAlert({
            message: 'Delete this appointment?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/appointments/${appointment.id}`),
        })
    }

    const columns: Column<IAppointment>[] = [
        {
            header: 'កាលបរិច្ឆេទ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => formatDob(a.created_at),
        },
        {
            header: 'អ្នកជំងឺ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => a.patient
                ? <span className='font-khmer'>{a.patient.khmer_last_name} {a.patient.khmer_first_name}</span>
                : <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'ប្រភេទ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_BADGES[a.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {a.type.replace('_', ' ')}
                </span>
            ),
        },
        {
            header: 'ស្ថានភាព',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_BADGES[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {a.status.replace('_', ' ')}
                </span>
            ),
        },
        {
            header: 'កាលបរិច្ឆេទណាត់',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => formatDob(a.appointment_date),
        },
        {
            header: 'កំណត់ចំណាំ',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => a.notes ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'ការជូនដំណឹងវ៉ាក់សាំង',
            classNames: { header: 'font-khmer tracking-wide' },
            cell: (a) => a.has_vaccine_alerts
                ? <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">⚠ ជិតដល់</span>
                : <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'សកម្មភាព',
            classNames: { header: 'font-khmer text-end tracking-wide' },
            cell: (a) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(a)} aria-label="Edit appointment">
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(a)} aria-label="Delete appointment">
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = appointments

    return (
        <>
            <Head title="កាលវិភាគ" />
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">កាលវិភាគ</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            គ្រប់គ្រងកាលវិភាគអ្នកជំងឺ
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search patient name'/>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-40 rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-hidden focus:outline-2 focus:outline-primary-500 focus:border-primary-500 transition-all duration-200"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">All status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                        <Button onClick={handleCreate} size="lg" variant="gradient">
                            <Plus size={20} /> New Appointment
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(a) => a.id}
                    columns={columns}
                    emptyMessage="No appointments found"
                    emptyDescription="Create a new appointment to get started."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </>
    )
}

export default Appointment
