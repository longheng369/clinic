import { Box } from '@mui/material'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, StopCircle, Play, Pause, RotateCcw } from 'lucide-react'
import type { IMedicationOrder } from '@/interfaces/IMedicationOrder'
import type { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import type { IPatient } from '@/interfaces/IPatient'
import MarGridCell from './MarGridCell'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import { formatDob } from '@/utils/date'

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
   active: { label: 'Active', className: 'bg-green-100 text-green-700' },
   on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700' },
   stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
   completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
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

function buildDateRange(administrations: IMedicationAdministration[]): string[] {
   let earliest: Date | null = null
   let latest: Date | null = null

   for (const admin of administrations) {
      const d = new Date(admin.scheduled_at)
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

function collectInitials(orders: IMedicationOrder[]): Map<string, string> {
   const map = new Map<string, string>()
   for (const m of orders) {
      for (const a of m.administrations) {
         if (a.administered_by && a.status === 'provided') {
            const initials = getInitials(a.administered_by)
            if (!map.has(initials)) {
               map.set(initials, a.administered_by)
            }
         }
      }
   }
   return map
}

interface MarGridProps {
   patient: IPatient
   orders: IMedicationOrder[]
   visitId: number
   onEdit?: (order: IMedicationOrder) => void
   showActions?: boolean
}

const MarTable = ({ patient, orders, visitId, onEdit, showActions = true }: MarGridProps) => {
   const { openAlert } = useModal()

   const allAdministrations = orders.flatMap((m) => m.administrations)
   const dateColumns = buildDateRange(allAdministrations)
   const initialsMap = collectInitials(orders)

   const handleStop = (m: IMedicationOrder) => {
      openAlert({
         message: `Stop ${m.medicine?.name ?? 'medication'}?`,
         description: 'All pending doses will be cancelled.',
         variant: 'danger',
         confirmLabel: 'Stop',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/stop`, {}),
      })
   }

   const handleContinue = (m: IMedicationOrder) => {
      openAlert({
         message: `Continue ${m.medicine?.name ?? 'medication'}?`,
         description: `A new treatment cycle will begin (Cycle ${m.cycle_no + 1}).`,
         variant: 'info',
         confirmLabel: 'Continue',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/continue`, {}),
      })
   }

   const handleHold = (m: IMedicationOrder) => {
      openAlert({
         message: `Place ${m.medicine?.name ?? 'medication'} on hold?`,
         description: 'Doses cannot be administered while on hold.',
         variant: 'warning',
         confirmLabel: 'Hold',
         onConfirm: () => router.post(`/visits/${visitId}/medications/${m.id}/hold`, {}),
      })
   }

   const handleResume = (m: IMedicationOrder) => {
      router.post(`/visits/${visitId}/medications/${m.id}/resume`, {})
   }

   return (
      <Box>
         {/* Patient Info Header */}
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               gap: 1,
               px: 3,
               py: 2,
               border: '1px solid #e2e8f0',
               borderRadius: '8px 8px 0 0',
               bgcolor: '#f8fafc',
               fontSize: 13,
               color: '#475569',
               flexWrap: 'wrap',
            }}
         >
            <Box sx={{ fontWeight: 600, color: '#1e293b' }}>
               {patient.khmer_last_name} {patient.khmer_first_name}
            </Box>
            {patient.first_name && (
               <Box>
                  ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
               </Box>
            )}
            <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
            <Box>
               DOB: {formatDob(patient.date_of_birth)}
            </Box>
            {patient.blood_group && (
               <>
                  <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
                  <Box>{patient.blood_group}</Box>
               </>
            )}
            {patient.allergy && (
               <>
                  <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
                  <Box sx={{ color: '#ef4444' }}>
                     Allergy: {patient.allergy}
                  </Box>
               </>
            )}
            {dateColumns.length > 0 && (
               <>
                  <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>
                  <Box>
                     {dateColumns[0].slice(5)} – {dateColumns[dateColumns.length - 1].slice(5)}
                  </Box>
               </>
            )}
         </Box>

         {/* Grid Table */}
         <Box sx={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderTop: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
               <thead>
                  <tr>
                     <th
                        style={{
                           position: 'sticky',
                           left: 0,
                           zIndex: 2,
                           background: '#f1f5f9',
                           textAlign: 'left',
                           padding: '10px 16px',
                           fontWeight: 600,
                           color: '#475569',
                           borderBottom: '2px solid #e2e8f0',
                           borderRight: '1px solid #e2e8f0',
                           minWidth: 220,
                           fontSize: 12,
                        }}
                     >
                        Medication
                     </th>
                     {dateColumns.map((dateKey) => (
                        <th key={dateKey}
                           style={{
                              padding: '10px 8px',
                              fontWeight: 500,
                              color: '#475569',
                              borderBottom: '2px solid #e2e8f0',
                              whiteSpace: 'nowrap',
                              fontSize: 11,
                              minWidth: 56,
                              textAlign: 'center',
                           }}
                        >
                           {formatDate(new Date(dateKey + 'T00:00:00'))}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {orders.map((order) => {
                     const statusBadge = ORDER_STATUS[order.status] ?? ORDER_STATUS.active
                     const medicineName = order.medicine?.name ?? 'Unknown'
                     const unitPrice = order.medicine?.unit_price

                     const hasAdministrationActivity = order.administrations.some(
                        (d) => d.status === 'provided' || d.status === 'missed' || d.status === 'refused'
                     )
                     const canEdit = !hasAdministrationActivity && (order.status === 'active' || order.status === 'on_hold')

                     const timeSlots = getTimeSlots(order.interval)

                     const adminMap = new Map<string, IMedicationAdministration>()
                     for (const admin of order.administrations) {
                        adminMap.set(admin.scheduled_at.slice(0, 16), admin)
                     }

                     return (
                        <tr
                           key={order.id}
                           style={{ borderBottom: '1px solid #f1f5f9' }}
                        >
                           {/* Medication Info Column */}
                           <td style={{ position: 'sticky', left: 0, zIndex: 1, background: '#fff', padding: '10px 16px', borderRight: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                              <Box sx={{ position: 'relative' }}>
                                 {order.status === 'stopped' && (
                                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(241,245,249,0.6)', pointerEvents: 'none' }} />
                                 )}
                                 <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                       <Box sx={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{medicineName}</Box>
                                       <Box
                                          className={statusBadge.className}
                                          sx={{ display: 'inline-block', px: 1.5, py: 0.125, borderRadius: 10, fontSize: 10, fontWeight: 500 }}
                                       >
                                          {statusBadge.label}
                                       </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b', fontSize: 11, flexWrap: 'wrap' }}>
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
                                       <Box sx={{ fontSize: 11, color: '#94a3b8', mt: 0.25 }}>Dr. {order.created_by}</Box>
                                    )}
                                    {order.notes && (
                                       <Box sx={{ fontSize: 11, color: '#94a3b8', mt: 0.25 }}>{order.notes}</Box>
                                    )}

                                    {/* Action Buttons */}
                                    {showActions && (
                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                          {canEdit && (
                                             <IconButton onClick={() => onEdit?.(order)} aria-label="Edit order" title="Edit">
                                                <Pencil size={14} />
                                             </IconButton>
                                          )}
                                          {order.status === 'active' && (
                                             <>
                                                <Button variant="outline" size="sm" onClick={() => handleHold(order)}>
                                                   <Pause size={14} /> Hold
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleStop(order)}>
                                                   <StopCircle size={14} /> Stop
                                                </Button>
                                             </>
                                          )}
                                          {order.status === 'on_hold' && (
                                             <>
                                                <Button variant="outline" size="sm" onClick={() => handleResume(order)}>
                                                   <Play size={14} /> Resume
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleStop(order)}>
                                                   <StopCircle size={14} /> Stop
                                                </Button>
                                             </>
                                          )}
                                          {order.status === 'completed' && (
                                             <>
                                                <Button variant="outline" size="sm" onClick={() => handleContinue(order)}>
                                                   <RotateCcw size={14} /> Continue
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleStop(order)}>
                                                   <StopCircle size={14} /> Stop
                                                </Button>
                                             </>
                                          )}
                                          {order.status === 'stopped' && (
                                             <Box sx={{ fontSize: 11, color: '#94a3b8' }}>Stopped</Box>
                                          )}
                                       </Box>
                                    )}
                                 </Box>
                              </Box>
                           </td>

                           {/* Date Cells */}
                           {dateColumns.map((dateKey) => (
                              <td key={dateKey} style={{ padding: '4px', verticalAlign: 'top' }}>
                                 <Box>
                                    {timeSlots.map((time, idx) => {
                                       const slotKey = `${dateKey}T${time}`
                                       const admin = adminMap.get(slotKey)
                                       return (
                                          <MarGridCell
                                             key={`${dateKey}-${idx}`}
                                             administration={admin ?? null}
                                             visitId={visitId}
                                             orderStatus={order.status}
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
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  py: 2,
                  border: '1px solid #e2e8f0',
                  borderTop: 0,
                  borderRadius: '0 0 8px 8px',
                  bgcolor: '#f8fafc',
                  fontSize: 12,
                  color: '#64748b',
                  flexWrap: 'wrap',
               }}
            >
               <Box sx={{ fontWeight: 600, color: '#475569' }}>Initials:</Box>
               {Array.from(initialsMap.entries()).map(([initials, name], i) => (
                  <Box key={initials} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     {i > 0 && <Box sx={{ color: '#cbd5e1' }}>&middot;</Box>}
                     <Box sx={{ fontWeight: 600, color: '#334155' }}>{initials}</Box> = {name}
                  </Box>
               ))}
            </Box>
         )}
      </Box>
   )
}

export default MarTable
