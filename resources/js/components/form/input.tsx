import { TextField, TextFieldProps } from '@mui/material';
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
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & TextFieldProps;

const Input = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  fullWidth= true,
  type,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
  });

  return (
    <TextField
      fullWidth={fullWidth}
      {...rest}
      size="small"
      variant={rest.variant ?? 'standard'}
      {...field}
      onChange={(event) => {
        const value = event.target.value;

        field.onChange(
          type === 'number' ? (value === '' ? null : Number(value)) : value,
        );
      }}
      required={!!rules?.required}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

export default Input;
