import { Box } from '@mui/material'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import DoseRow from './DoseRow'

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
      <Box>
         {/* Cycle Row */}
         <Box
            onClick={() => setExpanded(!expanded)}
         >
            <Box>
                    Cycle {cycleNo}
               {hasPending && (
                  <Box />
               )}
            </Box>

            <Box>
               {doses.map((dose) => {
                  const labels: Record<string, string> = {
                     pending: 'P',
                     provided: '✓',
                     missed: 'M',
                     refused: 'R',
                     cancelled: 'X',
                  }
                  const l = labels[dose.status] ?? '?'
                  const isOverdue = dose.status === 'pending' && new Date(dose.scheduled_at) < new Date()

                  return (
                     <Box
                        key={dose.id}
                        title={`Dose ${dose.administration_no ?? '?'}: ${dose.status}${isOverdue ? ' (overdue)' : ''}`}
                     >
                        {l}
                     </Box>
                  )
               })}
            </Box>

            <Box>
               <Box>
                  <Box
                     style={{ width: `${progressPercent}%` }}
                  />
               </Box>
               <Box>{actioned}/{cycleTotal}</Box>
               <ChevronDown
                  size={16}
               />
            </Box>
         </Box>

         {/* Expanded Dose Rows */}
         {expanded && (
            <Box>
               <Box>
                  {doses.map((dose) => (
                     <DoseRow key={dose.id} dose={dose} visitId={visitId} orderStatus={orderStatus} />
                  ))}
               </Box>
            </Box>
         )}
      </Box>
   )
}

export default CycleRow
