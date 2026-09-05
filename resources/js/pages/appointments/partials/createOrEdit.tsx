import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useController, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import {
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
  const { toast } = useToast();

  const { control, handleSubmit, watch } = useForm<IAppointmentFormData>({
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

  const {
    field: dateField,
    fieldState: dateFieldState,
  } = useController({
    control,
    name: 'appointment_date',
    rules: readOnly ? undefined : { required: 'Please select a date' },
  });

  const {
    field: timeField,
    fieldState: timeFieldState,
  } = useController({
    control,
    name: 'appointment_time',
    rules: readOnly ? undefined : { required: 'Please select a time' },
  });

  const selectedDate = watch('appointment_date');
  const selectedTime = watch('appointment_time');

  const onSubmit = handleSubmit((data) => {
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
    const dateStr = dayjs(selectedDate).format('dddd, MMMM D, YYYY');
    if (!selectedTime) return dateStr;
    const timeStr = dayjs(`2000-01-01T${selectedTime}`).format('hh:mm A');
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
              <Box
                sx={{
                  borderRadius: 1,
                  boxShadow: dateFieldState.error
                    ? 'inset 0 0 0 2px var(--mui-palette-error-main)'
                    : 'none',
                }}
              >
                <DateCalendar
                  value={dateField.value ? dayjs(dateField.value) : null}
                  onChange={(date: Dayjs | null) => {
                    dateField.onChange(date ? date.format('YYYY-MM-DD') : '');
                  }}
                  readOnly={readOnly}
                  sx={{ mx: 0 }}
                />
              </Box>
              {dateFieldState.error && (
                <Typography color="error" variant="caption">
                  {dateFieldState.error.message}
                </Typography>
              )}
            </Box>
            <Box>
              <Box
                sx={{
                  borderRadius: 1,
                  boxShadow: timeFieldState.error
                    ? 'inset 0 0 0 2px var(--mui-palette-error-main)'
                    : 'none',
                }}
              >
                <StaticTimePicker
                  value={timeField.value ? dayjs(`2000-01-01T${timeField.value}`) : null}
                  onChange={(time: Dayjs | null) => {
                    timeField.onChange(time ? time.format('HH:mm') : '');
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
              {timeFieldState.error && (
                <Typography color="error" variant="caption">
                  {timeFieldState.error.message}
                </Typography>
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
