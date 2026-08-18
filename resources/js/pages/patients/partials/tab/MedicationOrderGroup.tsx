import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, StopCircle, Play, Pause, RotateCcw } from 'lucide-react'
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
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
    order: IMedicationOrder
    visitId: number
    onEdit: (order: IMedicationOrder) => void
}

const MedicationOrderGroup = ({ order, visitId, onEdit }: MedicationOrderGroupProps) => {
   const { openAlert } = useModal()

   const statusBadge = ORDER_STATUS[order.status] ?? ORDER_STATUS.active
   const medicineName = order.medicine?.name ?? 'Unknown'
   const unitPrice = order.medicine?.unit_price

   const hasAdministrationActivity = order.administrations.some(
      (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
   )
   const canEdit = !hasAdministrationActivity && (order.status === 'active' || order.status === 'on_hold')

   const totalDoses = order.duration ?? 0

   const handleStop = () => {
      openAlert({
         message: `Stop ${medicineName}?`,
         description: 'All pending doses will be cancelled.',
         variant: 'danger',
         confirmLabel: 'Stop',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${order.id}/stop`, {}),
      })
   }

   const handleContinue = () => {
      openAlert({
         message: `Continue ${medicineName}?`,
         description: `A new treatment cycle will begin (Cycle ${order.cycle_no + 1}).`,
         variant: 'info',
         confirmLabel: 'Continue',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${order.id}/continue`, {}),
      })
   }

   const handleHold = () => {
      openAlert({
         message: `Place ${medicineName} on hold?`,
         description: 'Doses cannot be administered while on hold.',
         variant: 'warning',
         confirmLabel: 'Hold',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${order.id}/hold`, {}),
      })
   }

   const handleResume = () => {
      router.post(`/visits/${visitId}/medications/${order.id}/resume`, {})
   }

   const administrationsByCycle = order.administrations.reduce<Record<number, IMedicationAdministration[]>>((acc, admin) => {
      const c = admin.cycle_no ?? 1
      if (!acc[c]) acc[c] = []
      acc[c].push(admin)
      return acc
   }, {})

   const cycles = Object.keys(administrationsByCycle)
      .map(Number)
      .sort((a, b) => a - b)

   return (
      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff', overflow: 'hidden' }}>
         {/* Order Header */}
         <Box
            sx={{
               display: 'flex',
               alignItems: 'flex-start',
               justifyContent: 'space-between',
               px: 3,
               py: 2.5,
               borderBottom: cycles.length > 0 ? '1px solid #f1f5f9' : undefined,
            }}
         >
            <Box>
               {/* Medicine name + status badge */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                  <Box sx={{ fontWeight: 600, fontSize: 16, color: '#1e293b' }}>{medicineName}</Box>
                  <Box
                     className={statusBadge.className}
                     sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.25,
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 500,
                     }}
                  >
                     {statusBadge.label}
                  </Box>
               </Box>
               {/* Dosage / Route / Interval */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', fontSize: 13, flexWrap: 'wrap' }}>
                  <Box>{order.dosage} {order.unit}</Box>
                  <Box>&middot;</Box>
                  <Box>{order.route}</Box>
                  <Box>&middot;</Box>
                  <Box>{order.interval}</Box>
                  {unitPrice != null && (
                     <>
                        <Box>&middot;</Box>
                        <Box>${Number(unitPrice).toFixed(2)}/dose</Box>
                     </>
                  )}
               </Box>
               {order.created_by && (
                  <Box sx={{ fontSize: 12, color: '#94a3b8', mt: 0.5 }}>Dr. {order.created_by}</Box>
               )}
               {order.notes && (
                  <Box sx={{ fontSize: 12, color: '#94a3b8', mt: 0.5 }}>{order.notes}</Box>
               )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
               {canEdit && (
                  <IconButton onClick={() => onEdit(order)} aria-label="Edit order" title="Edit">
                     <Pencil size={14} />
                  </IconButton>
               )}
               {order.status === 'active' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleHold}>
                        <Pause size={14} /> Hold
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {order.status === 'on_hold' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleResume}>
                        <Play size={14} /> Resume
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {order.status === 'completed' && (
                  <>
                     <Button variant="outline" size="sm" onClick={handleContinue}>
                        <RotateCcw size={14} /> Continue
                     </Button>
                     <Button variant="destructive" size="sm" onClick={handleStop}>
                        <StopCircle size={14} /> Stop
                     </Button>
                  </>
               )}
               {order.status === 'stopped' && (
                  <Box sx={{ fontSize: 12, color: '#94a3b8' }}>Stopped</Box>
               )}
            </Box>
         </Box>

         {/* Cycles Section */}
         {cycles.length > 0 ? (
            <Box>
               {/* Column Headers */}
               <Box
                  sx={{
                     display: 'flex',
                     alignItems: 'center',
                     px: 4,
                     py: 1.5,
                     bgcolor: '#f8fafc',
                     borderBottom: '1px solid #e2e8f0',
                     fontSize: 11,
                     fontWeight: 600,
                     color: '#94a3b8',
                     textTransform: 'uppercase',
                     letterSpacing: '0.05em',
                  }}
               >
                  <Box sx={{ minWidth: 120 }}>Cycle</Box>
                  <Box sx={{ flex: 1 }}>Doses</Box>
                  <Box>Progress</Box>
               </Box>

               {cycles.map((cycleNo) => {
                  const cycleAdministrations = (administrationsByCycle[cycleNo] ?? []).sort(
                     (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
                  )
                  return (
                     <CycleRow
                        key={cycleNo}
                        cycleNo={cycleNo}
                        administrations={cycleAdministrations}
                        totalDoses={totalDoses}
                        visitId={visitId}
                        orderStatus={order.status}
                     />
                  )
               })}
            </Box>
         ) : (
            <Box sx={{ px: 3, py: 4, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
               No doses recorded yet
            </Box>
         )}
      </Box>
   )
}

export default MedicationOrderGroup
