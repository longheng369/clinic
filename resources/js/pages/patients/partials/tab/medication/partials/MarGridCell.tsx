import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import { getEffectiveStatus } from '../../DoseStatusBadge'
import { formatCreatedDateTime } from '@/utils/date'

interface MarGridCellProps {
   administration: IMedicationAdministration | null
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

const CELL_STYLES: Record<string, { bg: string; color: string; cursor: string }> = {
  pending: { bg: '#dbeafe', color: '#2563eb', cursor: 'pointer' },
  overdue: { bg: '#fee2e2', color: '#dc2626', cursor: 'pointer' },
  provided: { bg: '#dcfce7', color: '#16a34a', cursor: 'default' },
  missed: { bg: '#ffedd5', color: '#ea580c', cursor: 'default' },
  refused: { bg: '#f3e8ff', color: '#9333ea', cursor: 'default' },
  cancelled: { bg: '#f1f5f9', color: '#94a3b8', cursor: 'default' },
}

const MarGridCell = ({ administration, visitId, orderStatus }: MarGridCellProps) => {
  if (!administration) {
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: '#cbd5e1',
          mx: 'auto',
          my: 0.25,
        }}
      >
            &mdash;
      </Box>
    )
  }

  const effective = getEffectiveStatus(administration)
  const label = CELL_LABELS[effective] ?? '?'
  const style = CELL_STYLES[effective] ?? CELL_STYLES.pending
  const isActionable = orderStatus === 'active' && (effective === 'pending' || effective === 'overdue')

  const handleClick = () => {
    if (!isActionable) return
    router.post(`/visits/${visitId}/doses/${administration.id}/administer`, {})
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isActionable) return
    e.preventDefault()
  }

  const tooltipParts: string[] = []
  if (administration.administration_no != null) tooltipParts.push(`#${administration.administration_no}`)
  tooltipParts.push(formatCreatedDateTime(administration.scheduled_at))
  if (administration.status === 'provided' && administration.administered_by) {
    tooltipParts.push(`by ${administration.administered_by}`)
    if (administration.unit_price != null) tooltipParts.push(`$${Number(administration.unit_price).toFixed(2)}`)
  }
  if ((administration.status === 'missed' || administration.status === 'refused' || administration.status === 'cancelled') && administration.reason) {
    tooltipParts.push(administration.reason)
  }

  return (
    <Box
      title={tooltipParts.join(' | ')}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      sx={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        fontSize: 12,
        fontWeight: 600,
        bgcolor: style.bg,
        color: style.color,
        cursor: style.cursor,
        mx: 'auto',
        my: 0.25,
        transition: 'opacity 0.15s ease',
        '&:hover': isActionable ? { opacity: 0.8 } : {},
      }}
    >
      {label}
    </Box>
  )
}

export default MarGridCell
