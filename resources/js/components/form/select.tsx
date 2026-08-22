import { FormHelperText, SelectProps } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import MuiSelect from '@mui/material/Select';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { IOption } from "@/interfaces/IOption";

type Props<T extends FieldValues = FieldValues> = {
   control: Control<T>;
   name: Path<T>;
   rules?: Omit<
      RegisterOptions<T, Path<T>>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
   >;
   options: IOption<any>[];
} & SelectProps;

const Select = <T extends FieldValues = FieldValues>({ control, name, rules, options, ...rest }: Props<T>) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules
  });

  return (
    <FormControl variant="standard" fullWidth size="small" error={!!fieldState.error} required={!!rules?.required}>
      <InputLabel id={name}>{rest.label}</InputLabel>
      <MuiSelect
        labelId={name}
        {...field}
        {...rest}
        size="small"
        variant="standard"
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </MuiSelect>
      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  )
}

export default Select
