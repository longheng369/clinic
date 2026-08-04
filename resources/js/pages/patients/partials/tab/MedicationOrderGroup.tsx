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
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
         {/* Order Header */}
         <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
               <div>
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-semibold text-gray-900">{medicineName}</span>
                     <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadge.className}`}>
                        {statusBadge.label}
                     </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs text-gray-500">{prescription.dosage} {prescription.unit}</span>
                     <span className="text-gray-300">&middot;</span>
                     <span className="text-xs text-gray-500">{prescription.route}</span>
                     <span className="text-gray-300">&middot;</span>
                     <span className="text-xs text-gray-500">{prescription.interval}</span>
                     {unitPrice != null && (
                        <>
                           <span className="text-gray-300">&middot;</span>
                           <span className="text-xs text-gray-500">${Number(unitPrice).toFixed(2)}/dose</span>
                        </>
                     )}
                  </div>
                  {prescription.notes && (
                     <p className="mt-1 text-xs text-gray-400 truncate max-w-md">{prescription.notes}</p>
                  )}
               </div>
            </div>

            {/* Doctor Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
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
                  <span className="text-xs font-medium text-red-500">Stopped</span>
               )}
            </div>
         </div>

         {/* Cycles Table */}
         {cycles.length > 0 ? (
            <div className="border-t border-gray-100">
               {/* Column Headers */}
               <div className="grid grid-cols-[80px_1fr_160px] gap-4 px-5 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cycle</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Doses</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">Progress</span>
               </div>

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
            </div>
         ) : (
            <div className="border-t border-gray-100 px-5 py-8 text-sm text-gray-400 text-center">
                    No doses recorded yet
            </div>
         )}
      </div>
   )
}

export default MedicationOrderGroup
