import { Box } from '@mui/material'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import DoseRow from './DoseRow'

interface CycleRowProps {
    cycleNo: number
    administrations: IMedicationAdministration[]
    totalDoses: number
    visitId: number
    orderStatus: string
}

const DOSE_INDICATOR_COLORS: Record<string, string> = {
  pending: '#93c5fd',
  overdue: '#fca5a5',
  provided: '#86efac',
  missed: '#fdba74',
  refused: '#c4b5fd',
  cancelled: '#d1d5db',
}

const CycleRow = ({ cycleNo, administrations, totalDoses, visitId, orderStatus }: CycleRowProps) => {
  const [expanded, setExpanded] = useState(() => {
    return administrations.some((d) => d.status === 'pending')
  })

  const actioned = administrations.filter(
    (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
  ).length

  const cycleTotal = totalDoses > 0 ? totalDoses : administrations.length
  const progressPercent = cycleTotal > 0 ? Math.min(100, Math.round((actioned / cycleTotal) * 100)) : 0

  const hasPending = administrations.some((d) => d.status === 'pending')

  return (
    <Box>
      {/* Cycle Header Row */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 2,
          px: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f8fafc' },
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 120 }}>
          <Box sx={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                  Cycle {cycleNo}
          </Box>
          {hasPending && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#3b82f6',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                },
              }}
            />
          )}
        </Box>

        {/* Dose Indicators */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          {administrations.map((admin) => {
            const labels: Record<string, string> = {
              pending: 'P',
              provided: '✓',
              missed: 'M',
              refused: 'R',
              cancelled: 'X',
            }
            const l = labels[admin.status] ?? '?'
            const isOverdue = admin.status === 'pending' && new Date(admin.scheduled_at) < new Date()
            const color = isOverdue ? DOSE_INDICATOR_COLORS.overdue : (DOSE_INDICATOR_COLORS[admin.status] ?? '#d1d5db')

            return (
              <Box
                key={admin.id}
                title={`Dose ${admin.administration_no ?? '?'}: ${admin.status}${isOverdue ? ' (overdue)' : ''}`}
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  bgcolor: color,
                }}
              >
                {l}
              </Box>
            )
          })}
        </Box>

        {/* Progress */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <Box sx={{ width: 80, height: 6, borderRadius: 10, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: 10,
                bgcolor: progressPercent === 100 ? '#22c55e' : '#3b82f6',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ fontSize: 12, color: '#64748b', minWidth: 36 }}>
            {actioned}/{cycleTotal}
          </Box>
          <ChevronDown
            size={16}
            style={{
              color: '#94a3b8',
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      </Box>

      {/* Expanded Administration Rows */}
      {expanded && (
        <Box sx={{ bgcolor: '#f8fafc' }}>
          <Box>
            {administrations.map((admin) => (
              <DoseRow key={admin.id} administration={admin} visitId={visitId} orderStatus={orderStatus} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CycleRow
