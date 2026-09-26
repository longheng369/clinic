import Input from '@/components/form/input';
import Select from '@/components/form/select';
import { IOption } from '@/interfaces/IOption';
import { Box } from '@mui/material'
import { FieldValues, Control, Path, RegisterOptions } from 'react-hook-form';

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  selectionName: Path<T>;
  selectionOptions?: IOption<any>[];
}

const ValueWithUnit = <T extends FieldValues>({
  control,
  selectionName,
  name,
  selectionOptions,
  rules,
}: Props<T>) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Input
        control={control}
        name={name}
        size="small"
        type="number"
        fullWidth={false}
        rules={rules}
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
        label="Unit"
        control={control}
        name={selectionName}
        size="small"
        variant="outlined"
        fullWidth={false}
        sx={{
          width: 100,
          borderRadius: 0,
        }}
        rules={rules}
        options={
          selectionOptions ?? [
            { label: 'Day', value: 'day' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
          ]
        }
      />
    </Box>
  );
};

export default ValueWithUnit
