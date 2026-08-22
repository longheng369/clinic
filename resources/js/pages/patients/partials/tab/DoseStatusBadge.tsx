import { Box } from '@mui/material'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'

const DOSE_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-blue-100 text-blue-700' },
  provided: { label: 'Provided', className: 'bg-green-100 text-green-700' },
  missed: { label: 'Missed', className: 'bg-orange-100 text-orange-700' },
  refused: { label: 'Refused', className: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
}

function getEffectiveStatus(administration: IMedicationAdministration): string {
  if (administration.status === 'pending' && new Date(administration.scheduled_at) < new Date()) {
    return 'overdue'
  }
  return administration.status
}

interface DoseStatusBadgeProps {
    administration: IMedicationAdministration
}

const DoseStatusBadge = ({ administration }: DoseStatusBadgeProps) => {
  const effective = getEffectiveStatus(administration)
  const badge = DOSE_STATUS[effective]

  return (
    <Box
      className={badge.className}
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.25,
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {badge.label}
    </Box>
  )
}

export { DOSE_STATUS, getEffectiveStatus }
export default DoseStatusBadge
