import {
  useForm,
  useFieldArray,
  type Control,
  type UseFormRegister,
} from 'react-hook-form';
import type { FormDataConvertible } from '@inertiajs/core';
import Input from '@/components/form/input-deprecated';
import Textarea from '@/components/form/textarea';
import {
  IVaccine,
  IVaccineFormData,
  IVaccineRule,
} from '@/interfaces/IVaccine';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { Plus, Trash2 } from 'lucide-react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface VaccineFormProps {
  vaccine?: IVaccine;
  onClose: () => void;
}

const defaultRule: IVaccineRule = {
  min_age_months: 0,
  max_age_months: null,
  doses: [{ dose_number: 1, interval_days: 0 }],
};

const VaccineForm = ({ vaccine, onClose }: VaccineFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit, register } = useForm<IVaccineFormData>({
    defaultValues: vaccine ?? {
      name: '',
      description: '',
      rules: [defaultRule],
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: 'rules',
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const payload = {
      name: data.name,
      description: data.description ?? '',
      rules: data.rules,
    };

    if (vaccine) {
      router.put(
        `/vaccines/${vaccine.id}`,
        payload as unknown as Record<string, FormDataConvertible>,
        {
          onSuccess: () => {
            onClose();
            toast('Vaccine updated successfully!', {
              variant: 'success',
              description: 'The vaccine has been updated.',
            });
          },
          onFinish: () => setIsProcessing(false),
        },
      );
      return;
    }

    router.post(
      '/vaccines',
      payload as unknown as Record<string, FormDataConvertible>,
      {
        onSuccess: () => {
          onClose();
          toast('Vaccine created successfully!', {
            variant: 'success',
            description: 'The vaccine has been created.',
          });
        },
        onError: (errors) => {
          if (errors.name) {
            toast('Unable to create vaccine', {
              variant: 'error',
              description: errors.name,
            });
          }
        },
        onFinish: () => setIsProcessing(false),
      },
    );
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ borderTop: 1, borderColor: 'divider' }}
      noValidate
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Input
          label="Name"
          control={control}
          placeholder="Enter vaccine name"
          name="name"
          rules={{ required: 'This field is required' }}
        />
        <Textarea label="Description" control={control} name="description" />
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction="row"
            sx={{
              mb: 1.5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="subtitle2">
              Age Rules &amp; Dose Schedule
            </Typography>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() => appendRule(defaultRule)}
              startIcon={<Plus size={16} />}
            >
              Add Age Rule
            </Button>
          </Stack>
          <Stack spacing={2}>
            {ruleFields.map((ruleField, ruleIndex) => (
              <RuleBlock
                key={ruleField.id}
                control={control}
                register={register}
                ruleIndex={ruleIndex}
                onRemove={() => removeRule(ruleIndex)}
                canRemove={ruleFields.length > 1}
              />
            ))}
          </Stack>
        </Paper>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'flex-end',
        }}
      >
        <Button type="button" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing} variant="contained">
          {vaccine ? 'Save' : 'Create'}
        </Button>
      </Stack>
    </Box>
  );
};

interface RuleBlockProps {
  control: Control<IVaccineFormData>;
  register: UseFormRegister<IVaccineFormData>;
  ruleIndex: number;
  onRemove: () => void;
  canRemove: boolean;
}

const RuleBlock = ({
  control,
  register,
  ruleIndex,
  onRemove,
  canRemove,
}: RuleBlockProps) => {
  const {
    fields: doseFields,
    append: appendDose,
    remove: removeDose,
  } = useFieldArray({
    control,
    name: `rules.${ruleIndex}.doses` as const,
  });

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
      <Stack
        direction="row"
        sx={{ mb: 1.5, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="subtitle2">Age Rule #{ruleIndex + 1}</Typography>
        {canRemove && (
          <Button
            type="button"
            color="error"
            size="small"
            startIcon={<Trash2 size={14} />}
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Min Age (months)"
          type="number"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          {...register(`rules.${ruleIndex}.min_age_months`, {
            required: 'Required',
            valueAsNumber: true,
          })}
        />
        <TextField
          label="Max Age (months) — leave empty for no limit"
          type="number"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          {...register(`rules.${ruleIndex}.max_age_months`, {
            setValueAs: (value) =>
              value === '' || value === null ? null : Number(value),
          })}
        />
      </Stack>

      <Stack>
        <Stack
          direction="row"
          sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="overline">Doses</Typography>
          <Button
            type="button"
            size="small"
            startIcon={<Plus size={12} />}
            onClick={() =>
              appendDose({
                dose_number: doseFields.length + 1,
                interval_days: 0,
              })
            }
          >
            Add Dose
          </Button>
        </Stack>
        <Stack spacing={1}>
          {doseFields.map((doseField, doseIndex) => (
            <Stack
              key={doseField.id}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              <Typography variant="body2" sx={{ minWidth: 24 }}>
                #{doseIndex + 1}
              </Typography>
              <input
                type="hidden"
                {...register(
                  `rules.${ruleIndex}.doses.${doseIndex}.dose_number`,
                  { valueAsNumber: true },
                )}
              />
              <TextField
                label="Interval (days)"
                type="number"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                {...register(
                  `rules.${ruleIndex}.doses.${doseIndex}.interval_days`,
                  { required: 'Required', valueAsNumber: true },
                )}
              />
              <TextField
                label="Due (approx)"
                size="small"
                fullWidth
                value={
                  doseIndex === 0
                    ? 'Birth'
                    : `Day ${doseFields[doseIndex]?.interval_days ?? 0}`
                }
                slotProps={{ input: { readOnly: true } }}
              />
              {doseFields.length > 1 && (
                <IconButton
                  type="button"
                  color="error"
                  size="small"
                  onClick={() => removeDose(doseIndex)}
                  aria-label="Remove dose"
                >
                  <Trash2 size={14} />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default VaccineForm;
