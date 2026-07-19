import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import IconButton from '@/components/button/iconButton'
import { Check, X, AlertTriangle } from 'lucide-react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import DoseStatusBadge, { getEffectiveStatus } from './DoseStatusBadge'
import { formatCreatedDateTime } from '@/utils/date'

interface DoseRowProps {
    dose: IMedicationDose
    visitId: number
    orderStatus: string
}

const DoseRow = ({ dose, visitId, orderStatus }: DoseRowProps) => {
    const { openAlert } = useModal()
    const effective = getEffectiveStatus(dose)
    const actionEnabled = orderStatus === 'active' && (effective === 'pending' || effective === 'overdue')

    const handleProvide = () => {
        router.post(`/visits/${visitId}/doses/${dose.id}/administer`, {})
    }

    const handleMissed = () => {
        openAlert({
            message: 'Record as missed?',
            description: 'Select a reason for the missed dose.',
            variant: 'warning',
            confirmLabel: 'Patient absent',
            onConfirm: () => router.post(`/visits/${visitId}/doses/${dose.id}/missed`, { reason: 'Patient absent' }),
        })
    }

    const handleRefused = () => {
        openAlert({
            message: 'Record as refused?',
            description: 'Select a reason the patient refused.',
            variant: 'warning',
            confirmLabel: 'Patient declined',
            onConfirm: () => router.post(`/visits/${visitId}/doses/${dose.id}/refused`, { reason: 'Patient declined' }),
        })
    }

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-2.5">
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 min-w-[20px]">
                    {dose.administration_no != null ? `#${dose.administration_no}` : ''}
                </span>
                <span className="text-sm font-medium text-gray-700 min-w-[70px]">
                    {formatCreatedDateTime(dose.scheduled_at)}
                </span>
                <DoseStatusBadge dose={dose} />
                {dose.status === 'provided' && dose.administered_by && (
                    <span className="text-xs text-gray-400">
                        by {dose.administered_by}
                        {dose.unit_price != null && (
                            <span className="ml-1 text-primary-600 font-medium">
                                ${Number(dose.unit_price).toFixed(2)}
                            </span>
                        )}
                    </span>
                )}
                {(dose.status === 'missed' || dose.status === 'refused' || dose.status === 'cancelled') && dose.reason && (
                    <span className="text-xs text-gray-400">&mdash; {dose.reason}</span>
                )}
                {dose.note && (
                    <span className="text-xs text-gray-400 italic">{dose.note}</span>
                )}
            </div>
            {actionEnabled && (
                <div className="flex items-center gap-1">
                    <IconButton onClick={handleProvide} aria-label="Provide dose" title="Provide">
                        <Check size={16} />
                    </IconButton>
                    <IconButton onClick={handleMissed} aria-label="Missed dose" title="Missed">
                        <AlertTriangle size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={handleRefused} aria-label="Refused dose" title="Refused">
                        <X size={16} />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default DoseRow
