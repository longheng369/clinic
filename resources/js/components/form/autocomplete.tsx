import { IOption } from '@/interfaces/IOption';
import { Autocomplete as MuiAutoComplete, TextField } from '@mui/material';
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
  label: string;
  options: IOption<any>[];
  placeholder?: string;
  disabled?: boolean;
  disableClearable?: boolean;
  onChange?: (option: IOption<any> | null) => void;
};

const Autocomplete = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options,
  placeholder = 'Search...',
  disabled,
  disableClearable,
  onChange,
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules });

  const selectedOption =
    options.find((option) => option.value === field.value) ?? null;

  return (
    <MuiAutoComplete
      options={options}
      value={selectedOption}
      disabled={disabled}
      disableClearable={disableClearable}
      onChange={(_, option) => {
        field.onChange(option?.value ?? null);
        onChange?.(option);
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) =>
        option.value === selected?.value
      }
      noOptionsText="No results found."
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          placeholder={placeholder}
          required={!!rules?.required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};

export default Autocomplete;
