import { useForm, useFieldArray } from 'react-hook-form';
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
  Button, DialogActions, DialogContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AgeRule from "@/pages/vaccines/partials/ageRule";

interface VaccineFormProps {
  vaccine?: IVaccine;
  units: IUnit[];
  onClose: () => void;
}

const VaccineForm = ({ vaccine, units, onClose }: VaccineFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<IVaccineFormData>({
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
    <>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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
              variant="contained"
              size="small"
              color="info"
              onClick={() =>
                appendRule({
                  min_age: 0,
                  min_age_unit: 'day',
                  max_age: null,
                  max_age_unit: 'day',
                  dose_rules: [{
                    amount: 0,
                    amount_unit_id: 1
                  }],
                })
              }
              startIcon={<Plus size={16} />}
            >
              Add Age Rule
            </Button>
          </Stack>
          {ruleFields.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>No age rules yet</Typography>
          ) : (
            <Stack spacing={2}>
              {ruleFields.map((ruleField, ageRuleIndex) => (
                <AgeRule
                  key={ruleField.id}
                  control={control}
                  ageRuleIndex={ageRuleIndex}
                  onRemove={() => removeRule(ageRuleIndex)}
                  units={units}
                />
              ))}
            </Stack>
          )}
        </Paper>
        <Typography>Note: Leave max age empty for the unlimit</Typography>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isProcessing} variant="contained">
          {vaccine ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </>
  );
};

export default VaccineForm;
