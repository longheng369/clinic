import { Head, router, usePage } from '@inertiajs/react'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import ParaclinicForm from './partials/createOrEdit'
import { IParaclinicRequest } from '@/interfaces/IParaclinicRequest'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { useState, useEffect } from 'react'
import { Box, Button, Chip, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useModal } from '@/components/modal'

interface PaginatedData<T> { data: T[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }
type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
const STATUS_COLORS: Record<string, ChipColor> = { Draft: 'default', Requested: 'info', 'Waiting Result': 'warning', 'Result Received': 'success', Reviewed: 'primary', Completed: 'success', Cancelled: 'error' }
const PAYMENT_COLORS: Record<string, ChipColor> = { Unpaid: 'error', Partial: 'warning', Paid: 'success' }
const STATUS_OPTIONS = ['', 'Draft', 'Requested', 'Waiting Result', 'Result Received', 'Reviewed', 'Completed', 'Cancelled']
const PAYMENT_OPTIONS = ['', 'Unpaid', 'Partial', 'Paid']

const Index = () => {
  const { openModal, closeModal, openAlert } = useModal()
  const { requests, search: searchProp, filters, auth } = usePage<{ requests: PaginatedData<IParaclinicRequest>; search: string | null; filters: { status: string | null; payment_status: string | null; date_from: string | null; date_to: string | null }; auth: { user: { id: number; name: string } } }>().props
  const [searchTerm, setSearchTerm] = useState(searchProp ?? ''), [filterStatus, setFilterStatus] = useState(filters.status ?? ''), [filterPayment, setFilterPayment] = useState(filters.payment_status ?? '')
  useEffect(() => { const timeout = setTimeout(() => { if ((searchTerm || '') === (searchProp || '')) return; router.get('/paraclinic-requests', searchTerm ? { search: searchTerm } : {}, { preserveState: true, replace: true }) }, 300); return () => clearTimeout(timeout) }, [searchTerm, searchProp])
  const handleCreate = () => openModal({ title: 'New Paraclinic Request', content: <ParaclinicForm authUser={auth.user} onClose={closeModal} />, config: { preventClickAway: true, maxWidth: '4xl' } })
  const handleEdit = (r: IParaclinicRequest) => openModal({ title: `Edit Request ${r.request_number}`, content: <ParaclinicForm request={r} authUser={auth.user} onClose={closeModal} />, config: { preventClickAway: true, maxWidth: '4xl' } })
  const handleDelete = (r: IParaclinicRequest) => openAlert({ message: `Delete request ${r.request_number}?`, description: 'This action cannot be undone.', variant: 'danger', confirmLabel: 'Delete', onConfirm: () => router.delete(`/paraclinic-requests/${r.id}`) })
  const columns: Column<IParaclinicRequest>[] = [
    { header: 'លេខស្នើសុំ', cell: (r) => r.request_number }, { header: 'អ្នកជំងឺ', cell: (r) => r.patient ? <Typography component="span">{r.patient.khmer_last_name} {r.patient.khmer_first_name}</Typography> : <Typography component="span" color="text.disabled">&mdash;</Typography> }, { header: 'វេជ្ជបណ្ឌិត', cell: (r) => r.doctor?.name ?? <Typography component="span" color="text.disabled">&mdash;</Typography> }, { header: 'មន្ទីរពិសោធន៍', cell: (r) => r.external_facility_name ?? <Typography component="span" color="text.disabled">&mdash;</Typography> }, { header: 'កាលបរិច្ឆេទ', cell: (r) => r.request_date }, { header: 'ស្ថានភាព', cell: (r) => <Chip size="small" label={r.status} color={STATUS_COLORS[r.status] ?? 'default'} /> }, { header: 'ការទូទាត់', cell: (r) => <Chip size="small" label={r.payment_status} color={PAYMENT_COLORS[r.payment_status] ?? 'default'} /> }, { header: 'ចំនួនទឹកប្រាក់', cell: (r) => `$${(r.total_amount ?? 0).toFixed(2)}` }, { header: 'សកម្មភាព', cell: (r) => <Stack direction="row" sx={{ justifyContent: 'flex-end' }}><IconButton onClick={() => router.visit(`/paraclinic-requests/${r.id}`)} aria-label="View request"><Eye size={16} /></IconButton><IconButton onClick={() => handleEdit(r)} aria-label="Edit request"><Pencil size={16} /></IconButton><IconButton color="error" onClick={() => handleDelete(r)} aria-label="Delete request"><Trash2 size={16} /></IconButton></Stack> },
  ]
  const { data, ...pagination } = requests
  const filter = (value: string, key: string, setter: (v: string) => void) => { setter(value); router.get('/paraclinic-requests', { [key]: value || null }, { preserveState: true, replace: true }) }
  return <><Head title="Paraclinic Requests" /><Box sx={{ p: 4 }}><Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{mb: 3, justifyContent: 'space-between'}}><Box><Typography variant="h4" sx={{ fontWeight: 700 }}>Paraclinic Requests</Typography><Typography color="text.secondary">Manage diagnostic test requests for patients</Typography></Box><Button onClick={handleCreate} variant="contained" startIcon={<Plus size={20} />}>New Request</Button></Stack><Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}><TextField size="small" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by request number or patient..." slotProps={{ input: { 'aria-label': 'Search requests' } }} /><Select size="small" value={filterStatus} onChange={(e) => filter(e.target.value, 'status', setFilterStatus)} displayEmpty slotProps={{ input: { 'aria-label': 'Filter by status' } }}>{STATUS_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o || 'All Statuses'}</MenuItem>)}</Select><Select size="small" value={filterPayment} onChange={(e) => filter(e.target.value, 'payment_status', setFilterPayment)} displayEmpty slotProps={{ input: { 'aria-label': 'Filter by payment status' } }}>{PAYMENT_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o || 'All Payments'}</MenuItem>)}</Select></Stack><DataTable data={data} keyExtractor={(r) => r.id} columns={columns} emptyMessage="No paraclinic requests found" emptyDescription="Get started by creating a new request." pagination={pagination} baseUrl={searchProp ? `/paraclinic-requests?search=${encodeURIComponent(searchProp)}` : '/paraclinic-requests'} /></Box></>
}
export default Index
