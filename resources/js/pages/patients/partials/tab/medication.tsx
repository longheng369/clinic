import { usePage, router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Check, RotateCcw, Square, Plus } from 'lucide-react'
import MedicationForm from './medicationForm'
import { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import { Button } from '@/components/ui/button'
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

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    prescribed: { label: 'Prescribed', className: 'bg-blue-100 text-blue-700' },
    provided: { label: 'Provided', className: 'bg-green-100 text-green-700' },
    continued: { label: 'Continued', className: 'bg-amber-100 text-amber-700' },
    stopped: { label: 'Stopped', className: 'bg-gray-100 text-gray-500' },
}

const MedicationTab = ({ patientId }: { patientId: number }) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { medicationAdministrations, activeVisits, medicines } = usePage<{
        medicationAdministrations: PaginatedData<IMedicationAdministration>
        activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
        medicines: { id: number; name: string }[]
    }>().props

    const activeIpdVisit = activeVisits.find((v) => v.type === 'IPD')

    if (!activeIpdVisit) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Medication</h3>
                <p className="text-sm text-gray-500">Medication administration is only available for admitted (IPD) patients.</p>
            </div>
        )
    }

    const handleCreate = () => {
        openModal({
            title: 'New Prescription',
            content: (
                <MedicationForm
                    patientId={patientId}
                    activeVisits={activeVisits}
                    medicines={medicines}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '2xl' },
        })
    }

    const handleProvide = (m: IMedicationAdministration) => {
        router.post(`/visits/${activeIpdVisit.id}/medications/${m.id}/provide`, {}, {
            onSuccess: () => closeModal(),
        })
    }

    const handleContinue = (m: IMedicationAdministration) => {
        router.post(`/visits/${activeIpdVisit.id}/medications/${m.id}/continue`, {}, {
            onSuccess: () => closeModal(),
        })
    }

    const handleStop = (m: IMedicationAdministration) => {
        openAlert({
            message: 'Stop this medication?',
            description: 'Once stopped, no further doses can be administered.',
            variant: 'danger',
            confirmLabel: 'Stop',
            onConfirm: () =>
                router.post(`/visits/${activeIpdVisit.id}/medications/${m.id}/stop`, {}),
        })
    }

    const columns: Column<IMedicationAdministration>[] = [
        {
            header: 'Medicine',
            cell: (m) => m.medicine?.name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Route',
            cell: (m) => m.route,
        },
        {
            header: 'Dosage',
            cell: (m) => `${m.dosage} ${m.unit}`,
        },
        {
            header: 'Interval',
            cell: (m) => m.interval,
        },
        {
            header: 'Status',
            cell: (m) => {
                const badge = STATUS_BADGE[m.status]
                return (
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                        {badge.label}
                    </span>
                )
            },
        },
        {
            header: 'Recorded By',
            cell: (m) => m.recorded_by ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (m) => {
                if (m.status === 'stopped') return null

                return (
                    <div className="flex items-center justify-end gap-1">
                        {(m.status === 'prescribed' || m.status === 'continued') && (
                            <IconButton onClick={() => handleProvide(m)} aria-label="Provide dose" title="Provide">
                                <Check size={16} />
                            </IconButton>
                        )}
                        {m.status === 'provided' && (
                            <IconButton onClick={() => handleContinue(m)} aria-label="Continue" title="Continue">
                                <RotateCcw size={16} />
                            </IconButton>
                        )}
                        <IconButton color="error" onClick={() => handleStop(m)} aria-label="Stop medication" title="Stop">
                            <Square size={16} />
                        </IconButton>
                    </div>
                )
            },
        },
    ]

    const { data, ...pagination } = medicationAdministrations

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Medication administration records</p>
                <Button onClick={handleCreate}>
                    <Plus size={18} /> New Prescription
                </Button>
            </div>

            <DataTable
                data={data}
                keyExtractor={(m) => m.id}
                columns={columns}
                emptyMessage="No medication records"
                emptyDescription="Prescribe medication for this patient."
                pagination={pagination}
            />
        </div>
    )
}

export default MedicationTab
