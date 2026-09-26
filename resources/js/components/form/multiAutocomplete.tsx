import { Autocomplete, TextField } from '@mui/material';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

type Option = { label: string; value: number | string };

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  renderOption?: any;
  getOptionLabel?: any;
  renderValue?: any;
};

const MultiAutocomplete = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  options,
  placeholder = 'Search...',
  disabled,
  renderOption,
  getOptionLabel,
  renderValue,
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules });

  const selectedOptions = options.filter((opt) =>
    (field.value as (number | string)[]).includes(opt.value),
  );

  return (
    <Autocomplete
      multiple
      options={options as any}
      value={selectedOptions as any}
      disabled={disabled}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel ?? ((option: any) => option.label)}
      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
      onChange={(_: any, value: any) => field.onChange(value.map((opt: any) => opt.value))}
      noOptionsText="No results found."
      renderOption={renderOption}
      renderValue={renderValue}
      renderInput={(params) => (
        <TextField
          {...params}
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

export default MultiAutocomplete;
