import { TextField } from '@mui/material';
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
  label: string;
  /** Native attributes applied to the underlying textarea element. */
  inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
} & Omit<
  React.ComponentProps<typeof TextField>,
  | 'name'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'error'
  | 'helperText'
  | 'label'
  | 'inputProps'
>;

const Textarea = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  inputProps,
  slotProps,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules });

  return (
    <TextField
      {...rest}
      slotProps={{
        ...slotProps,
        htmlInput: { ...slotProps?.htmlInput, ...inputProps },
      }}
      {...field}
      label={label}
      multiline
      minRows={3}
      variant="standard"
      required={!!rules?.required}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      fullWidth
    />
  );
};

export default Textarea;
