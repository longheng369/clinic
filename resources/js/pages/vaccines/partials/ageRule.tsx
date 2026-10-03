import { Box, Stack, Typography, IconButton } from '@mui/material';
import ValueWithUnit from '@/pages/vaccines/partials/valueWithUnit';
import DoseRule from '@/pages/vaccines/partials/doseRule';
import type { Control } from 'react-hook-form';
import { IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { MoveRight, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  control: Control<IVaccineFormData>;
  ageRuleIndex: number;
  onRemove: () => void;
  units: IUnit[];
};

const AGE_UNIT_DAYS: Record<string, number> = { day: 1, month: 30, year: 365 };

const toDays = (value: number | string, unit: string | null | undefined): number =>
  Number(value) * (AGE_UNIT_DAYS[unit ?? 'day'] ?? 1);

const AgeRule = ({
  control,
  ageRuleIndex,
  onRemove,
  units,
}: Props) => {
  const { t } = useTranslation();

  const validateWholeNumber = (label: string) => (value: unknown): true | string => {
    const number = Number(value);
    if (!Number.isFinite(number)) return t('vaccines.mustBeNumber', { label });
    if (number < 0) return t('vaccines.cannotBeNegative', { label });
    if (!Number.isInteger(number)) return t('vaccines.mustBeWholeNumber', { label });
    return true;
  };

  const validateMaxAge = (
    maxAgeValue: unknown,
    formValues: IVaccineFormData,
  ): true | string => {
    const raw = maxAgeValue as number | string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return true;

    const max = Number(raw);
    if (!Number.isFinite(max)) return t('vaccines.mustBeNumber', { label: t('vaccines.maxAge') });
    if (max < 0) return t('vaccines.cannotBeNegative', { label: t('vaccines.maxAge') });
    if (!Number.isInteger(max)) return t('vaccines.mustBeWholeNumber', { label: t('vaccines.maxAge') });

    const rule = formValues.age_rules?.[ageRuleIndex];
    if (!rule) return true;
    if (!rule.max_age_unit) return t('vaccines.selectUnitMaxAge');

    const min = rule.min_age as number | string | null | undefined;
    if (min === null || min === undefined || min === '') return true;

    if (toDays(max, rule.max_age_unit) < toDays(min, rule.min_age_unit)) {
      return t('vaccines.maxAgeGteMinAge');
    }

    return true;
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          bgcolor: 'primary.main',
        }}
      >
        <Typography sx={{ fontWeight: '600', color: 'white' }}>
          {t('vaccines.ageRuleHeader', { index: ageRuleIndex + 1 })}
        </Typography>
        <IconButton color="default" onClick={onRemove}>
          <Trash size={16} color="white" />
        </IconButton>
      </Box>
      <Stack sx={{ border: 1, borderTop: 0, borderColor: 'divider', p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{t('vaccines.minAge')}</Typography>
              <ValueWithUnit
                control={control}
                name={`age_rules.${ageRuleIndex}.min_age`}
                selectionName={`age_rules.${ageRuleIndex}.min_age_unit`}
                rules={{
                  required: t('vaccines.minAgeRequired'),
                  validate: {
                    nonNegative: validateWholeNumber(t('vaccines.minAge')),
                  },
                }}
                selectionRules={{ required: t('common.selectUnit') }}
              />
            </Box>
            <MoveRight />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{t('vaccines.maxAge')}</Typography>
              <ValueWithUnit
                control={control}
                name={`age_rules.${ageRuleIndex}.max_age`}
                selectionName={`age_rules.${ageRuleIndex}.max_age_unit`}
                rules={{
                  validate: {
                    maxAge: (value, formValues) =>
                      validateMaxAge(value, formValues as IVaccineFormData),
                  },
                }}
                selectionRules={{
                  validate: {
                    maxAgeUnit: (_value, formValues) =>
                      validateMaxAge(
                        formValues.age_rules?.[ageRuleIndex]?.max_age,
                        formValues as IVaccineFormData,
                      ),
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        <DoseRule control={control} ageRuleIndex={ageRuleIndex} units={units} />
      </Stack>
    </Box>
  );
};

export default AgeRule;
