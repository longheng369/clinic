import { useForm, useFieldArray } from 'react-hook-form';
import Input from '@/components/form/input';
import ServerAutocomplete from '@/components/form/serverAutocomplete';
import Textarea from '@/components/form/textarea';
import {
  IParaClinicRequest,
  IParaClinicRequestFormData,
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
} from '@mui/material';
import { useToast } from '@/components/toast';
import { Plus, X } from 'lucide-react';
import DatePicker from '@/components/form/date';

const PRIORITY_OPTIONS = ['Routine', 'Urgent', 'STAT'].map((value) => ({
  value,
  label: value,
}));

type Props = {
  request?: IParaClinicRequest;
  patientId: number;
  visitId?: number | null;
}

const ParaClinicForm = ({ request, patientId, visitId }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [testPrices, setTestPrices] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const handleTestSelect = (option: IOption<any>) => {
    if (option.value && option.price != null) {
      setTestPrices((prev) => ({ ...prev, [option.value]: option.price }));
    }
  };

  const defaultTests = request?.tests?.length
    ? request.tests.map((t) => ({
        diagnostic_test_id: t.diagnostic_test_id ?? null,
        priority: t.priority,
        instruction: t.instruction,
      }))
    : [
        {
          diagnostic_test_id: null,
          priority: 'Routine',
          instruction: null,
        },
      ];

  const { control, handleSubmit, watch, setValue } =
    useForm<IParaClinicRequestFormData>({
      defaultValues: request
        ? {
            patient_id: request.patient?.id ?? null,
            visit_id: request.visit_id,
            external_facility_name: request.external_facility_name ?? '',
            request_date: request.request_date,
            clinical_reason: request.clinical_reason,
            provisional_diagnosis: request.provisional_diagnosis,
            notes: request.notes,
            fee: request.fee,
            payment_status: request.payment_status,
            payment_date: request.payment_date,
            tests: defaultTests,
          }
        : {
            patient_id: patientId,
            visit_id: visitId ?? null,
            external_facility_name: '',
            request_date: dayjs().format('DD-MM-YYYY'),
            clinical_reason: '',
            provisional_diagnosis: '',
            notes: '',
            fee: 0,
            payment_status: 'Unpaid',
            payment_date: null,
            tests: defaultTests,
          },
    });

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

  const submitData = (
    data: IParaClinicRequestFormData,
    extra: Record<string, string> = {},
  ) => ({
    ...data,
    ...extra,
    tests: data.tests.map(({ diagnostic_test_id, priority, instruction }) => ({
      diagnostic_test_id,
      priority,
      instruction,
    })),
  });

  const save = (status?: string) =>
    handleSubmit((data) => {
      setIsProcessing(true);
      const payload = submitData(data, status ? { status } : {});
      const options = {
        onSuccess: () => {
          toast(
            `Request ${status === 'Requested' ? 'submitted' : request ? 'updated' : 'created'} successfully!`,
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

  return (
    <Box
      component="form"
      onSubmit={save(request ? undefined : 'Draft')}
      noValidate
    >
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              General Information
            </Typography>
          </Grid>
          <Grid size={{ md: 12 }}>
            <DatePicker
              control={control}
              name="request_date"
              label="Request Date"
              rules={{ required: 'Request date is required' }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              label="Diagnosis"
              control={control}
              name="provisional_diagnosis"
              placeholder="Enter diagnosis"
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              label="Clinical Reason"
              control={control}
              name="clinical_reason"
              placeholder="Enter clinical reason"
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              label="Notes"
              control={control}
              name="notes"
              placeholder="Enter any additional notes"
            />
          </Grid>
          <Grid size={{ md: 12 }}>
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
                  append({
                    diagnostic_test_id: null,
                    priority: 'Routine',
                    instruction: null,
                  })
                }
                variant="contained"
                startIcon={<Plus size={14} />}
              >
                Add Test
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ md: 12 }}>
            <Stack spacing={2}>
              <Stack spacing={1.5}>
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
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ md: 12 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Billing
            </Typography>
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label={`Fee ($) — Auto: $${totalFee.toFixed(2)}`}
              control={control}
              type="number"
              slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
              name="fee"
              placeholder="0.00"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          color="secondary"
          disabled={isProcessing}
          variant="contained"
        >
          {request ? 'Update' : 'Save Draft'}
        </Button>
        {!request && (
          <Button
            type="button"
            variant="contained"
            onClick={save('Requested')}
            disabled={isProcessing}
          >
            Submit Request
          </Button>
        )}
      </DialogActions>
    </Box>
  );
};
export default ParaClinicForm;
