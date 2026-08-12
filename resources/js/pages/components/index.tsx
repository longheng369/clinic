import { useState } from 'react'
import { Head } from '@inertiajs/react'
import {
   Box,
   Collapse,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   IconButton,
   Typography,
} from '@mui/material'
import { ChevronDown, ChevronRight } from 'lucide-react'

type FakeAdmin = { id: number; administration_no: number; scheduled_at: string; status: string; administered_by: string | null; unit_price: number; reason?: string | null }

const FAKE_ORDERS: {
   id: number
   medicine: { name: string; unit_price: number }
   dosage: number
   unit: string
   route: string
   interval: string
   status: string
   administrations: FakeAdmin[]
}[] = [
      {
         id: 1,
         medicine: { name: 'Paracetamol', unit_price: 0.5 },
         dosage: 500,
         unit: 'mg',
         route: 'PO',
         interval: 'TID',
         status: 'active',
         administrations: [
            { id: 1, administration_no: 1, scheduled_at: '2026-08-12T08:00:00', status: 'provided', administered_by: 'Dr. Sok', unit_price: 0.5 },
            { id: 2, administration_no: 2, scheduled_at: '2026-08-12T14:00:00', status: 'provided', administered_by: 'Nurse Dara', unit_price: 0.5 },
            { id: 3, administration_no: 3, scheduled_at: '2026-08-12T20:00:00', status: 'pending', administered_by: null, unit_price: 0.5 },
         ],
      },
      {
         id: 2,
         medicine: { name: 'Amoxicillin', unit_price: 1.2 },
         dosage: 250,
         unit: 'mg',
         route: 'PO',
         interval: 'BID',
         status: 'active',
         administrations: [
            { id: 4, administration_no: 1, scheduled_at: '2026-08-12T08:00:00', status: 'provided', administered_by: 'Nurse Dara', unit_price: 1.2 },
            { id: 5, administration_no: 2, scheduled_at: '2026-08-12T20:00:00', status: 'missed', administered_by: null, unit_price: 1.2, reason: 'Patient absent' },
         ],
      },
      {
         id: 3,
         medicine: { name: 'Ceftriaxone', unit_price: 3.0 },
         dosage: 1000,
         unit: 'mg',
         route: 'IV',
         interval: 'QD',
         status: 'on_hold',
         administrations: [
            { id: 6, administration_no: 1, scheduled_at: '2026-08-12T08:00:00', status: 'pending', administered_by: null, unit_price: 3.0 },
         ],
      },
   ]

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
   active: { label: 'Active', className: 'bg-green-100 text-green-700' },
   on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700' },
   stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
   completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
}

const DOSE_STATUS: Record<string, { label: string; className: string }> = {
   pending: { label: 'Pending', className: 'bg-blue-100 text-blue-700' },
   provided: { label: 'Provided', className: 'bg-green-100 text-green-700' },
   missed: { label: 'Missed', className: 'bg-orange-100 text-orange-700' },
   refused: { label: 'Refused', className: 'bg-purple-100 text-purple-700' },
   cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
}

type Order = (typeof FAKE_ORDERS)[number]

const OrderRow = ({ order }: { order: Order }) => {
   const [open, setOpen] = useState(false)
   const badge = ORDER_STATUS[order.status] ?? ORDER_STATUS.active

   return (
      <>
         <TableRow
            hover
            onClick={() => setOpen(!open)}
            sx={{
               cursor: 'pointer',
               '& td': { borderBottom: open ? 'none' : undefined },
            }}
         >
            <TableCell sx={{ width: 48, px: 1 }}>
               <IconButton size="small" sx={{ size: 28 }}>
                  {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
               </IconButton>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 14 }}>
               {order.medicine?.name}
            </TableCell>
            <TableCell>
               <Box
                  className={badge.className}
                  sx={{ display: 'inline-block', px: 2, py: 0.25, borderRadius: 10, fontSize: 11, fontWeight: 500 }}
               >
                  {badge.label}
               </Box>
            </TableCell>
            <TableCell sx={{ color: '#64748b' }}>
               {order.dosage} {order.unit}
            </TableCell>
            <TableCell sx={{ color: '#64748b' }}>{order.route}</TableCell>
            <TableCell sx={{ color: '#64748b' }}>{order.interval}</TableCell>
            <TableCell>
               {order.medicine?.unit_price != null ? `$${order.medicine.unit_price.toFixed(2)}` : '—'}
            </TableCell>
         </TableRow>
         <TableRow sx={{ '& td': { borderBottom: 1, borderColor: 'divider' } }}>
            <TableCell sx={{ py: 0 }} colSpan={7}>
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ py: 2, px: 3, bgcolor: '#f8fafc' }}>
                     <Box sx={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', mb: 1 }}>
                        Medication Administration Record
                     </Box>
                     <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <Box component="thead">
                           <Box component="tr">
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>#</Box>
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>Scheduled</Box>
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>Status</Box>
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>Administered by</Box>
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>Price</Box>
                              <Box component="th" sx={{ textAlign: 'left', p: 1, color: '#64748b', fontWeight: 600, fontSize: 11 }}>Reason</Box>
                           </Box>
                        </Box>
                        <Box component="tbody">
                           {order.administrations.map((d) => {
                              const doseB = DOSE_STATUS[d.status] ?? DOSE_STATUS.pending
                              return (
                                 <Box component="tr" key={d.id} sx={{ '&:hover': { bgcolor: '#fff' } }}>
                                    <Box component="td" sx={{ p: 1, fontSize: 12, color: '#475569' }}>
                                       {d.administration_no != null ? `#${d.administration_no}` : '—'}
                                    </Box>
                                    <Box component="td" sx={{ p: 1, fontSize: 12, color: '#475569' }}>
                                       {new Date(d.scheduled_at).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </Box>
                                    <Box component="td" sx={{ p: 1 }}>
                                       <Box
                                          className={doseB.className}
                                          sx={{ display: 'inline-block', px: 1.5, py: 0.25, borderRadius: 10, fontSize: 10, fontWeight: 500 }}
                                       >
                                          {doseB.label}
                                       </Box>
                                    </Box>
                                    <Box component="td" sx={{ p: 1, fontSize: 12, color: '#475569' }}>
                                       {d.administered_by ?? '—'}
                                    </Box>
                                    <Box component="td" sx={{ p: 1, fontSize: 12, color: '#475569' }}>
                                       {d.unit_price != null ? `$${d.unit_price.toFixed(2)}` : '—'}
                                    </Box>
                                    <Box component="td" sx={{ p: 1, fontSize: 12, color: '#94a3b8' }}>
                                       {d.reason ?? '—'}
                                    </Box>
                                 </Box>
                              )
                           })}
                        </Box>
                     </Box>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </>
   )
}

const ComponentPages = () => {
   return (
      <>
         <Head title="Collapsible Table Demo" />
         <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
               Collapsible Table — Medication Orders
            </Typography>
            <Typography sx={{ mb: 3, color: '#94a3b8', fontSize: 14 }}>
               Click a row to expand and see the administration record. Uses MUI <code>Collapse</code> inside <code>TableRow</code>.
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
               <Table size="small">
                  <TableHead>
                     <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ width: 48 }} />
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Medicine</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Dosage</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Route</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Interval</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#475569' }}>Price/Dose</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {FAKE_ORDERS.map((order) => (
                        <OrderRow key={order.id} order={order} />
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Box>
      </>
   )
}

export default ComponentPages
