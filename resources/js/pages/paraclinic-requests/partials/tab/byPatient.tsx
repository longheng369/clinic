import { Link, usePage } from '@inertiajs/react'
import { IParaclinicRequest } from '@/interfaces/IParaclinicRequest'
import DataTable, { type Column } from '@/components/table/DataTable'
import { Button, Chip, Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
interface PaginatedData<T> { data: T[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }
const STATUS_COLORS: Record<string, 'default' | 'primary' | 'error' | 'info' | 'success' | 'warning'> = { Draft: 'default', Requested: 'info', 'Waiting Result': 'warning', 'Result Received': 'success', Reviewed: 'primary', Completed: 'success', Cancelled: 'error' }
const ParaclinicByPatientTab = ({ patientId }: { patientId: number }) => {
   const { paraclinicRequests } = usePage<{ paraclinicRequests: PaginatedData<IParaclinicRequest> }>().props
   const columns: Column<IParaclinicRequest>[] = [{ header: 'លេខស្នើសុំ', cell: (r) => <Link href={`/paraclinic-requests/${r.id}`} style={{ color: 'inherit' }}>{r.request_number}</Link> }, { header: 'វេជ្ជបណ្ឌិត', cell: (r) => r.doctor?.name ?? <Typography component="span" color="text.disabled">&mdash;</Typography> }, { header: 'មន្ទីរពិសោធន៍', cell: (r) => r.external_facility_name ?? <Typography component="span" color="text.disabled">&mdash;</Typography> }, { header: 'កាលបរិច្ឆេទ', cell: (r) => r.request_date }, { header: 'ស្ថានភាព', cell: (r) => <Chip size="small" label={r.status} color={STATUS_COLORS[r.status] ?? 'default'} /> }, { header: 'ចំនួនទឹកប្រាក់', cell: (r) => `$${(r.total_amount ?? 0).toFixed(2)}` }]
   const { data, ...pagination } = paraclinicRequests
   return <Stack spacing={2}><Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}><Typography color="text.secondary" variant="body2">Paraclinic test requests for this patient</Typography><Link href={`/paraclinic-requests?patient_id=${patientId}`}><Button startIcon={<Plus size={18} />} variant="contained">New Request</Button></Link></Stack><DataTable data={data} keyExtractor={(r) => r.id} columns={columns} emptyMessage="No paraclinic requests" emptyDescription="Create a paraclinic request for this patient." pagination={pagination} baseUrl={`/patients/${patientId}`} /></Stack>
}
export default ParaclinicByPatientTab
