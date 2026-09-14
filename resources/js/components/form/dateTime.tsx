import dayjs, { type Dayjs } from 'dayjs';
import {
  DateTimePicker as MuiDateTimePicker,
  type DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
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
} & Omit<DateTimePickerProps, 'value' | 'onChange' | 'slotProps'>;

const DateTimeField = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  format = 'DD-MM-YYYY HH:mm',
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
    <MuiDateTimePicker
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

export default DateTimeField;
