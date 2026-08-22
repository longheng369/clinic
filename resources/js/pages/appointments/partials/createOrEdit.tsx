import { useForm } from 'react-hook-form'
import Input from '@/components/form/input-deprecated'
import Textarea from '@/components/form/textarea'
import Select from '@/components/form/select-deprecated'
import SearchSelect from '@/components/form/searchSelect'
import { IAppointment, IAppointmentFormData, IAppointmentAlert } from '@/interfaces/IAppointment'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Alert, Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useToast } from '@/components/toast'
import { AlertTriangle, Clock } from 'lucide-react'

interface AppointmentFormProps { appointment?: IAppointment; onClose: () => void }

const AppointmentForm = ({ appointment, onClose }: AppointmentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [vaccineAlerts, setVaccineAlerts] = useState<IAppointmentAlert[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const { toast } = useToast()
  const { control, handleSubmit, watch } = useForm<IAppointmentFormData>({ defaultValues: appointment ? { patient_id: appointment.patient?.id ?? null, appointment_date: appointment.appointment_date, appointment_time: appointment.appointment_time ?? '', type: appointment.type, notes: appointment.notes ?? '' } : { patient_id: null, appointment_date: new Date().toISOString().split('T')[0], appointment_time: '', type: 'consultation', notes: '' } })
  const selectedPatientId = watch('patient_id')
  useEffect(() => {
    if (!selectedPatientId) { setVaccineAlerts([]); return }
    setLoadingAlerts(true)
    fetch(`/appointments/patients/${selectedPatientId}/vaccine-alerts`).then((res) => res.json()).then((data) => setVaccineAlerts(data.alerts ?? [])).catch(() => setVaccineAlerts([])).finally(() => setLoadingAlerts(false))
  }, [selectedPatientId])
  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true)
    const options = { onSuccess: () => { onClose(); toast(`Appointment ${appointment ? 'updated' : 'created'} successfully!`, { variant: 'success' }) }, onError: (errors: Record<string, string>) => { if (errors.patient_id) toast('Unable to create appointment', { variant: 'error', description: 'Please select a patient.' }) }, onFinish: () => setIsProcessing(false) }
    if (appointment) router.put(`/appointments/${appointment.id}`, { ...data, status: appointment.status } as Record<string, any>, options)
    else router.post('/appointments', data as Record<string, any>, options)
  })
  return <Box component="form" onSubmit={onSubmit} noValidate sx={{ borderTop: 1, borderColor: 'divider' }}>
    <Stack spacing={2} sx={{ p: 3 }}>
      <SearchSelect label="Patient" control={control} name="patient_id" apiUrl="/appointments/patients/search" initialOption={appointment?.patient ? { value: appointment.patient.id, label: `${appointment.patient.khmer_last_name} ${appointment.patient.khmer_first_name}` } : undefined} rules={{ required: 'This field is required' }} />
      {loadingAlerts && <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><CircularProgress size={14} /><Typography variant="caption" color="text.secondary">Checking vaccine alerts...</Typography></Stack>}
      {vaccineAlerts.length > 0 && <Alert severity="error" icon={<AlertTriangle size={18} />}><Typography variant="subtitle2" sx={{ mb: 1 }}>Vaccination Due Alerts</Typography><Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2 }}>{vaccineAlerts.map((alert, i) => <Box component="li" key={i}><Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><>{alert.is_overdue ? <AlertTriangle size={13} /> : <Clock size={13} />}</><Typography variant="body2"><strong>{alert.vaccine_name}</strong> — Dose {alert.dose_number} ({alert.doses_completed}/{alert.total_doses} completed){alert.is_overdue ? ` — Overdue since ${alert.due_date}` : ` — Due ${alert.due_date}`}</Typography></Stack></Box>)}</Stack></Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Box sx={{ flex: 1 }}><Input label="Appointment Date" control={control} name="appointment_date" type="date" rules={{ required: 'This field is required' }} /></Box><Box sx={{ flex: 1 }}><Input label="Time (optional)" control={control} name="appointment_time" type="time" /></Box></Stack>
      <Select label="Type" control={control} name="type" rules={{ required: 'This field is required' }} options={[{ value: 'consultation', label: 'Consultation' }, { value: 'vaccination', label: 'Vaccination' }, { value: 'follow_up', label: 'Follow Up' }, { value: 'checkup', label: 'Checkup' }, { value: 'other', label: 'Other' }]} />
      <Textarea label="Notes" control={control} name="notes" />
    </Stack>
    {vaccineAlerts.length > 0 && <Typography variant="caption" color="text.secondary" sx={{ px: 3 }}>These alerts will be saved with the appointment record for reference.</Typography>}
    <Divider sx={{ mt: 1 }} /><Stack direction="row" spacing={1} sx={{p: 1, justifyContent: 'flex-end'}}><Button type="button" onClick={onClose} variant="outlined">Cancel</Button><Button type="submit" disabled={isProcessing} variant="contained">{appointment ? 'Update' : 'Create'}</Button></Stack>
  </Box>
}
export default AppointmentForm
