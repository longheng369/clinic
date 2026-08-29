import { useEffect, useMemo, useState } from 'react';
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
  initialOption?: IOption<string | number>;
  placeholder?: string;
  disabled?: boolean;
};

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
}: Props<T>) => {
  const { field, fieldState } = useController({ control, name, rules });
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    () => initialOption?.label ?? '',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [options, setOptions] = useState<IOption<any>[]>([]);
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

    return null;
  }, [field.value, normalizedInitialOption, options]);

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

  useEffect(() => {
    if (isEditingSearch) {
      return;
    }

    if (selectedOption) {
      setInputValue(selectedOption.label);
      return;
    }

    if (
      field.value === null ||
      field.value === undefined ||
      field.value === ''
    ) {
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
      onOpen={() => setOpen(true)}
      onInputChange={(_, value, reason) => {
        if (reason === 'clear') {
          setInputValue('');
          setSearchQuery('');
          setIsEditingSearch(false);
          setOptions(normalizedInitialOption ? [normalizedInitialOption] : []);
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
        setInputValue(value?.label ?? '');
        setSearchQuery('');
        setIsEditingSearch(false);
        setOpen(false);
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
      filterOptions={(x) => x}
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
