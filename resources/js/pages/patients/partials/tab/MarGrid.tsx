import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, StopCircle, Play, Pause, RotateCcw } from 'lucide-react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import type { IPatient } from '@/interfaces/IPatient'
import MarGridCell from './MarGridCell'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import { formatDob } from '@/utils/date'
import { cn } from '@/utils/cn'

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700' },
    stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
}

const DOSE_TIMES: Record<string, string[]> = {
    QD: ['08:00'],
    BID: ['08:00', '20:00'],
    TID: ['08:00', '14:00', '20:00'],
    QID: ['08:00', '12:00', '18:00', '22:00'],
    QHS: ['22:00'],
    PRN: ['08:00'],
}

function getTimeSlots(interval: string): string[] {
    return DOSE_TIMES[interval] ?? ['08:00']
}

function formatDate(date: Date): string {
    const m = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    const d = date.toLocaleDateString('en-US', { weekday: 'short' })
    return `${d} ${m}`
}

function toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function buildDateRange(doses: IMedicationDose[]): string[] {
    let earliest: Date | null = null
    let latest: Date | null = null

    for (const dose of doses) {
        const d = new Date(dose.scheduled_at)
        if (!earliest || d < earliest) earliest = d
        if (!latest || d > latest) latest = d
    }

    if (!earliest || !latest) {
        earliest = new Date()
        latest = new Date()
        latest.setDate(latest.getDate() + 0)
    }

    const start = new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate())
    const end = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate())

    const dates: string[] = []
    const cursor = new Date(start)
    while (cursor <= end) {
        dates.push(toDateKey(cursor))
        cursor.setDate(cursor.getDate() + 1)
    }
    return dates
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

function collectInitials(medications: IMedicationAdministration[]): Map<string, string> {
    const map = new Map<string, string>()
    for (const m of medications) {
        for (const d of m.doses) {
            if (d.administered_by && d.status === 'provided') {
                const initials = getInitials(d.administered_by)
                if (!map.has(initials)) {
                    map.set(initials, d.administered_by)
                }
            }
        }
    }
    return map
}

interface MarGridProps {
    patient: IPatient
    medications: IMedicationAdministration[]
    visitId: number
    onEdit: (medication: IMedicationAdministration) => void
}

