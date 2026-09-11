import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  type CheckboxProps,
  type FormGroupProps,
} from '@mui/material';
import type { ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

export type CheckboxGroupOption = {
  value?: string | number;
  label?: ReactNode;
  text?: ReactNode;
  colSpan?: number;
};

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  options: CheckboxGroupOption[];
  label?: string;
  disabled?: boolean;
  grid?: boolean;
  exclusiveValue?: string | number;
  onValuesChange?: (values: Array<string | number>) => void;
  checkboxProps?: Omit<
    CheckboxProps,
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'name'
    | 'onChange'
    | 'required'
    | 'slotProps'
    | 'value'
  >;
} & Omit<FormGroupProps, 'children' | 'onChange'>;

const CheckboxGroup = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  options,
  label,
  disabled = false,
  grid = false,
  exclusiveValue,
  onValuesChange,
  checkboxProps,
  ...formGroupProps
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name, rules });
  const selectedValues: Array<string | number> = Array.isArray(field.value)
    ? (field.value as Array<string | number>)
    : [];
  const labelId = `${String(name)}-label`;
  const helperTextId = `${String(name)}-helper-text`;
  const hasExclusiveValue =
    exclusiveValue !== undefined && selectedValues.includes(exclusiveValue);

  const handleChange = (optionValue: string | number, checked: boolean) => {
    const nextValues = checked
      ? optionValue === exclusiveValue
        ? [optionValue]
        : [
          ...selectedValues.filter(
            (value) => value !== exclusiveValue && value !== optionValue,
          ),
          optionValue,
        ]
      : selectedValues.filter((value) => value !== optionValue);

    field.onChange(nextValues);
    onValuesChange?.(nextValues);
  };

  const renderedOptions = options.map((option, index) => {
    if (option.text || option.value === undefined) {
      return (
        <Grid key={`heading-${index}`} size={12}>
          <Box
            sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}
          >
            {option.text ?? option.label}
          </Box>
        </Grid>
      );
    }

    const optionValue = option.value;
    const isChecked = selectedValues.includes(optionValue);
    const optionDisabled =
      disabled || (hasExclusiveValue && optionValue !== exclusiveValue);

    return (
      <Grid key={optionValue} size={option.colSpan ?? 3}>
        <FormControlLabel
          control={
            <Checkbox
              {...checkboxProps}
              checked={isChecked}
              disabled={optionDisabled}
              name={field.name}
              value={optionValue}
              onChange={(event) =>
                handleChange(optionValue, event.target.checked)
              }
              onBlur={field.onBlur}
              slotProps={{
                input: { ref: index === 0 ? field.ref : undefined },
              }}
            />
          }
          label={option.label ?? optionValue}
          sx={{ m: 0, gap: 0.5 }}
        />
      </Grid>
    );
  });

  return (
    <FormControl
      component="fieldset"
      fullWidth
      error={!!error}
      required={!!rules?.required}
      disabled={disabled}
    >
      {label && (
        <FormLabel id={labelId} component="legend">
          {label}
        </FormLabel>
      )}
      {grid ? (
        <Grid
          container
          spacing={0.5}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={error ? helperTextId : undefined}
        >
          {renderedOptions}
        </Grid>
      ) : (
        <FormGroup
          {...formGroupProps}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={error ? helperTextId : undefined}
        >
          {renderedOptions}
        </FormGroup>
      )}
      {error?.message && (
        <FormHelperText id={helperTextId}>{error.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CheckboxGroup;
