import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import Select from '@/components/form/select'
import SearchSelect from '@/components/form/searchSelect'
import { IAppointment, IAppointmentFormData, IAppointmentAlert } from '@/interfaces/IAppointment'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { AlertTriangle, Clock } from 'lucide-react'

interface AppointmentFormProps {
    appointment?: IAppointment
    onClose: () => void
}

const AppointmentForm = ({ appointment, onClose }: AppointmentFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [vaccineAlerts, setVaccineAlerts] = useState<IAppointmentAlert[]>([])
    const [loadingAlerts, setLoadingAlerts] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit, watch } = useForm<IAppointmentFormData>({
        defaultValues: appointment ? {
            patient_id: appointment.patient?.id ?? null,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time ?? '',
            type: appointment.type,
            notes: appointment.notes ?? '',
        } : {
            patient_id: null,
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '',
            type: 'consultation',
            notes: '',
        },
    })

    const selectedPatientId = watch('patient_id')

    useEffect(() => {
        if (!selectedPatientId) {
            setVaccineAlerts([])
            return
        }
        setLoadingAlerts(true)
        fetch(`/appointments/patients/${selectedPatientId}/vaccine-alerts`)
            .then((res) => res.json())
            .then((data) => setVaccineAlerts(data.alerts ?? []))
            .catch(() => setVaccineAlerts([]))
            .finally(() => setLoadingAlerts(false))
    }, [selectedPatientId])

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)

        if (appointment) {
            router.put(`/appointments/${appointment.id}`, { ...data, status: appointment.status }, {
                onSuccess: () => {
                    onClose()
                    toast('Appointment updated successfully!', { variant: 'success' })
                },
                onFinish: () => setIsProcessing(false),
            })
            return
        }

        router.post('/appointments', { ...data }, {
            onSuccess: () => {
                onClose()
                toast('Appointment created successfully!', { variant: 'success' })
            },
            onError: (errors) => {
                if (errors.patient_id) {
                    toast('Unable to create appointment', {
                        variant: 'error',
                        description: 'Please select a patient.',
                    })
                }
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                <SearchSelect
                    label="Patient"
                    control={control}
                    name="patient_id"
                    apiUrl="/appointments/patients/search"
                    initialOption={appointment?.patient ? {
                        value: appointment.patient.id,
                        label: `${appointment.patient.khmer_last_name} ${appointment.patient.khmer_first_name}`,
                    } : undefined}
                    rules={{ required: 'This field is required' }}
                />

                {loadingAlerts && (
                    <p className="text-xs text-gray-400">Checking vaccine alerts...</p>
                )}

                {vaccineAlerts.length > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-red-500" />
                            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                                Vaccination Due Alerts
                            </span>
                        </div>
                        <ul className="space-y-1.5">
                            {vaccineAlerts.map((alert, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                                    {alert.is_overdue
                                        ? <AlertTriangle size={12} className="shrink-0" />
                                        : <Clock size={12} className="shrink-0" />
                                    }
                                    <span>
                                        <strong>{alert.vaccine_name}</strong> — Dose {alert.dose_number} ({alert.doses_completed}/{alert.total_doses} completed)
                                        {alert.is_overdue
                                            ? <span className="font-medium"> — Overdue since {alert.due_date}</span>
                                            : <span> — Due {alert.due_date}</span>
                                        }
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Appointment Date"
                        control={control}
                        name="appointment_date"
                        type="date"
                        rules={{ required: 'This field is required' }}
                    />
                    <Input
                        label="Time (optional)"
                        control={control}
                        name="appointment_time"
                        type="time"
                    />
                </div>

                <Select
                    label="Type"
                    control={control}
                    name="type"
                    rules={{ required: 'This field is required' }}
                    options={[
                        { value: 'consultation', label: 'Consultation' },
                        { value: 'vaccination', label: 'Vaccination' },
                        { value: 'follow_up', label: 'Follow Up' },
                        { value: 'checkup', label: 'Checkup' },
                        { value: 'other', label: 'Other' },
                    ]}
                />

                <Textarea
                    label="Notes"
                    control={control}
                    name="notes"
                />
            </div>

            {vaccineAlerts.length > 0 && (
                <div className="px-6 pb-2">
                    <p className="text-xs text-gray-500">
                        These alerts will be saved with the appointment record for reference.
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                    {appointment ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    )
}

export default AppointmentForm
