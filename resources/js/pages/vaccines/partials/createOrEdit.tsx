import {
  useForm,
  useFieldArray,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from 'react-hook-form';
import type { FormDataConvertible } from '@inertiajs/core';
import Input from '@/components/form/input-deprecated';
import Textarea from '@/components/form/textarea';
import { IVaccine, IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { Plus } from 'lucide-react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ValueWithUnit from './valueWithUnit';
import DoseRule from './doseRule';

interface VaccineFormProps {
  vaccine?: IVaccine;
  units: IUnit[];
  onClose: () => void;
}

const VaccineForm = ({ vaccine, units, onClose }: VaccineFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit, register, watch } = useForm<IVaccineFormData>({
    defaultValues: vaccine
      ? { ...vaccine }
      : {
        name: '',
        description: '',
      },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: 'age_rules',
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    const payload = {
      name: data.name,
      description: data.description ?? '',
      age_rules: data.age_rules.map((rule) => ({
        ...(rule.id && { id: rule.id }),
        min_age: rule.min_age,
        min_age_unit: rule.min_age_unit,
        max_age: rule.max_age,
        max_age_unit: rule.max_age_unit,
        dose_rules: rule.dose_rules,
      })),
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
            <Typography variant="subtitle2">Dose Rules</Typography>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() =>
                appendRule({
                  min_age: 0,
                  min_age_unit: 'day',
                  max_age: null,
                  max_age_unit: 'day',
                  dose_rules: []
                })
              }
              startIcon={<Plus size={16} />}
            >
              Add Age Rule
            </Button>
          </Stack>
          <Stack spacing={2}>
            {ruleFields.map((ruleField, ageRuleIndex) => (
              <RuleBlock
                key={ruleField.id}
                control={control}
                register={register}
                ageRuleIndex={ageRuleIndex}
                watch={watch}
                onRemove={() => removeRule(ageRuleIndex)}
                canRemove={ruleFields.length > 1}
                units={units}
              />
            ))}
          </Stack>
        </Paper>
        <Typography>Note: Leave max age empty for the unlimit</Typography>
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
  ageRuleIndex: number;
  watch: UseFormWatch<IVaccineFormData>;
  onRemove: () => void;
  canRemove: boolean;
  units: IUnit[];
}

const RuleBlock = ({
  control,
  units,
  ageRuleIndex,
}: RuleBlockProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
      <Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 'bold' }}>Rule #{ageRuleIndex + 1}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Min Age</Typography>
              <ValueWithUnit control={control} name={`age_rules.${ageRuleIndex}.min_age`} selectionName={`age_rules.${ageRuleIndex}.min_age_unit`} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Max Age</Typography>
              <ValueWithUnit control={control} name={`age_rules.${ageRuleIndex}.max_age`} selectionName={`age_rules.${ageRuleIndex}.max_age_unit`} />
            </Box>
          </Box>
        </Box>
        <DoseRule control={control} ageRuleIndex={ageRuleIndex} units={units} />
      </Stack>
    </Paper>
  );
};

export default VaccineForm;
