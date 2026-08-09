import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, StopCircle, Play, Pause, RotateCcw } from 'lucide-react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import CycleRow from './CycleRow'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
   active: { label: 'Active', className: 'bg-green-100 text-green-700' },
   on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700' },
   stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
   completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
}

interface MedicationOrderGroupProps {
    prescription: IMedicationAdministration
    visitId: number
    onEdit: (prescription: IMedicationAdministration) => void
}

const MedicationOrderGroup = ({ prescription, visitId, onEdit }: MedicationOrderGroupProps) => {
   const { openAlert } = useModal()

   const statusBadge = ORDER_STATUS[prescription.status] ?? ORDER_STATUS.active
   const medicineName = prescription.medicine?.name ?? 'Unknown'
   const unitPrice = prescription.medicine?.unit_price

   const hasAdministrationActivity = prescription.doses.some(
      (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
   )
   const canEdit = !hasAdministrationActivity && (prescription.status === 'active' || prescription.status === 'on_hold')

   const totalDoses = prescription.duration ?? 0

   const handleStop = () => {
      openAlert({
         message: `Stop ${medicineName}?`,
         description: 'All pending doses will be cancelled.',
         variant: 'danger',
         confirmLabel: 'Stop',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${prescription.id}/stop`, {}),
      })
   }

   const handleContinue = () => {
      openAlert({
         message: `Continue ${medicineName}?`,
         description: `A new treatment cycle will begin (Cycle ${prescription.cycle_no + 1}).`,
         variant: 'info',
         confirmLabel: 'Continue',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${prescription.id}/continue`, {}),
      })
   }

   const handleHold = () => {
      openAlert({
         message: `Place ${medicineName} on hold?`,
         description: 'Doses cannot be administered while on hold.',
         variant: 'warning',
         confirmLabel: 'Hold',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${prescription.id}/hold`, {}),
      })
   }

   const handleResume = () => {
      router.post(`/visits/${visitId}/medications/${prescription.id}/resume`, {})
   }

   const dosesByCycle = prescription.doses.reduce<Record<number, IMedicationDose[]>>((acc, dose) => {
      const c = dose.cycle_no ?? 1
      if (!acc[c]) acc[c] = []
      acc[c].push(dose)
      return acc
   }, {})

   const cycles = Object.keys(dosesByCycle)
      .map(Number)
      .sort((a, b) => a - b)

   return (
      <Box sx={{}}>
         {/* Order Header */}
         <Box sx={{}}>
            <Box sx={{}}>
               <Box>
                  <Box sx={{}}>
                     <Box sx={{}}>{medicineName}</Box>
                     <Box sx={{}}>
                        {statusBadge.label}
                     </Box>
                  </Box>
                  <Box sx={{}}>
                     <Box sx={{}}>{prescription.dosage} {prescription.unit}</Box>
                     <Box sx={{}}>&middot;</Box>
                     <Box sx={{}}>{prescription.route}</Box>
                     <Box sx={{}}>&middot;</Box>
                     <Box sx={{}}>{prescription.interval}</Box>
                     {unitPrice != null && (
                        <>
                           <Box sx={{}}>&middot;</Box>
                           <Box sx={{}}>${Number(unitPrice).toFixed(2)}/dose</Box>
                        </>
                     )}
                  </Box>
                  {prescription.notes && (
                     <Box sx={{}}>{prescription.notes}</Box>
                  )}
               </Box>
            </Box>

            {/* Doctor Actions */}
            <Box sx={{}}>
               {canEdit && (
                  <IconButton onClick={() => onEdit(prescription)} aria-label="Edit order" title="Edit">
                     <Pencil size={14} />
                  </IconButton>
               )}
               {prescription.status === 'active' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleHold}>
                        <Pause size={14} /> Hold
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {prescription.status === 'on_hold' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleResume}>
                        <Play size={14} /> Resume
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {prescription.status === 'completed' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleContinue}>
                        <RotateCcw size={14} /> Continue
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {prescription.status === 'stopped' && (
                  <Box sx={{}}>Stopped</Box>
               )}
            </Box>
         </Box>

         {/* Cycles Table */}
         {cycles.length > 0 ? (
            <Box sx={{}}>
               {/* Column Headers */}
               <Box sx={{}}>
                  <Box sx={{}}>Cycle</Box>
                  <Box sx={{}}>Doses</Box>
                  <Box sx={{}}>Progress</Box>
               </Box>

               {cycles.map((cycleNo) => {
                  const cycleDoses = (dosesByCycle[cycleNo] ?? []).sort(
                     (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
                  )
                  return (
                     <CycleRow
                        key={cycleNo}
                        cycleNo={cycleNo}
                        doses={cycleDoses}
                        totalDoses={totalDoses}
                        visitId={visitId}
                        orderStatus={prescription.status}
                     />
                  )
               })}
            </Box>
         ) : (
            <Box sx={{}}>
                    No doses recorded yet
            </Box>
         )}
      </Box>
   )
}

export default MedicationOrderGroup
