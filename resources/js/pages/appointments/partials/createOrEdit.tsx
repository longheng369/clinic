import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { Save } from 'lucide-react';
import { useToast } from '@/components/toast';
import { useModal } from '@/components/modal';
import {
  IAppointment,
  IAppointmentAlert,
  IAppointmentFormData,
} from '@/interfaces/IAppointment';
import ServerAutocomplete from '@/components/form/serverAutocomplete';
import Select from '@/components/form/select';
import Textarea from '@/components/form/textarea';
import { DateCalendar, StaticTimePicker } from '@mui/x-date-pickers';
import type { IOption } from '@/interfaces/IOption';

type Props = {
  appointment?: IAppointment;
  readOnly?: boolean;
};

const APPOINTMENT_TYPES: IOption<string>[] = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'checkup', label: 'Checkup' },
  { value: 'other', label: 'Other' },
];

const AppointmentForm = ({ appointment, readOnly = false }: Props) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [vaccineAlerts, setVaccineAlerts] = useState<IAppointmentAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    appointment?.appointment_date ? dayjs(appointment.appointment_date) : null
  );
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
    appointment?.appointment_time
      ? dayjs(`2000-01-01T${appointment.appointment_time}`)
      : null
  );
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, watch, setValue } = useForm<IAppointmentFormData>({
    defaultValues: appointment
      ? {
        patient_id: appointment.patient?.id ?? null,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time ?? '',
        type: appointment.type,
        notes: appointment.notes ?? '',
      }
      : {
        patient_id: null,
        appointment_date: '',
        appointment_time: '',
        type: 'consultation',
        notes: '',
      },
  });

  const selectedPatientId = watch('patient_id');

  useEffect(() => {
    if (!selectedPatientId) {
      setVaccineAlerts([]);
      return;
    }

    setLoadingAlerts(true);
    fetch(`/appointments/patients/${selectedPatientId}/vaccine-alerts`)
      .then((response) => response.json())
      .then((data) => setVaccineAlerts(data.alerts ?? []))
      .catch(() => setVaccineAlerts([]))
      .finally(() => setLoadingAlerts(false));
  }, [selectedPatientId]);

  useEffect(() => {
    if (selectedDate) {
      setValue('appointment_date', selectedDate.format('YYYY-MM-DD'));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue('appointment_time', selectedTime.format('HH:mm'));
    }
  }, [selectedTime, setValue]);

  const onSubmit = handleSubmit((data) => {
    const hasDateError = !selectedDate;
    const hasTimeError = !selectedTime;
    setDateError(hasDateError);
    setTimeError(hasTimeError);

    if (hasDateError || hasTimeError) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const options = {
      onSuccess: () => {
        closeModal();
        toast(`Appointment ${appointment ? 'updated' : 'created'} successfully!`, {
          variant: 'success',
        });
      },
      onError: (errors: Record<string, string>) => {
        if (errors.patient_id) {
          toast('Unable to create appointment', {
            variant: 'error',
            description: 'Please select a patient.',
          });
        }
      },
      onFinish: () => setIsProcessing(false),
    };

    if (appointment) {
      router.put(
        `/appointments/${appointment.id}`,
        { ...data, status: appointment.status } as Record<string, any>,
        options,
      );
      return;
    }

    router.post('/appointments', data as Record<string, any>, options);
  });

  const formatDateTime = () => {
    if (!selectedDate) return 'No date selected';
    const dateStr = selectedDate.format('dddd, MMMM D, YYYY');
    if (!selectedTime) return dateStr;
    const timeStr = selectedTime.format('hh:mm A');
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Stack spacing={3}>
          <ServerAutocomplete
            control={control}
            name="patient_id"
            label="Patient"
            model="patient"
            rules={{ required: readOnly ? undefined : 'Please select a patient' }}
            disabled={readOnly}
          />

          <Select
            control={control}
            name="type"
            label="Appointment Type"
            rules={{ required: readOnly ? undefined : 'This field is required' }}
            options={APPOINTMENT_TYPES}
            disabled={readOnly}
          />

          <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
            <Box>
              <DateCalendar
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setDateError(false);
                }}
                readOnly={readOnly}
                sx={{ mx: 0 }}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  borderRadius: 1,
                  boxShadow: timeError
                    ? 'inset 0 0 0 2px var(--mui-palette-error-main)'
                    : 'none',
                }}
              >
                <StaticTimePicker
                  value={selectedTime}
                  onChange={(time) => {
                    setSelectedTime(time);
                    setTimeError(false);
                  }}
                  readOnly={readOnly}
                  orientation="landscape"
                  sx={{
                    '& .MuiClockNumber-root.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                    '& .MuiClockNumber-root.Mui-selected:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiButtonBase-root.Mui-selected': {
                      color: 'primary.main',
                    },
                    '& .MuiPickersToolbarText-root': {
                      color: '#BFC9D1',
                    },
                    '& .MuiPickersToolbarText-root[data-selected="true"]': {
                      color: 'primary.main',
                    },
                  }}
                  slotProps={{
                    actionBar: {
                      actions: [],
                    },
                    layout: {
                      sx: {
                        width: 'auto',
                        maxWidth: 'fit-content',
                      },
                    },
                  }}
                />
              </Box>
              {timeError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Please select a time
                </Alert>
              )}
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {formatDateTime()}
          </Typography>

          <Textarea control={control} name="notes" label="Notes" disabled={readOnly} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={() => closeModal()} variant="outlined">
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
        {!readOnly && (
          <Button
            type="submit"
            disabled={isProcessing}
            variant="contained"
            startIcon={<Save size={16} />}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Box>
  );
};

export default AppointmentForm;
