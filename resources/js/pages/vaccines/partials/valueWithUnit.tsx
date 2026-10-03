import Input from '@/components/form/input';
import Select from '@/components/form/select';
import { IOption } from '@/interfaces/IOption';
import { Box } from '@mui/material'
import { FieldValues, Control, Path, RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FieldRules<T extends FieldValues> = Omit<
  RegisterOptions<T, Path<T>>,
  'valueAsDate' | 'setValueAs' | 'disabled'
>;

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: FieldRules<T>;
  selectionName: Path<T>;
  selectionRules?: FieldRules<T>;
  selectionOptions?: IOption<any>[];
}

const ValueWithUnit = <T extends FieldValues>({
  control,
  selectionName,
  name,
  selectionOptions,
  rules,
  selectionRules,
}: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Input
        label={t('vaccines.amount')}
        control={control}
        name={name}
        size="small"
        type="number"
        fullWidth={false}
        rules={{ ...rules, valueAsNumber: true }}
        sx={{
          width: 100,
        }}
        variant="outlined"
        slotProps={{
          input: {
            sx: {
              borderRadius: 0,
              '& fieldset': { borderRight: 0 },
              '&:hover fieldset': {
                borderRight: '1px solid',
              },
            },
          },
        }}
      />
      <Select
        label={t('vaccines.unit')}
        control={control}
        name={selectionName}
        size="small"
        variant="outlined"
        fullWidth={false}
        sx={{
          width: 100,
          borderRadius: 0,
        }}
        rules={selectionRules}
        options={
          selectionOptions ?? [
            { label: t('common.day'), value: 'day' },
            { label: t('common.month'), value: 'month' },
            { label: t('common.year'), value: 'year' },
          ]
        }
      />
    </Box>
  );
};

export default ValueWithUnit
