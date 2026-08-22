import { TextField, type TextFieldProps } from '@mui/material';
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
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & TextFieldProps;

const NumberInput = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
  });

  return (
    <TextField
      fullWidth
      {...rest}
      type="number"
      size="small"
      variant="standard"
      {...field}
      required={!!rules?.required}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

export default NumberInput;
