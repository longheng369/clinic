import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, StopCircle, Play, Pause, RotateCcw } from 'lucide-react'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import type { IMedicationDose } from '@/interfaces/IMedicationDose'
import type { IPatient } from '@/interfaces/IPatient'
import MarGridCell from './MarGridCell'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import { formatDob } from '@/utils/date'

const ORDER_STATUS: Record<string, { label: string }> = {
   active: { label: 'Active' },
   on_hold: { label: 'On Hold' },
   stopped: { label: 'Stopped' },
   completed: { label: 'Completed' },
}

const DOSE_TIMES: Record<string, string[]> = {
   QD: ['08:00'],
   BID: ['08:00', '20:00'],
   TID: ['08:00', '14:00', '20:00'],
   QID: ['08:00', '12:00', '18:00', '22:00'],
   QHS: ['22:00'],
   PRN: ['08:00'],
}

function getTimeSlots(interval: string): string[] {
   return DOSE_TIMES[interval] ?? ['08:00']
}

function formatDate(date: Date): string {
   const m = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
   const d = date.toLocaleDateString('en-US', { weekday: 'short' })
   return `${d} ${m}`
}

function toDateKey(date: Date): string {
   return date.toISOString().slice(0, 10)
}

function buildDateRange(doses: IMedicationDose[]): string[] {
   let earliest: Date | null = null
   let latest: Date | null = null

   for (const dose of doses) {
      const d = new Date(dose.scheduled_at)
      if (!earliest || d < earliest) earliest = d
      if (!latest || d > latest) latest = d
   }

   if (!earliest || !latest) {
      earliest = new Date()
      latest = new Date()
      latest.setDate(latest.getDate() + 0)
   }

   const start = new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate())
   const end = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate())

   const dates: string[] = []
   const cursor = new Date(start)
   while (cursor <= end) {
      dates.push(toDateKey(cursor))
      cursor.setDate(cursor.getDate() + 1)
   }
   return dates
}

function getInitials(name: string): string {
   return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
}

function collectInitials(medications: IMedicationAdministration[]): Map<string, string> {
   const map = new Map<string, string>()
   for (const m of medications) {
      for (const d of m.doses) {
         if (d.administered_by && d.status === 'provided') {
            const initials = getInitials(d.administered_by)
            if (!map.has(initials)) {
               map.set(initials, d.administered_by)
            }
         }
      }
   }
   return map
}

interface MarGridProps {
   patient: IPatient
   medications: IMedicationAdministration[]
   visitId: number
   onEdit: (medication: IMedicationAdministration) => void
}

