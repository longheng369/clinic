import { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { IOption } from '@/interfaces/IOption';

type Props<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  label: string;
  apiUrl?: string;
  model?: string;
  /**
   * Known option for the current value. When omitted, a pre-filled value is
   * resolved from the endpoint so edit forms still show the label and extras.
   */
  initialOption?: IOption<string | number>;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Called with the full option (label plus any extra columns) whenever the
   * option behind the current value becomes known — on user selection and on
   * pre-fill resolution.
   */
  onSelect?: (option: IOption<any>) => void;
  excludeValues?: (string | number)[];
};

const isEmptyValue = (value: unknown) =>
  value === null || value === undefined || value === '';

const ServerAutocomplete = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  apiUrl,
  model,
  initialOption,
  placeholder = 'Search...',
  disabled = false,
  onSelect,
  excludeValues,
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules });
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    () => initialOption?.label ?? '',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [options, setOptions] = useState<IOption<any>[]>([]);
  const [resolvedOption, setResolvedOption] = useState<IOption<any> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = apiUrl ?? (model ? `/autocomplete/${model}` : null);
  const initialOptionValue = initialOption?.value ?? null;
  const initialOptionLabel = initialOption?.label ?? '';
  const normalizedInitialOption = useMemo(
    () =>
      initialOption
        ? {
          value: initialOptionValue,
          label: initialOptionLabel,
        }
        : null,
    [initialOptionLabel, initialOptionValue],
  );

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const selectedOption = useMemo(() => {
    const matchedOption =
      options.find((option) => option.value === field.value) ?? null;

    if (matchedOption) {
      return matchedOption;
    }

    if (
      normalizedInitialOption &&
      normalizedInitialOption.value === field.value
    ) {
      return normalizedInitialOption;
    }

    if (resolvedOption && resolvedOption.value === field.value) {
      return resolvedOption;
    }

    return null;
  }, [field.value, normalizedInitialOption, options, resolvedOption]);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);

      fetch(`${endpoint}?search=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((data: IOption<any>[]) => {
          const nextOptions = normalizedInitialOption
            ? [
              normalizedInitialOption,
              ...data.filter(
                (option) => option.value !== normalizedInitialOption.value,
              ),
            ]
            : data;

          setOptions(nextOptions);
        })
        .catch((error) => {
          if (error?.name !== 'AbortError') {
            setOptions(
              normalizedInitialOption ? [normalizedInitialOption] : [],
            );
          }
        })
        .finally(() => setIsLoading(false));
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery, endpoint, normalizedInitialOption]);

  // Pre-fill: turn a bare value (edit form) into a full option with its label
  // and extra columns.
  useEffect(() => {
    const value = field.value;

    if (isEmptyValue(value)) {
      setResolvedOption(null);
      return;
    }

    if (
      resolvedOption?.value === value ||
      normalizedInitialOption?.value === value
    ) {
      return;
    }

    const knownOption = options.find((option) => option.value === value);

    if (knownOption) {
      setResolvedOption(knownOption);
      return;
    }

    if (!endpoint) {
      return;
    }

    const controller = new AbortController();

    fetch(`${endpoint}?ids=${encodeURIComponent(String(value))}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: IOption<any>[]) => {
        const option = data.find((item) => item.value === value) ?? null;

        if (option) {
          setResolvedOption(option);
          onSelectRef.current?.(option);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
    // `options` is read as a cache only; refetching on every search result
    // would be wasteful and the id lookup is already value-scoped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, field.value, normalizedInitialOption]);

  useEffect(() => {
    if (isEditingSearch) {
      return;
    }

    if (selectedOption) {
      setInputValue(selectedOption.label);
      return;
    }

    if (isEmptyValue(field.value)) {
      setInputValue('');
    }
  }, [field.value, isEditingSearch, selectedOption?.label]);

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      loading={isLoading}
      open={open}
      disabled={disabled}
      fullWidth
      onOpen={() => setOpen(true)}
      onInputChange={(_, value, reason) => {
        if (reason === 'clear') {
          setInputValue('');
          setSearchQuery('');
          setIsEditingSearch(false);
          setOptions(normalizedInitialOption ? [normalizedInitialOption] : []);
          setResolvedOption(null);
          field.onChange(null);
          setOpen(false);
          return;
        }

        if (reason === 'reset') {
          if (isEditingSearch) {
            return;
          }

          setInputValue(value);
          return;
        }

        setIsEditingSearch(true);
        setInputValue(value);
        setSearchQuery(value);
        setOpen(true);
      }}
      onChange={(_, value) => {
        field.onChange(value?.value ?? null);
        setResolvedOption(value ?? null);
        setInputValue(value?.label ?? '');
        setSearchQuery('');
        setIsEditingSearch(false);
        setOpen(false);
        if (value && onSelect) {
          onSelect(value);
        }
      }}
      onClose={(_, reason) => {
        setOpen(false);

        if (reason === 'blur' || reason === 'escape') {
          setIsEditingSearch(false);
          setSearchQuery('');
          setInputValue(selectedOption?.label ?? '');
        }
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value?.value}
      filterOptions={(options) =>
        excludeValues?.length
          ? options.filter((o) => !excludeValues.includes(o.value))
          : options
      }
      noOptionsText={isLoading ? 'Searching...' : 'No results found'}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={!!rules?.required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          variant="standard"
          fullWidth
          slotProps={{
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            inputLabel: params.slotProps.inputLabel,
            htmlInput: params.slotProps.htmlInput,
          }}
        />
      )}
    />
  );
};

export default ServerAutocomplete;
