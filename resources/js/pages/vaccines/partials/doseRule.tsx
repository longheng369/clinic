import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ValueWithUnit from './valueWithUnit';
import { Control, useFieldArray } from 'react-hook-form';
import { Plus, Trash } from 'lucide-react';
import { IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { useTranslation } from 'react-i18next';

type Props = {
  control: Control<IVaccineFormData>;
  ageRuleIndex: number;
  units: IUnit[];
}

const DoseRule = ({ control, ageRuleIndex, units }: Props) => {
  const { t } = useTranslation();
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `age_rules.${ageRuleIndex}.dose_rules`,
  });

  const handleAppend = () => {
    append({
      amount: 0,
      amount_unit_id: 1,
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 'medium' }}>{t('vaccines.doses')}</Typography>
        <Button
          onClick={handleAppend}
          startIcon={<Plus size={16}/>}
          variant='contained'
          color='secondary'
          size='small'
          sx={{ borderRadius: 0 }}
        >
          {t('vaccines.newDose')}
        </Button>
      </Box>
      <Stack spacing={1}>
        {fields.map((field, doseRuleIndex) => (
          <DoseRow
            key={field.id}
            control={control}
            ageRuleIndex={ageRuleIndex}
            doseRuleIndex={doseRuleIndex}
            units={units}
            onRemove={() => remove(doseRuleIndex)}
          />
        ))}
      </Stack>
    </Box>
  );
}

type DoseRowProps = {
  ageRuleIndex: number;
  doseRuleIndex: number;
  control: Control<IVaccineFormData>;
  onRemove: () => void;
  units: IUnit[];
}

const DoseRow = ({ control, doseRuleIndex, ageRuleIndex, onRemove, units }: DoseRowProps) => {
  const { t } = useTranslation();

  const validateAmount = (value: unknown): true | string => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return t('vaccines.mustBeNumber', { label: t('vaccines.amount') });
    if (amount <= 0) return t('vaccines.amountGreaterThanZero');
    return true;
  };

  const validateInterval = (value: unknown): true | string => {
    const interval = Number(value);
    if (!Number.isFinite(interval)) return t('vaccines.mustBeNumber', { label: t('vaccines.interval') });
    if (interval < 0) return t('vaccines.cannotBeNegative', { label: t('vaccines.interval') });
    if (!Number.isInteger(interval)) return t('vaccines.mustBeWholeNumber', { label: t('vaccines.interval') });
    return true;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 1, borderColor: 'divider', p: 1 }}>
      <Typography>{t('vaccines.doseRow', { number: doseRuleIndex + 1 })}</Typography>
      {doseRuleIndex > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{t('vaccines.interval')}</Typography>
          <ValueWithUnit
            control={control}
            name={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.interval_from_previous_dose`}
            selectionName={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.interval_from_previous_dose_unit`}
            rules={{
              required: t('vaccines.intervalRequired'),
              validate: {
                nonNegative: validateInterval,
              },
            }}
            selectionRules={{ required: t('common.selectUnit') }}
          />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>{t('vaccines.amount')}</Typography>
        <ValueWithUnit
          control={control}
          name={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.amount`}
          selectionName={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.amount_unit_id`}
          selectionOptions={units.map((u) => ({ label: u.name, value: u.id }))}
          rules={{
            required: t('vaccines.amountRequired'),
            validate: {
              positive: validateAmount,
            },
          }}
          selectionRules={{ required: t('common.selectUnit') }}
        />
        <IconButton onClick={onRemove} color='error'>
          <Trash size={16} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default DoseRule
