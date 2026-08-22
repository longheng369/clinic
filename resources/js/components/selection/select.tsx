import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';

type Option<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  options: Option<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
};

const Select = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}: Props<T>) => (
  <FormControl fullWidth size="small">
    <InputLabel>{placeholder}</InputLabel>
    <MuiSelect
      value={value ?? ''}
      label={placeholder}
      onChange={(event) => {
        const selected = options.find(
          (option) => String(option.value) === String(event.target.value),
        );
        if (selected) onChange?.(selected.value);
      }}
    >
      <MenuItem value="" disabled>
        {placeholder}
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={String(option.value)} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  </FormControl>
);

export default Select;
