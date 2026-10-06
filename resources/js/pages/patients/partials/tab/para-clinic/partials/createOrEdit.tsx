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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
  }, [get]);

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
          toast(t('patients.paraClinic.loadFailed'), { variant: 'error' });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [requestId, patientId, reset, toast]);

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
        router.reload({ only: ['paraClinicRequests'] });
      },
      onError: (errors: Record<string, string | string[]>) => {
        const msg = Object.values(errors).flat().join(', ');
        toast(msg || t('patients.paraClinic.saveFailed'), { variant: 'error' });
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
            {t('patients.shared.form.generalInformation')}
          </Typography>
          <DateTimeField
            control={control}
            name="request_date"
            label={t('patients.paraClinic.requestDateTime')}
            rules={{ required: t('patients.paraClinic.requestDateRequired') }}
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
                label={t('patients.shared.form.diagnosis')}
                placeholder={t('patients.shared.form.enterDiagnosis')}
                variant="standard"
                fullWidth
              />
            )}
          />
          <Textarea
            label={t('patients.paraClinic.clinicalReason')}
            control={control}
            name="clinical_reason"
            placeholder={t('patients.paraClinic.enterClinicalReason')}
          />
          <Textarea
            label={t('patients.shared.form.notes')}
            control={control}
            name="notes"
            placeholder={t('patients.paraClinic.enterNotes')}
          />
          {requestId && (
            <Select
              control={control}
              name="status"
              label={t('patients.paraClinic.statusLabel')}
              options={[
                { value: 'draft', label: t('patients.paraClinic.status.draft') },
                { value: 'requested', label: t('patients.paraClinic.status.requested') },
                { value: 'waiting_result', label: t('patients.paraClinic.status.waitingResult') },
                { value: 'result_received', label: t('patients.paraClinic.status.resultReceived') },
                { value: 'reviewed', label: t('patients.paraClinic.status.reviewed') },
                { value: 'completed', label: t('patients.shared.status.completed') },
                { value: 'cancelled', label: t('patients.shared.status.cancelled') },
              ]}
            />
          )}
          <MultiAutocomplete
            control={control}
            name="diagnostic_test_ids"
            label={t('patients.paraClinic.diagnosticTests')}
            options={diagnosisTests}
            rules={{ required: t('patients.paraClinic.selectTest') }}
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
            {t('patients.shared.form.total', { amount: totalFee.toFixed(2) })}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} type="button" variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={onSubmit}
          disabled={isProcessing}
        >
          {requestId ? t('patients.paraClinic.update') : t('patients.paraClinic.submit')}
        </Button>
      </DialogActions>
    </>
  );
};
export default ParaClinicForm;
