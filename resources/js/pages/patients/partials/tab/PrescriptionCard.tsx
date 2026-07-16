import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { ChevronDown, Square } from 'lucide-react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import DoseRow from './DoseRow'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

const PRES_STATUS: Record<string, { label: string; className: string }> = {
    prescribed: { label: 'Prescribed', className: 'bg-blue-100 text-blue-700' },
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    stopped: { label: 'Stopped', className: 'bg-gray-100 text-gray-500' },
}

interface PrescriptionCardProps {
    prescription: IMedicationAdministration
    visitId: number
}

const PrescriptionCard = ({ prescription, visitId }: PrescriptionCardProps) => {
    const { openAlert } = useModal()
    const [expanded, setExpanded] = useState(() => {
        if (prescription.status === 'stopped') return false
        return prescription.doses.some((d) => d.status === 'pending')
    })

    const statusBadge = PRES_STATUS[prescription.status] ?? PRES_STATUS.prescribed
    const hasPendingDoses = prescription.doses.some((d) => d.status === 'pending')
    const medicineName = prescription.medicine?.name ?? 'Unknown'
    const unitPrice = prescription.medicine?.unit_price

    const handleStop = () => {
        openAlert({
            message: `Stop ${medicineName}?`,
            description: 'All future doses will be skipped.',
            variant: 'danger',
            confirmLabel: 'Stop',
            onConfirm: () =>
                router.post(`/visits/${visitId}/medications/${prescription.id}/stop`, {}),
        })
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{medicineName}</span>
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadge.className}`}>
                                {statusBadge.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{prescription.dosage} {prescription.unit}</span>
                            <span className="text-gray-300">&middot;</span>
                            <span className="text-xs text-gray-500">{prescription.route}</span>
                            <span className="text-gray-300">&middot;</span>
                            <span className="text-xs text-gray-500">{prescription.interval}</span>
                            {unitPrice != null && (
                                <>
                                    <span className="text-gray-300">&middot;</span>
                                    <span className="text-xs text-gray-500">${Number(unitPrice).toFixed(2)}/dose</span>
                                </>
                            )}
                        </div>
                        {prescription.notes && (
                            <p className="mt-1 text-xs text-gray-400 truncate max-w-md">{prescription.notes}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {hasPendingDoses && (
                        <span className="text-[11px] text-amber-600 font-medium">
                            {prescription.doses.filter((d) => d.status === 'pending').length} pending
                        </span>
                    )}
                    <ChevronDown
                        size={18}
                        className={cn('text-gray-400 transition-transform duration-200', expanded && 'rotate-180')}
                    />
                </div>
            </button>

            {expanded && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                    {prescription.status !== 'stopped' && (
                        <div className="mb-3 flex justify-end">
                            <Button variant="outline" size="xs" onClick={handleStop}>
                                <Square size={12} className="mr-1" />
                                Stop Prescription
                            </Button>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        {prescription.doses.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No doses scheduled yet</p>
                        ) : (
                            prescription.doses.map((dose) => (
                                <DoseRow key={dose.id} dose={dose} visitId={visitId} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PrescriptionCard
