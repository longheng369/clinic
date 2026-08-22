import dayjs, { type Dayjs } from 'dayjs';
import {
  DatePicker,
  type DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  format?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & Omit<DatePickerProps, 'value' | 'onChange' | 'slotProps'>;

const DateInput = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  format = 'DD-MM-YYYY',
  rules,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
  });

  const handleChange = (value: Dayjs | null) => {
    field.onChange(value ? value.format(format) : '');
  };

  return (
    <DatePicker
      {...rest}
      label={label}
      format={format}
      value={field.value ? dayjs(field.value, format) : null}
      onChange={handleChange}
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'small',
          variant: 'standard',
          required: !!rules?.required,
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
        },
      }}
    />
  );
};

export default DateInput;
