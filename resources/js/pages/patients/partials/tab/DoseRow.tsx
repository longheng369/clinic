import { Box } from '@mui/material'
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
      <Box sx={{}}>
         <Box sx={{}}>
            <Box sx={{}}>
               {dose.administration_no != null ? `#${dose.administration_no}` : ''}
            </Box>
            <Box sx={{}}>
               {formatCreatedDateTime(dose.scheduled_at)}
            </Box>
            <DoseStatusBadge dose={dose} />
            {dose.status === 'provided' && dose.administered_by && (
               <Box sx={{}}>
                        by {dose.administered_by}
                  {dose.unit_price != null && (
                     <Box sx={{}}>
                                ${Number(dose.unit_price).toFixed(2)}
                     </Box>
                  )}
               </Box>
            )}
            {(dose.status === 'missed' || dose.status === 'refused' || dose.status === 'cancelled') && dose.reason && (
               <Box sx={{}}>&mdash; {dose.reason}</Box>
            )}
            {dose.note && (
               <Box sx={{}}>{dose.note}</Box>
            )}
         </Box>
         {actionEnabled && (
            <Box sx={{}}>
               <IconButton onClick={handleProvide} aria-label="Provide dose" title="Provide">
                  <Check size={16} />
               </IconButton>
               <IconButton onClick={handleMissed} aria-label="Missed dose" title="Missed">
                  <AlertTriangle size={16} />
               </IconButton>
               <IconButton color="error" onClick={handleRefused} aria-label="Refused dose" title="Refused">
                  <X size={16} />
               </IconButton>
            </Box>
         )}
      </Box>
   )
}

export default DoseRow