const MarGrid = ({ patient, medications, visitId, onEdit }: MarGridProps) => {
   const { openAlert } = useModal()

   const allDoses = medications.flatMap((m) => m.doses)
   const dateColumns = buildDateRange(allDoses)
   const initialsMap = collectInitials(medications)

   const handleStop = (m: IMedicationAdministration) => {
      openAlert({
         message: `Stop ${m.medicine?.name ?? 'medication'}?`,
         description: 'All pending doses will be cancelled.',
         variant: 'danger',
         confirmLabel: 'Stop',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/stop`, {}),
      })
   }

   const handleContinue = (m: IMedicationAdministration) => {
      openAlert({
         message: `Continue ${m.medicine?.name ?? 'medication'}?`,
         description: `A new treatment cycle will begin (Cycle ${m.cycle_no + 1}).`,
         variant: 'info',
         confirmLabel: 'Continue',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/continue`, {}),
      })
   }

   const handleHold = (m: IMedicationAdministration) => {
      openAlert({
         message: `Place ${m.medicine?.name ?? 'medication'} on hold?`,
         description: 'Doses cannot be administered while on hold.',
         variant: 'warning',
         confirmLabel: 'Hold',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/hold`, {}),
      })
   }

   const handleResume = (m: IMedicationAdministration) => {
      router.post(`/visits/${visitId}/medications/${m.id}/resume`, {})
   }

   return (
      <Box>
         {/* Patient MAR Header */}
         <Box>
            <Box>
               <Box>
                  <Box>
                     {patient.khmer_last_name} {patient.khmer_first_name}
                  </Box>
                  {patient.first_name && (
                     <Box>
                        ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
                     </Box>
                  )}
               </Box>
               <Box>&middot;</Box>
               <Box>
                  DOB: {formatDob(patient.date_of_birth)}
               </Box>
               {patient.blood_group && (
                  <>
                     <Box>&middot;</Box>
                     <Box>
                        {patient.blood_group}
                     </Box>
                  </>
               )}
               {patient.allergy && (
                  <>
                     <Box>&middot;</Box>
                     <Box>
                        Allergy: {patient.allergy}
                     </Box>
                  </>
               )}
               {dateColumns.length > 0 && (
                  <>
                     <Box>&middot;</Box>
                     <Box>
                        {dateColumns[0].slice(5)} – {dateColumns[dateColumns.length - 1].slice(5)}
                     </Box>
                  </>
               )}
            </Box>
         </Box>

         {/* Grid Table */}
         <Box>
            <table>
               <thead>
                  <tr>
                     <th>
                        Medication
                     </th>
                     {dateColumns.map((dateKey) => (
                        <th key={dateKey}>
                           {formatDate(new Date(dateKey + 'T00:00:00'))}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {medications.map((medication) => {
                     const statusBadge = ORDER_STATUS[medication.status] ?? ORDER_STATUS.active
                     const medicineName = medication.medicine?.name ?? 'Unknown'
                     const unitPrice = medication.medicine?.unit_price

                     const hasAdministrationActivity = medication.doses.some(
                        (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
                     )
                     const canEdit = !hasAdministrationActivity && (medication.status === 'active' || medication.status === 'on_hold')

                     const timeSlots = getTimeSlots(medication.interval)

                     const doseMap = new Map<string, IMedicationDose>()
                     for (const dose of medication.doses) {
                        doseMap.set(dose.scheduled_at.slice(0, 16), dose)
                     }

                     return (
                        <tr
                           key={medication.id}

                        >
                           {/* Medication Info Column */}
                           <td>
                              {medication.status === 'stopped' && (
                                 <Box />
                              )}
                              <Box>
                                 <Box>
                                    <Box>{medicineName}</Box>
                                    <Box>
                                       {statusBadge.label}
                                    </Box>
                                 </Box>
                                 <Box>
                                    <Box>{medication.dosage} {medication.unit}</Box>
                                    <Box>&middot;</Box>
                                    <Box>{medication.route}</Box>
                                    <Box>&middot;</Box>
                                    <Box>{medication.interval}</Box>
                                    {unitPrice != null && (
                                       <>
                                          <Box>&middot;</Box>
                                          <Box>${Number(unitPrice).toFixed(2)}/dose</Box>
                                       </>
                                    )}
                                 </Box>
                                 {medication.recorded_by && (
                                    <Box>Dr. {medication.recorded_by}</Box>
                                 )}
                                 {medication.notes && (
                                    <Box>{medication.notes}</Box>
                                 )}

                                 {/* Action Buttons */}
                                 <Box>
                                    {canEdit && (
                                       <IconButton onClick={() => onEdit(medication)} aria-label="Edit order" title="Edit">
                                          <Pencil size={14} />
                                       </IconButton>
                                    )}
                                    {medication.status === 'active' && (
                                       <>
                                          <Button variant="outline" size="sm" onClick={() => handleHold(medication)}>
                                             <Pause size={14} /> Hold
                                          </Button>
                                          <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                             <StopCircle size={14} /> Stop
                                          </Button>
                                       </>
                                    )}
                                    {medication.status === 'on_hold' && (
                                       <>
                                          <Button variant="outline" size="sm" onClick={() => handleResume(medication)}>
                                             <Play size={14} /> Resume
                                          </Button>
                                          <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                             <StopCircle size={14} /> Stop
                                          </Button>
                                       </>
                                    )}
                                    {medication.status === 'completed' && (
                                       <>
                                          <Button variant="outline" size="sm" onClick={() => handleContinue(medication)}>
                                             <RotateCcw size={14} /> Continue
                                          </Button>
                                          <Button variant="destructive" size="sm" onClick={() => handleStop(medication)}>
                                             <StopCircle size={14} /> Stop
                                          </Button>
                                       </>
                                    )}
                                    {medication.status === 'stopped' && (
                                       <Box>Stopped</Box>
                                    )}
                                 </Box>
                              </Box>
                           </td>

                           {/* Date Cells */}
                           {dateColumns.map((dateKey) => (
                              <td key={dateKey}>
                                 <Box>
                                    {timeSlots.map((time, idx) => {
                                       const slotKey = `${dateKey}T${time}`
                                       const dose = doseMap.get(slotKey)
                                       return (
                                          <MarGridCell
                                             key={`${dateKey}-${idx}`}
                                             dose={dose ?? null}
                                             visitId={visitId}
                                             orderStatus={medication.status}
                                          />
                                       )
                                    })}
                                 </Box>
                              </td>
                           ))}
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </Box>

         {/* Initials Legend */}
         {initialsMap.size > 0 && (
            <Box>
               <Box>Initials:</Box>
               {Array.from(initialsMap.entries()).map(([initials, name], i) => (
                  <Box key={initials}>
                     {i > 0 && <Box>&middot;</Box>}
                     <Box>{initials}</Box> = {name}
                  </Box>
               ))}
            </Box>
         )}
      </Box>
   )
}

export default MarGrid
