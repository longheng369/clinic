import { router } from '@inertiajs/react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import { getEffectiveStatus } from '../../DoseStatusBadge'
import { formatCreatedDateTime } from '@/utils/date'

interface MarGridCellProps {
   dose: IMedicationDose | null
   visitId: number
   orderStatus: string
}

const CELL_STYLES: Record<string, string> = {
   pending: 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer',
   overdue: 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 cursor-pointer',
   provided: 'bg-green-100 text-green-700',
   missed: 'bg-orange-100 text-orange-600',
   refused: 'bg-purple-100 text-purple-600',
   cancelled: 'bg-gray-100 text-gray-300',
   empty: 'bg-gray-50/30 text-transparent',
}

const CELL_LABELS: Record<string, string> = {
   pending: 'P',
   overdue: 'P',
   provided: '✓',
   missed: 'M',
   refused: 'R',
   cancelled: 'X',
}

const MarGridCell = ({ dose, visitId, orderStatus }: MarGridCellProps) => {
   if (!dose) {
      return (
         <div className={`flex items-center justify-center size-8 rounded text-[11px] font-medium ${CELL_STYLES.empty}`}>
            &mdash;
         </div>
      )
   }

   const effective = getEffectiveStatus(dose)
   const style = CELL_STYLES[effective] ?? CELL_STYLES.empty
   const label = CELL_LABELS[effective] ?? '?'
   const isActionable = orderStatus === 'active' && (effective === 'pending' || effective === 'overdue')

   const handleClick = () => {
      if (!isActionable) return
      router.post(`/visits/${visitId}/doses/${dose.id}/administer`, {})
   }

   const handleContextMenu = (e: React.MouseEvent) => {
      if (!isActionable) return
      e.preventDefault()
   }

   const tooltipParts: string[] = []
   if (dose.administration_no != null) tooltipParts.push(`#${dose.administration_no}`)
   tooltipParts.push(formatCreatedDateTime(dose.scheduled_at))
   if (dose.status === 'provided' && dose.administered_by) {
      tooltipParts.push(`by ${dose.administered_by}`)
      if (dose.unit_price != null) tooltipParts.push(`$${Number(dose.unit_price).toFixed(2)}`)
   }
   if ((dose.status === 'missed' || dose.status === 'refused' || dose.status === 'cancelled') && dose.reason) {
      tooltipParts.push(dose.reason)
   }

   return (
      <div
         title={tooltipParts.join(' | ')}
         onClick={handleClick}
         onContextMenu={handleContextMenu}
         className={`flex items-center justify-center size-8 rounded text-[11px] font-medium ${style}`}
      >
         {label}
      </div>
   )
}

export default MarGridCell
