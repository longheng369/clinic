import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import IconButton from '@/components/button/iconButton'
import { Check, X } from 'lucide-react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import DoseStatusBadge, { getEffectiveStatus } from './DoseStatusBadge'
import { formatCreatedDateTime } from '@/utils/date'

interface DoseRowProps {
    dose: IMedicationDose
    visitId: number
}

const DoseRow = ({ dose, visitId }: DoseRowProps) => {
    const { openAlert } = useModal()
    const effective = getEffectiveStatus(dose)
    const actionEnabled = effective === 'pending' || effective === 'overdue'

    const handleAdminister = () => {
        router.post(`/visits/${visitId}/doses/${dose.id}/administer`, {})
    }

    const handleSkip = () => {
        openAlert({
            message: 'Skip this dose?',
            description: 'This dose will be marked as skipped.',
            variant: 'warning',
            confirmLabel: 'Skip',
            onConfirm: () =>
                router.post(`/visits/${visitId}/doses/${dose.id}/skip`, { reason: 'Skipped by nurse' }),
        })
    }

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 min-w-[70px]">
                    {formatCreatedDateTime(dose.scheduled_at)}
                </span>
                <DoseStatusBadge dose={dose} />
                {dose.status === 'administered' && dose.administered_by && (
                    <span className="text-xs text-gray-400">
                        by {dose.administered_by}
                        {dose.unit_price != null && (
                            <span className="ml-1 text-primary-600 font-medium">
                                ${Number(dose.unit_price).toFixed(2)}
                            </span>
                        )}
                    </span>
                )}
                {dose.status === 'skipped' && dose.skip_reason && (
                    <span className="text-xs text-gray-400">&mdash; {dose.skip_reason}</span>
                )}
            </div>
            {actionEnabled && (
                <div className="flex items-center gap-1">
                    <IconButton onClick={handleAdminister} aria-label="Administer dose" title="Administer">
                        <Check size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={handleSkip} aria-label="Skip dose" title="Skip">
                        <X size={16} />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default DoseRow
