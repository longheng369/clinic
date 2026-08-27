import { useForm, useFieldArray } from 'react-hook-form';
import Input from '@/components/form/input-deprecated';
import Select from '@/components/form/select-deprecated';
import ServerAutocomplete from '@/components/form/serverAutocomplete';
import Textarea from '@/components/form/textarea';
import {
  IParaClinicRequest,
  IParaClinicRequestFormData,
  IParaClinicRequestTest,
} from '@/interfaces/IParaClinicRequest';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import { useToast } from '@/components/toast';
import { Plus, X } from 'lucide-react';
import DatePicker from '@/components/form/date';
const TEST_CATEGORIES = [
  'Laboratory',
  'Cardiology',
  'Imaging',
  'Pathology',
  'Other',
].map((value) => ({ value, label: value }));
const TEST_NAMES: Record<string, { value: string; label: string }[]> =
  Object.fromEntries(
    Object.entries({
      Laboratory: [
        'CBC',
        'Blood Sugar',
        'Lipid Profile',
        'Liver Function',
        'Renal Function',
        'Urinalysis',
      ],
      Cardiology: ['ECG', 'Echocardiogram', 'Stress Test', 'Holter Monitor'],
      Imaging: [
        'Chest X-Ray',
        'Abdominal X-Ray',
        'Ultrasound',
        'CT Scan',
        'MRI',
        'Mammography',
      ],
      Pathology: ['Biopsy', 'Histopathology', 'Cytology'],
      Other: ['Other'],
    }).map(([key, values]) => [
      key,
      values.map((value) => ({ value, label: value })),
    ]),
  );
const PRIORITY_OPTIONS = ['Routine', 'Urgent', 'STAT'].map((value) => ({
  value,
  label: value,
}));
interface ParaClinicFormProps {
  request?: IParaClinicRequest;
  authUser: { id: number; name: string };
  preselectedPatient?: {
    id: number;
    khmer_first_name: string;
    khmer_last_name: string;
  } | null;
  onClose: () => void;
}
const ParaClinicForm = ({
  request,
  authUser,
  preselectedPatient,
  onClose,
}: ParaClinicFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const defaultTests: IParaClinicRequestTest[] = request?.tests?.length
    ? request.tests.map((t) => ({
      test_category: t.test_category,
      test_name: t.test_name,
      priority: t.priority,
      instruction: t.instruction,
    }))
    : [
      {
        test_category: 'Laboratory',
        test_name: 'CBC',
        priority: 'Routine',
        instruction: null,
      },
    ];
  const { control, handleSubmit, watch, setValue } =
    useForm<IParaClinicRequestFormData>({
      defaultValues: request
        ? {
          patient_id: request.patient?.id ?? null,
          doctor_id: request.doctor?.id ?? null,
          visit_id: request.visit_id,
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
          patient_id: preselectedPatient?.id ?? null,
          doctor_id: authUser.id,
          visit_id: null,
          request_date: new Date().toISOString().split('T')[0],
          clinical_reason: '',
          provisional_diagnosis: '',
          notes: '',
          fee: null,
          payment_status: 'Unpaid',
          payment_date: null,
          tests: defaultTests,
        },
    });
  const { fields, append, remove } = useFieldArray({ control, name: 'tests' });

  const submitData = (
    data: IParaClinicRequestFormData,
    extra: Record<string, string> = {},
  ) => ({
    ...data,
    ...extra,
    tests: data.tests.map(
      ({ test_category, test_name, priority, instruction }) => ({
        test_category,
        test_name,
        priority,
        instruction,
      }),
    ),
  });

  const save = (status?: string) =>
    handleSubmit((data) => {
      setIsProcessing(true);
      const payload = submitData(data, status ? { status } : {});
      const options = {
        onSuccess: () => {
          onClose();
          toast(
            `Request ${status === 'Requested' ? 'submitted' : request ? 'updated' : 'created'} successfully!`,
            { variant: 'success' },
          );
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
            <DatePicker control={control} name="request_date" />
          </Grid>
          <Grid size={{ md: 12 }}>
            <ServerAutocomplete
              label="Patient"
              control={control}
              name="patient_id"
              rules={{ required: 'Patient is required' }}
              model="Patient"
              placeholder="Search patient by name..."
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              label="Provisional Diagnosis"
              control={control}
              name="provisional_diagnosis"
              placeholder="Enter provisional diagnosis"
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
                    test_category: 'Laboratory',
                    test_name: 'CBC',
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
                  const availableTests =
                    TEST_NAMES[watch(`tests.${index}.test_category`)] ??
                    TEST_NAMES.Other;
                  return (
                    <Stack
                      key={field.id}
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1.5}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        sx={{ flex: 1, width: '100%' }}
                      >
                        <Select
                          label="Category"
                          control={control}
                          name={`tests.${index}.test_category` as any}
                          options={TEST_CATEGORIES}
                          rules={{ required: 'Required' }}
                        />
                        <Select
                          label="Test Name"
                          control={control}
                          name={`tests.${index}.test_name` as any}
                          options={availableTests}
                          rules={{ required: 'Required' }}
                        />
                        <Select
                          label="Priority"
                          control={control}
                          name={`tests.${index}.priority` as any}
                          options={PRIORITY_OPTIONS}
                          rules={{ required: 'Required' }}
                        />
                        <Input
                          label="Instruction"
                          control={control}
                          name={`tests.${index}.instruction` as any}
                          placeholder="Optional"
                        />
                      </Stack>
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
              label="Fee ($)"
              control={control}
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              name="fee"
              placeholder="0.00"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outlined">
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
