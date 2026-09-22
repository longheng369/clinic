import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ValueWithUnit from './valueWithUnit';
import { Control, useFieldArray } from 'react-hook-form';
import { Minus, Plus, Trash } from 'lucide-react';
import { IVaccineFormData } from '@/interfaces/IVaccine';
import { IUnit } from '@/interfaces/IUnit';

type Props = {
  control: Control<IVaccineFormData>;
  ageRuleIndex: number;
  units: IUnit[];
}

const DoseRule = ({ control, ageRuleIndex, units }: Props) => {
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
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 'medium' }}>Doses</Typography>
        <Button onClick={handleAppend} startIcon={<Plus size={16}/>} variant='contained' color='secondary' size='small'>New Dose</Button>
      </Box>

      {fields.map((field, doseRuleIndex) => (
        <DoseRow key={field.id} control={control} ageRuleIndex={ageRuleIndex} doseRuleIndex={doseRuleIndex} units={units} onRemove={() => remove(doseRuleIndex)} />
      ))}
    </Stack>
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
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 1, borderColor: 'divider', p: 1 }}>
      <Typography>Dose {doseRuleIndex + 1}</Typography>
      {doseRuleIndex > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Interval</Typography>
          <ValueWithUnit control={control} name={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.interval_from_previous_dose`} selectionName={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.interval_from_previous_dose_unit`} />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>Amount</Typography>
        <ValueWithUnit
          control={control}
          name={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.amount`}
          selectionName={`age_rules.${ageRuleIndex}.dose_rules.${doseRuleIndex}.amount_unit_id`}
          selectionOptions={units.map((u) => ({ label: u.name, value: u.id }))}
        />
        <IconButton onClick={onRemove} color='error'>
          <Trash size={16} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default DoseRule
