import { Box, Stack, Typography, IconButton } from '@mui/material';
import ValueWithUnit from '@/pages/vaccines/partials/valueWithUnit';
import DoseRule from '@/pages/vaccines/partials/doseRule';
import type { Control } from 'react-hook-form';
import { IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';
import { Trash } from 'lucide-react';

type Props = {
  control: Control<IVaccineFormData>;
  ageRuleIndex: number;
  onRemove: () => void;
  units: IUnit[];
};

const AgeRule = ({
  control,
  ageRuleIndex,
  onRemove,
  units,
}: Props) => {
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
          Age Rule #{ageRuleIndex + 1}
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
              <Typography>Min Age</Typography>
              <ValueWithUnit
                control={control}
                name={`age_rules.${ageRuleIndex}.min_age`}
                selectionName={`age_rules.${ageRuleIndex}.min_age_unit`}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Max Age</Typography>
              <ValueWithUnit
                control={control}
                name={`age_rules.${ageRuleIndex}.max_age`}
                selectionName={`age_rules.${ageRuleIndex}.max_age_unit`}
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
