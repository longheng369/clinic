import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import DoseRow from './DoseRow'
import { cn } from '@/utils/cn'

interface CycleRowProps {
    cycleNo: number
    doses: IMedicationDose[]
    totalDoses: number
    visitId: number
    orderStatus: string
}

const CycleRow = ({ cycleNo, doses, totalDoses, visitId, orderStatus }: CycleRowProps) => {
    const [expanded, setExpanded] = useState(() => {
        return doses.some((d) => d.status === 'pending')
    })

    const actioned = doses.filter(
        (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
    ).length

    const cycleTotal = totalDoses > 0 ? totalDoses : doses.length
    const progressPercent = cycleTotal > 0 ? Math.min(100, Math.round((actioned / cycleTotal) * 100)) : 0

    const hasPending = doses.some((d) => d.status === 'pending')

    return (
        <div>
            {/* Cycle Row */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full grid grid-cols-[80px_1fr_160px] gap-4 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left items-center"
            >
                <span className="text-sm font-medium text-gray-700">
                    Cycle {cycleNo}
                    {hasPending && (
                        <span className="ml-1.5 inline-block size-1.5 rounded-full bg-primary-500" />
                    )}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {doses.map((dose) => {
                        const colors: Record<string, string> = {
                            pending: 'bg-blue-100 text-blue-700',
                            provided: 'bg-green-100 text-green-700',
                            missed: 'bg-orange-100 text-orange-700',
                            refused: 'bg-purple-100 text-purple-700',
                            cancelled: 'bg-gray-100 text-gray-400',
                        }
                        const labels: Record<string, string> = {
                            pending: 'P',
                            provided: '✓',
                            missed: 'M',
                            refused: 'R',
                            cancelled: 'X',
                        }
                        const c = colors[dose.status] ?? 'bg-gray-100 text-gray-400'
                        const l = labels[dose.status] ?? '?'
                        const isOverdue = dose.status === 'pending' && new Date(dose.scheduled_at) < new Date()

                        return (
                            <span
                                key={dose.id}
                                title={`Dose ${dose.administration_no ?? '?'}: ${dose.status}${isOverdue ? ' (overdue)' : ''}`}
                                className={cn(
                                    'inline-flex size-5 items-center justify-center rounded-full text-[10px] font-medium',
                                    isOverdue ? 'bg-red-100 text-red-700' : c
                                )}
                            >
                                {l}
                            </span>
                        )
                    })}
                </div>

                <div className="flex items-center gap-3 justify-end">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-gray-400 min-w-[36px] text-right">{actioned}/{cycleTotal}</span>
                    <ChevronDown
                        size={16}
                        className={cn('text-gray-400 transition-transform duration-200', expanded && 'rotate-180')}
                    />
                </div>
            </button>

            {/* Expanded Dose Rows */}
            {expanded && (
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <div className="space-y-1 px-5 py-3">
                        {doses.map((dose) => (
                            <DoseRow key={dose.id} dose={dose} visitId={visitId} orderStatus={orderStatus} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CycleRow
