import { Head, router, usePage } from '@inertiajs/react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import AppointmentForm from './partials/createOrEdit'
import { IAppointment } from '@/interfaces/IAppointment'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { formatDob } from '@/utils/date'
import { useState, useEffect } from 'react'
import { Box, Button, Chip, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useModal } from '@/components/modal'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
const STATUS_COLORS: Record<string, ChipColor> = { scheduled: 'info', completed: 'success', cancelled: 'default', no_show: 'error' }
const TYPE_COLORS: Record<string, ChipColor> = { consultation: 'primary', vaccination: 'warning', follow_up: 'secondary', checkup: 'success', other: 'default' }

const Appointment = () => {
  const { openModal, closeModal, openAlert } = useModal()
  const { appointments, search: searchProp, dateFilter, statusFilter } = usePage<{
        appointments: PaginatedData<IAppointment>; search: string | null; dateFilter: string | null; statusFilter: string | null
    }>().props
  const [searchTerm, setSearchTerm] = useState(searchProp ?? '')
  const [date, setDate] = useState(dateFilter ?? '')
  const [status, setStatus] = useState(statusFilter ?? '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params: Record<string, string> = {}
      if (searchTerm) params.search = searchTerm
      if (date) params.date = date
      if (status) params.status = status
      router.get('/appointments', params, { preserveState: true, replace: true })
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchTerm, date, status])

  const handleCreate = () => openModal({ title: 'New Appointment', content: <AppointmentForm onClose={closeModal} />, config: { preventClickAway: true, maxWidth: '2xl' } })
  const handleEdit = (appointment: IAppointment) => openModal({ title: 'Edit Appointment', content: <AppointmentForm appointment={appointment} onClose={closeModal} />, config: { preventClickAway: true, maxWidth: '2xl' } })
  const handleDelete = (appointment: IAppointment) => openAlert({ message: 'Delete this appointment?', description: 'This action cannot be undone.', variant: 'danger', confirmLabel: 'Delete', onConfirm: () => router.delete(`/appointments/${appointment.id}`) })

  const columns: Column<IAppointment>[] = [
    { header: 'កាលបរិច្ឆេទ', cell: (a) => formatDob(a.created_at) },
    { header: 'អ្នកជំងឺ', cell: (a) => a.patient ? <Typography component="span" sx={{ fontFamily: 'inherit' }}>{a.patient.khmer_last_name} {a.patient.khmer_first_name}</Typography> : <Typography component="span" color="text.disabled">&mdash;</Typography> },
    { header: 'ប្រភេទ', cell: (a) => <Chip size="small" label={a.type.replace('_', ' ')} color={TYPE_COLORS[a.type] ?? 'default'} sx={{ textTransform: 'capitalize' }} /> },
    { header: 'ស្ថានភាព', cell: (a) => <Chip size="small" label={a.status.replace('_', ' ')} color={STATUS_COLORS[a.status] ?? 'default'} sx={{ textTransform: 'capitalize' }} /> },
    { header: 'កាលបរិច្ឆេទណាត់', cell: (a) => formatDob(a.appointment_date) },
    { header: 'កំណត់ចំណាំ', cell: (a) => a.notes ?? <Typography component="span" color="text.disabled">&mdash;</Typography> },
    { header: 'ការជូនដំណឹងវ៉ាក់សាំង', cell: (a) => a.has_vaccine_alerts ? <Chip size="small" color="error" label="⚠ ជិតដល់" /> : <Typography component="span" color="text.disabled">&mdash;</Typography> },
    { header: 'សកម្មភាព', cell: (a) => <Stack direction="row" sx={{ justifyContent: 'flex-end' }}><IconButton onClick={() => handleEdit(a)} aria-label="Edit appointment"><Pencil size={16} /></IconButton><IconButton color="error" onClick={() => handleDelete(a)} aria-label="Delete appointment"><Trash2 size={16} /></IconButton></Stack> },
  ]
  const { data, ...pagination } = appointments

  return <>
    <Head title="កាលវិភាគ" />
    <Box sx={{ p: 4 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 3, alignItems: { xs: 'stretch', lg: 'center' }, justifyContent: 'space-between' }}>
        <Box><Typography variant="h4" sx={{ fontWeight: 700 }}>កាលវិភាគ</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>គ្រប់គ្រងកាលវិភាគអ្នកជំងឺ</Typography></Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: 'stretch' }}>
          <TextField size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patient name" slotProps={{ htmlInput: { 'aria-label': 'Search patient name' } }} />
          <TextField size="small" type="date" value={date} onChange={(e) => setDate(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { 'aria-label': 'Filter by date' } }} />
          <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty slotProps={{ input: { 'aria-label': 'Filter by status' } }}><MenuItem value="">All status</MenuItem><MenuItem value="scheduled">Scheduled</MenuItem><MenuItem value="completed">Completed</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem><MenuItem value="no_show">No Show</MenuItem></Select>
          <Button onClick={handleCreate} size="large" variant="contained" startIcon={<Plus size={20} />}>New Appointment</Button>
        </Stack>
      </Stack>
      <DataTable data={data} keyExtractor={(a) => a.id} columns={columns} emptyMessage="No appointments found" emptyDescription="Create a new appointment to get started." pagination={pagination} baseUrl="/appointments" />
    </Box>
  </>
}
export default Appointment
