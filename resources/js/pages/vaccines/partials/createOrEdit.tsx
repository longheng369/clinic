import { useForm, useFieldArray } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import type { FormDataConvertible } from '@inertiajs/core';
import Input from '@/components/form/input-deprecated';
import Textarea from '@/components/form/textarea';
import { IVaccine, IVaccineDoseRuleFormData, IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { Plus } from 'lucide-react';
import {
  Box,
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

const toOptionalNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const buildIntervalPayload = (dose: IVaccineDoseRuleFormData) => {
  const interval = toOptionalNumber(dose.interval_from_previous_dose);
  const unit = dose.interval_from_previous_dose_unit;

  return {
    ...(interval !== null ? { interval_from_previous_dose: interval } : {}),
    ...(unit ? { interval_from_previous_dose_unit: unit } : {}),
  };
};

const VaccineForm = ({ vaccine, units, onClose }: VaccineFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ageRulesError, setAgeRulesError] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<IVaccineFormData>({
    defaultValues: vaccine
      ? { ...vaccine }
      : {
          name: '',
          description: '',
          age_rules: [],
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

  const applyServerErrors = (errors: Record<string, string>, title: string) => {
    let firstMessage: string | null = null;

    Object.entries(errors).forEach(([field, message]) => {
      if (firstMessage === null) {
        firstMessage = message;
      }

      if (field === 'age_rules') {
        setAgeRulesError(message);
        return;
      }

      setError(field as Path<IVaccineFormData>, { type: 'server', message });
    });

    if (firstMessage !== null) {
      toast(title, {
        variant: 'error',
        description: firstMessage,
      });
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (!data.age_rules || data.age_rules.length === 0) {
      setAgeRulesError('Add at least one age rule');
      return;
    }

    setAgeRulesError(null);
    setIsProcessing(true);

    const payload = {
      name: data.name,
      description: data.description ?? '',
      age_rules: data.age_rules.map((rule) => ({
        ...(rule.id && { id: rule.id }),
        min_age: Number(rule.min_age),
        min_age_unit: rule.min_age_unit,
        max_age: toOptionalNumber(rule.max_age),
        max_age_unit: rule.max_age_unit,
        dose_rules: rule.dose_rules.map((dose) => ({
          amount: Number(dose.amount),
          amount_unit_id: Number(dose.amount_unit_id),
          ...buildIntervalPayload(dose),
        })),
      })),
    };

    const options = {
      onSuccess: () => {
        onClose();
      },
      onError: (errors: Record<string, string>) => {
        applyServerErrors(
          errors,
          vaccine ? 'Unable to update vaccine' : 'Unable to create vaccine',
        );
      },
      onFinish: () => setIsProcessing(false),
    };

    if (vaccine) {
      router.put(
        `/vaccines/${vaccine.id}`,
        payload as unknown as Record<string, FormDataConvertible>,
        options,
      );
      return;
    }

    router.post(
      '/vaccines',
      payload as unknown as Record<string, FormDataConvertible>,
      options,
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
          rules={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: 255,
              message: 'Name must be at most 255 characters',
            },
          }}
        />
        <Textarea
          label="Description"
          control={control}
          name="description"
          rules={{
            maxLength: {
              value: 2000,
              message: 'Description must be at most 2000 characters',
            },
          }}
        />

        <Box>
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
              sx={{
                borderRadius: 0
              }}
              onClick={() => {
                appendRule({
                  min_age: 0,
                  min_age_unit: 'day',
                  max_age: null,
                  max_age_unit: 'day',
                  dose_rules: [
                    {
                      amount: 0,
                      amount_unit_id: 1,
                    },
                  ],
                });
                setAgeRulesError(null);
              }}
              startIcon={<Plus size={16} />}
            >
              Add Age Rule
            </Button>
          </Stack>
          {ruleFields.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>
              No age rules yet
            </Typography>
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
        </Box>
        {ageRulesError && (
          <Typography sx={{ color: 'error.main', fontSize: 14 }}>
            {ageRulesError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isProcessing || !isDirty}
          variant="contained"
        >
          {vaccine ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </>
  );
};

export default VaccineForm;
