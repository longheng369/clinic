import { Head, Link, usePage } from '@inertiajs/react'
import { IDashboardVaccinationAlert } from '@/interfaces/IPatientVaccination'
import { AlertTriangle, Clock, Syringe, CheckCircle2 } from 'lucide-react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'

const Dashboard = () => {
  const { vaccinationDueAlerts } = usePage<{ vaccinationDueAlerts: IDashboardVaccinationAlert[] }>().props
  const overdue = vaccinationDueAlerts.filter((a) => a.is_overdue)
  const upcoming = vaccinationDueAlerts.filter((a) => !a.is_overdue)
  return <>
    <Head title="Dashboard" />
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
      <Typography variant="body2" color="primary" sx={{ mb: 3 }}>Overview of your clinic</Typography>
      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Stack direction="row" spacing={1} sx={{p: 2, borderBottom: 1, borderColor: 'divider', alignItems: 'center'}}>
          <Syringe size={20} color="var(--mui-palette-primary-main)" /><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Vaccination Due Alerts</Typography>
          {vaccinationDueAlerts.length > 0 && <Chip sx={{ ml: 'auto' }} size="small" color="primary" label={`${vaccinationDueAlerts.length} alert${vaccinationDueAlerts.length !== 1 ? 's' : ''}`} />}
        </Stack>
        {vaccinationDueAlerts.length === 0 ? <Stack spacing={1} sx={{py: 8, alignItems: 'center'}}><CheckCircle2 size={40} color="var(--mui-palette-primary-light)" /><Typography variant="h6">All caught up!</Typography><Typography variant="body2" color="text.secondary">No vaccinations due within the next 7 days.</Typography></Stack> : <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>{overdue.length > 0 && <AlertGroup title={`Overdue — ${overdue.length} patient${overdue.length !== 1 ? 's' : ''}`} icon={<AlertTriangle size={14} />} alerts={overdue} />}{upcoming.length > 0 && <AlertGroup title={`Due Within 7 Days — ${upcoming.length} patient${upcoming.length !== 1 ? 's' : ''}`} icon={<Clock size={14} />} alerts={upcoming} />}</Stack>}
      </Paper>
    </Box>
  </>
}
const AlertGroup = ({ title, icon, alerts }: { title: string; icon: React.ReactNode; alerts: IDashboardVaccinationAlert[] }) => <Box sx={{ p: 2 }}><Stack direction="row" spacing={1} sx={{mb: 1, alignItems: 'center'}}><Box color="error.main">{icon}</Box><Typography variant="overline" color="text.secondary">{title}</Typography></Stack><Stack spacing={1}>{alerts.map((alert, i) => <AlertItem key={i} alert={alert} />)}</Stack></Box>
const AlertItem = ({ alert }: { alert: IDashboardVaccinationAlert }) => {
  const patientName = `${alert.patient.khmer_last_name} ${alert.patient.khmer_first_name}`
  const englishName = alert.patient.first_name ? `${alert.patient.last_name ?? ''} ${alert.patient.first_name}`.trim() : null
  return <Box component={Link as React.ElementType} href={`/patients/${alert.patient.id}?tab=vaccination`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: 1, borderColor: 'primary.100', borderRadius: 2, textDecoration: 'none', '&:hover': { bgcolor: 'primary.50' } }}><Stack direction="row" spacing={1.5} sx={{ minWidth: 0, alignItems: 'center' }}><Box color={alert.is_overdue ? 'error.main' : 'warning.main'}>{alert.is_overdue ? <AlertTriangle size={16} /> : <Clock size={16} />}</Box><Box sx={{ minWidth: 0 }}><Typography variant="body2" noWrap sx={{ fontWeight: 'medium' }}>{patientName} {englishName && <Typography component="span" variant="body2" color="text.secondary">({englishName})</Typography>}</Typography><Typography variant="caption" color="text.secondary">{alert.vaccine_name} — Dose {alert.dose_number} ({alert.doses_completed}/{alert.total_doses} completed)</Typography></Box></Stack><Typography variant="caption" color={alert.is_overdue ? 'error' : 'warning.main'} sx={{ whiteSpace: 'nowrap' }}>{alert.is_overdue ? 'Overdue: ' : 'Due: '}{new Date(alert.due_date).toLocaleDateString('en-US', { timeZone: 'Asia/Phnom_Penh', month: 'short', day: '2-digit' })}</Typography></Box>
}
export default Dashboard