const MarGrid = ({ patient, medications, visitId, onEdit }: MarGridProps) => {
    const { openAlert } = useModal()

    const allDoses = medications.flatMap((m) => m.doses)
    const dateColumns = buildDateRange(allDoses)
    const initialsMap = collectInitials(medications)

    const handleStop = (m: IMedicationAdministration) => {
        openAlert({
            message: `Stop ${m.medicine?.name ?? 'medication'}?`,
            description: 'All pending doses will be cancelled.',
            variant: 'danger',
            confirmLabel: 'Stop',
            onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/stop`, {}),
        })
    }

    const handleContinue = (m: IMedicationAdministration) => {
        openAlert({
            message: `Continue ${m.medicine?.name ?? 'medication'}?`,
            description: `A new treatment cycle will begin (Cycle ${m.cycle_no + 1}).`,
            variant: 'info',
            confirmLabel: 'Continue',
            onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/continue`, {}),
        })
    }

    const handleHold = (m: IMedicationAdministration) => {
        openAlert({
            message: `Place ${m.medicine?.name ?? 'medication'} on hold?`,
            description: 'Doses cannot be administered while on hold.',
            variant: 'warning',
            confirmLabel: 'Hold',
            onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/hold`, {}),
        })
    }

    const handleResume = (m: IMedicationAdministration) => {
        router.post(`/visits/${visitId}/medications/${m.id}/resume`, {})
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Patient MAR Header */}
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4 flex-wrap">
                    <div>
                        <span className="text-sm font-semibold text-gray-900">
                            {patient.khmer_last_name} {patient.khmer_first_name}
                        </span>
                        {patient.first_name && (
                            <span className="ml-1.5 text-sm text-gray-500">
                                ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
                            </span>
                        )}
                    </div>
                    <span className="text-gray-300">&middot;</span>
                    <span className="text-xs text-gray-500">
                        DOB: {formatDob(patient.date_of_birth)}
                    </span>
                    {patient.blood_group && (
                        <>
                            <span className="text-gray-300">&middot;</span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600`}>
                                {patient.blood_group}
                            </span>
                        </>
                    )}
                    {patient.allergy && (
                        <>
                            <span className="text-gray-300">&middot;</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                                Allergy: {patient.allergy}
                            </span>
                        </>
                    )}
                    {dateColumns.length > 0 && (
                        <>
                            <span className="text-gray-300">&middot;</span>
                            <span className="text-xs text-gray-400">
                                {dateColumns[0].slice(5)} – {dateColumns[dateColumns.length - 1].slice(5)}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Grid Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 min-w-[280px]">
                                Medication
                            </th>
                            {dateColumns.map((dateKey) => (
                                <th key={dateKey} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 min-w-[96px]">
                                    {formatDate(new Date(dateKey + 'T00:00:00'))}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((medication) => {
                            const statusBadge = ORDER_STATUS[medication.status] ?? ORDER_STATUS.active
                            const medicineName = medication.medicine?.name ?? 'Unknown'
                            const unitPrice = medication.medicine?.unit_price

                            const hasAdministrationActivity = medication.doses.some(
                                (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
                            )
                            const canEdit = !hasAdministrationActivity && (medication.status === 'active' || medication.status === 'on_hold')

                            const timeSlots = getTimeSlots(medication.interval)

                            const doseMap = new Map<string, IMedicationDose>()
                            for (const dose of medication.doses) {
                                doseMap.set(dose.scheduled_at.slice(0, 16), dose)
                            }

                            return (
                                <tr
                                    key={medication.id}
                                    className={cn(
                                        'group border-b border-gray-100',
                                        medication.status === 'stopped' && 'bg-yellow-50/30'
                                    )}
                                >
                                    {/* Medication Info Column */}
                                    <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 px-4 py-3 border-r border-gray-100 min-w-[280px]">
                                        {medication.status === 'stopped' && (
                                            <div className="bg-yellow-50/50 -mx-4 -my-3 px-4 py-3" />
                                        )}
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">{medicineName}</span>
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadge.className}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{medication.dosage} {medication.unit}</span>
                                                <span className="text-gray-300">&middot;</span>
                                                <span className="text-xs text-gray-500">{medication.route}</span>
                                                <span className="text-gray-300">&middot;</span>
                                                <span className="text-xs text-gray-500">{medication.interval}</span>
                                                {unitPrice != null && (
                                                    <>
                                                        <span className="text-gray-300">&middot;</span>
                                                        <span className="text-xs text-gray-500">${Number(unitPrice).toFixed(2)}/dose</span>
                                                    </>
                                                )}
                                            </div>
                                            {medication.recorded_by && (
                                                <span className="text-xs text-gray-400">Dr. {medication.recorded_by}</span>
                                            )}
                                            {medication.notes && (
                                                <p className="mt-1 text-xs text-gray-400 truncate max-w-[260px]">{medication.notes}</p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 mt-2">
                                                {canEdit && (
                                                    <IconButton onClick={() => onEdit(medication)} aria-label="Edit order" title="Edit">
                                                        <Pencil size={14} />
                                                    </IconButton>
                                                )}
                                                {medication.status === 'active' && (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => handleHold(medication)}>
                                                            <Pause size={14} /> Hold
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                                            <StopCircle size={14} /> Stop
                                                        </Button>
                                                    </>
                                                )}
                                                {medication.status === 'on_hold' && (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => handleResume(medication)}>
                                                            <Play size={14} /> Resume
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                                            <StopCircle size={14} /> Stop
                                                        </Button>
                                                    </>
                                                )}
                                                {medication.status === 'completed' && (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => handleContinue(medication)}>
                                                            <RotateCcw size={14} /> Continue
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                                            <StopCircle size={14} /> Stop
                                                        </Button>
                                                    </>
                                                )}
                                                {medication.status === 'stopped' && (
                                                    <span className="text-xs font-medium text-red-500">Stopped</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date Cells */}
                                    {dateColumns.map((dateKey) => (
                                        <td key={dateKey} className="px-1.5 py-2 align-top">
                                            <div className="flex flex-col items-center gap-1">
                                                {timeSlots.map((time, idx) => {
                                                    const slotKey = `${dateKey}T${time}`
                                                    const dose = doseMap.get(slotKey)
                                                    return (
                                                        <MarGridCell
                                                            key={`${dateKey}-${idx}`}
                                                            dose={dose ?? null}
                                                            visitId={visitId}
                                                            orderStatus={medication.status}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Initials Legend */}
            {initialsMap.size > 0 && (
                <div className="border-t border-gray-100 px-5 py-3">
                    <span className="text-xs font-medium text-gray-500 mr-3">Initials:</span>
                    {Array.from(initialsMap.entries()).map(([initials, name], i) => (
                        <span key={initials} className="text-xs text-gray-500">
                            {i > 0 && <span className="mx-2 text-gray-300">&middot;</span>}
                            <span className="font-semibold text-gray-700">{initials}</span> = {name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MarGrid
