import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import { getEffectiveStatus } from '../../DoseStatusBadge'
import { formatCreatedDateTime } from '@/utils/date'

interface MarGridCellProps {
   dose: IMedicationDose | null
   visitId: number
   orderStatus: string
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
         <Box>
            &mdash;
         </Box>
      )
   }

   const effective = getEffectiveStatus(dose)
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
      <Box
         title={tooltipParts.join(' | ')}
         onClick={handleClick}
         onContextMenu={handleContextMenu}

      >
         {label}
      </Box>
   )
}

export default MarGridCell
