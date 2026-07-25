import { usePage, router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import SurveillanceForm from './surveillanceForm'
import { ISurveillance } from '@/interfaces/ISurveillance'
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

interface SelectedVisit {
    id: number
    type: string
    visit_date: string
    status: string
    recorded_by?: string
}

const SurveillanceTab = ({ patientId, selectedVisit }: { patientId: number; selectedVisit: SelectedVisit | null }) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { surveillances, allVisits } = usePage<{ surveillances: PaginatedData<ISurveillance>; allVisits: { id: number; type: string; visit_date: string; status: string }[] }>().props

    if (!selectedVisit) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Surveillance</h3>
                <p className="text-sm text-gray-500">Select a visit to view surveillance records.</p>
            </div>
        )
    }

    const handleCreate = () => {
        openModal({
            title: 'New Surveillance Record',
            content: (
                <SurveillanceForm
                    patientId={patientId}
                    allVisits={allVisits}
                    selectedVisitId={selectedVisit.id}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleEdit = (s: ISurveillance) => {
        openModal({
            title: 'Edit Surveillance Record',
            content: (
                <SurveillanceForm
                    patientId={patientId}
                    surveillance={s}
                    allVisits={allVisits}
                    selectedVisitId={selectedVisit.id}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleDelete = (s: ISurveillance) => {
        openAlert({
            message: 'Delete this surveillance record?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patientId}/surveillances/${s.id}`),
        })
    }

    const columns: Column<ISurveillance>[] = [
        {
            header: 'Date',
            className: 'whitespace-nowrap',
            cell: (s) => formatCreatedDateTime(s.created_at),
        },
        {
            header: 'BP (mmHg)',
            className: 'whitespace-nowrap',
            cell: (s) => `${s.systolic}/${s.diastolic}`,
        },
        {
            header: 'Pulse (bpm)',
            cell: (s) => s.pulse,
        },
        {
            header: 'Temp (°C)',
            cell: (s) => s.temperature.toFixed(1),
        },
        {
            header: 'RR (/min)',
            cell: (s) => s.rr,
        },
        {
            header: 'SpO₂ (%)',
            cell: (s) => s.spo2,
        },
        {
            header: 'O₂ Supply',
            cell: (s) => s.o2_supply,
        },
        {
            header: 'Recorded By',
            cell: (s) => s.recorded_by ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (s) => (
                <div className="flex items-center justify-end">
                    <IconButton onClick={() => handleEdit(s)} aria-label="Edit surveillance">
                        <Pencil size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(s)} aria-label="Delete surveillance">
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = surveillances
    const baseUrl = `/patients/${patientId}`

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Vital signs and surveillance records</p>
                <Button onClick={handleCreate}>
                    <Plus size={18} /> New Record
                </Button>
            </div>

            <DataTable
                data={data}
                keyExtractor={(s) => s.id}
                columns={columns}
                emptyMessage="No surveillance records"
                emptyDescription="Record vital signs for this patient."
                pagination={pagination}
                baseUrl={baseUrl}
            />
        </div>
    )
}

export default SurveillanceTab