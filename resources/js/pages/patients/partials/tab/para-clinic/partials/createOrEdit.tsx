import { useForm } from 'react-hook-form';
import MultiAutocomplete from '@/components/form/multiAutocomplete';
import Textarea from '@/components/form/textarea';
import Select from '@/components/form/select';
import {
  IParaClinicRequest,
  IParaClinicRequestTest,
} from '@/interfaces/IParaClinicRequest';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { router, useHttp } from '@inertiajs/react';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useToast } from '@/components/toast';
import { Square, SquareCheckBig } from 'lucide-react';
import DateTimeField from '@/components/form/dateTime';
import { useModal } from '@/components/modal';
import { IDiagnosticTestAutocomplete } from '@/interfaces/IDiagnosticTest';

type FormData = {
  patient_id: number | null;
  visit_id: number | null;
  request_date: string;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status: string;
  diagnostic_test_ids: number[];
};

type Props = {
  requestId?: number;
  patientId: number;
  visitId?: number | null;
  consultationDiagnoses?: string[];
}

const ParaClinicForm = ({ requestId, patientId, visitId, consultationDiagnoses = [] }: Props) => {
  const { closeModal } = useModal();
  const { get } = useHttp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisTests, setDiagnosisTests] = useState<
    IDiagnosticTestAutocomplete[]
  >([]);
  const { toast } = useToast();

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      patient_id: patientId,
      visit_id: visitId ?? null,
      request_date: dayjs().format('DD-MM-YYYY HH:mm'),
      clinical_reason: '',
      provisional_diagnosis: '',
      notes: '',
      status: 'requested',
      diagnostic_test_ids: [],
    },
  });

  useEffect(() => {
    get('/autocomplete/DiagnosticTest?all=true', {
      onSuccess: (response) => {
        setDiagnosisTests(response as IDiagnosticTestAutocomplete[]);
      },
    });
  }, []);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    const controller = new AbortController();

    fetch(`/para-clinic-requests/${requestId}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((data: IParaClinicRequest) => {
        const savedTestIds = data.tests
          .filter(
            (
              test,
            ): test is IParaClinicRequestTest & {
              diagnostic_test_id: number;
            } => test.diagnostic_test_id != null,
          )
          .map((test) => test.diagnostic_test_id);

        reset({
          patient_id: data.patient_id ?? patientId,
          visit_id: data.visit_id,
          request_date: data.request_date,
          clinical_reason: data.clinical_reason,
          provisional_diagnosis: data.provisional_diagnosis,
          notes: data.notes,
          status: data.status,
          diagnostic_test_ids: savedTestIds,
        });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          toast('Failed to load the request.', { variant: 'error' });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [requestId]);

  const diagnosticTestIds = watch('diagnostic_test_ids');
  const totalFee = diagnosticTestIds.reduce((sum, id) => {
    const test = diagnosisTests.find((t) => t.value === id);
    return sum + (test?.price ?? 0);
  }, 0);

  const onSubmit = handleSubmit((data) => {
    const payload = {
      ...data,
      tests: data.diagnostic_test_ids,
    };

    setIsProcessing(true);

    const options = {
      onSuccess: () => {
        closeModal();
        toast(`Request ${requestId ? 'updated' : 'created'} successfully!`, {
          variant: 'success',
        });
        router.reload({ only: ['paraClinicRequests'] });
      },
      onError: (errors: Record<string, string | string[]>) => {
        const msg = Object.values(errors).flat().join(', ');
        toast(msg || 'Failed to save request.', { variant: 'error' });
      },
      onFinish: () => setIsProcessing(false),
    };

    if (requestId)
      router.put(`/para-clinic-requests/${requestId}`, payload, options);
    else router.post('/para-clinic-requests', payload, options);
  });

  if (isLoading) {
    return (
      <DialogContent dividers>
        <Stack sx={{ alignItems: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      </DialogContent>
    );
  }

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            General Information
          </Typography>
          <DateTimeField
            control={control}
            name="request_date"
            label="Request Date & Time"
            rules={{ required: 'Request date is required' }}
          />
          <Autocomplete
            freeSolo
            options={consultationDiagnoses}
            value={watch('provisional_diagnosis') ?? ''}
            onChange={(_, newValue) => setValue('provisional_diagnosis', newValue ?? '')}
            onInputChange={(_, newInputValue) => setValue('provisional_diagnosis', newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diagnosis"
                placeholder="Enter diagnosis"
                variant="standard"
                fullWidth
              />
            )}
          />
          <Textarea
            label="Clinical Reason"
            control={control}
            name="clinical_reason"
            placeholder="Enter clinical reason"
          />
          <Textarea
            label="Notes"
            control={control}
            name="notes"
            placeholder="Enter any additional notes"
          />
          {requestId && (
            <Select
              control={control}
              name="status"
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'requested', label: 'Requested' },
                { value: 'waiting_result', label: 'Waiting Result' },
                { value: 'result_received', label: 'Result Received' },
                { value: 'reviewed', label: 'Reviewed' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          )}
          <MultiAutocomplete
            control={control}
            name="diagnostic_test_ids"
            label="Diagnostic Tests"
            options={diagnosisTests}
            rules={{ required: 'Please select at least one test' }}
            renderOption={(props: any, option: any, { selected }: any) => {
              const { key, ...optionProps } = props as any;
              const SelectionIcon = selected ? SquareCheckBig : Square;
              const test = option as IDiagnosticTestAutocomplete;

              return (
                <li key={key} {...optionProps}>
                  <SelectionIcon
                    fontSize="small"
                    style={{
                      marginRight: 8,
                      padding: 9,
                      boxSizing: 'content-box',
                    }}
                  />
                  {test.label} ${test.price.toFixed(2)}
                </li>
              );
            }}
            getOptionLabel={(option: IDiagnosticTestAutocomplete) => {
              return `${option.label} $${option.price.toFixed(2)}`;
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Total: ${totalFee.toFixed(2)}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} type="button" variant="outlined">
          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={onSubmit}
          disabled={isProcessing}
        >
          {requestId ? 'Update Request' : 'Submit Request'}
        </Button>
      </DialogActions>
    </>
  );
};
export default ParaClinicForm;
