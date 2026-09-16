import { useForm, useFieldArray } from 'react-hook-form';
import Input from '@/components/form/input';
import ServerAutocomplete from '@/components/form/serverAutocomplete';
import Textarea from '@/components/form/textarea';
import {
  IParaClinicRequest,
  IParaClinicRequestFormData,
  IParaClinicRequestTest,
} from '@/interfaces/IParaClinicRequest';
import { IOption } from '@/interfaces/IOption';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useToast } from '@/components/toast';
import { Plus, X } from 'lucide-react';
import DateTimeField from '@/components/form/dateTime';
import { useModal } from '@/components/modal';

const EMPTY_TEST = { diagnostic_test_id: null };

type Props = {
  request?: IParaClinicRequest;
  patientId: number;
  visitId?: number | null;
}

const ParaClinicForm = ({ request, patientId, visitId }: Props) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(!!request);
  const [testPrices, setTestPrices] = useState<Record<number, number>>({});
  const [testOptions, setTestOptions] = useState<
    Record<number, IOption<number>>
  >({});
  const { toast } = useToast();

  const handleTestSelect = (option: IOption<any>) => {
    if (option.value && option.price != null) {
      setTestPrices((prev) => ({ ...prev, [option.value]: Number(option.price) }));
    }
  };

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<IParaClinicRequestFormData>({
      defaultValues: {
        patient_id: patientId,
        visit_id: visitId ?? null,
        request_date: dayjs().format('DD-MM-YYYY HH:mm'),
        clinical_reason: '',
        provisional_diagnosis: '',
        notes: '',
        fee: 0,
        payment_status: 'unpaid',
        payment_date: null,
        tests: [EMPTY_TEST],
      },
    });

  // The grid row is a summary: it carries no tests, patient or visit. Load the
  // full record so editing pre-fills instead of silently dropping them.
  useEffect(() => {
    if (!request) {
      return;
    }

    const controller = new AbortController();

    fetch(`/para-clinic-requests/${request.id}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((data: IParaClinicRequest) => {
        const savedTests = data.tests.filter(
          (test): test is IParaClinicRequestTest & { diagnostic_test_id: number } =>
            test.diagnostic_test_id != null,
        );

        setTestPrices(
          Object.fromEntries(
            savedTests.map((test) => [
              test.diagnostic_test_id,
              Number(test.price ?? 0),
            ]),
          ),
        );
        setTestOptions(
          Object.fromEntries(
            savedTests.map((test) => [
              test.diagnostic_test_id,
              { value: test.diagnostic_test_id, label: test.test_name },
            ]),
          ),
        );

        reset({
          patient_id: data.patient_id ?? patientId,
          visit_id: data.visit_id,
          request_date: data.request_date,
          clinical_reason: data.clinical_reason,
          provisional_diagnosis: data.provisional_diagnosis,
          notes: data.notes,
          fee: data.fee,
          payment_status: data.payment_status,
          payment_date: data.payment_date,
          tests: savedTests.length
            ? savedTests.map((test) => ({
              diagnostic_test_id: test.diagnostic_test_id,
            }))
            : [EMPTY_TEST],
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
  }, [request?.id]);

  const { fields, append, remove } = useFieldArray({ control, name: 'tests' });
  const testsValues = watch('tests');
  const feeValue = watch('fee');
  const selectedTestIds = testsValues
    .map((t) => t.diagnostic_test_id)
    .filter((id): id is number => id != null);
  const totalFee = testsValues.reduce((sum, t) => {
    const price = t.diagnostic_test_id ? testPrices[t.diagnostic_test_id] ?? 0 : 0;
    return sum + price;
  }, 0);

  useEffect(() => {
    setValue('fee', totalFee);
  }, [totalFee, setValue]);

  const onSubmit = handleSubmit((data) => {
      const payload = {
        ...data,
        tests: data.tests.map((t) => t.diagnostic_test_id),
      };

      setIsProcessing(true);

      const options = {
        onSuccess: () => {
          closeModal();
          toast(
            `Request ${request ? 'updated' : 'created'} successfully!`,
            { variant: 'success' },
          );
          router.reload({ only: ['paraClinicRequests'] });
        },
        onError: (errors: Record<string, string | string[]>) => {
          const msg = Object.values(errors).flat().join(', ');
          toast(msg || 'Failed to save request.', { variant: 'error' });
        },
        onFinish: () => setIsProcessing(false),
      };

      if (request)
        router.put(`/para-clinic-requests/${request.id}`, payload, options);
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
          <Input
            label="Diagnosis"
            control={control}
            name="provisional_diagnosis"
            placeholder="Enter diagnosis"
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
          <Stack
            direction="row"
            sx={{
              mb: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Diagnostic Tests
            </Typography>
            <Button
              type="button"
              size="small"
              onClick={() =>
                append(EMPTY_TEST)
              }
              variant="contained"
              startIcon={<Plus size={14} />}
            >
              Add Test
            </Button>
          </Stack>
          {fields.map((field, index) => {
            return (
              <Stack
                key={field.id}
                direction="row"
                spacing={1.5}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  alignItems: 'center',
                }}
              >
                <ServerAutocomplete
                  label="Diagnostic Test"
                  control={control}
                  name={`tests.${index}.diagnostic_test_id` as any}
                  model="DiagnosticTest"
                  initialOption={
                    testOptions[testsValues[index]?.diagnostic_test_id ?? -1]
                  }
                  rules={{ required: 'Required' }}
                  placeholder="Search test by name..."
                  onSelect={handleTestSelect}
                  excludeValues={selectedTestIds.filter(
                    (id) => id !== testsValues[index]?.diagnostic_test_id,
                  )}
                />
                <Box
                  sx={{
                    minWidth: 90,
                    pt: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {(() => {
                      const testId = testsValues[index]?.diagnostic_test_id;
                      return testId && testPrices[testId]
                        ? `$${testPrices[testId].toFixed(2)}`
                        : '-';
                    })()}
                  </Typography>
                </Box>
                {fields.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    aria-label="Remove test"
                  >
                    <X size={16} />
                  </IconButton>
                )}
              </Stack>
            );
          })}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Billing
          </Typography>
          <Input
            label={`Fee ($) — Auto: $${totalFee.toFixed(2)}`}
            control={control}
            type="number"
            slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
            name="fee"
            placeholder="0.00"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} type="button" variant="outlined">
          Cancel
        </Button>
        {!request && (
          <Button
            type="button"
            variant="contained"
            onClick={onSubmit}
            disabled={isProcessing}
          >
            Submit Request
          </Button>
        )}
      </DialogActions>
    </>
  );
};
export default ParaClinicForm;
