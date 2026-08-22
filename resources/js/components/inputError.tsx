import { FormHelperText, type FormHelperTextProps } from '@mui/material';

type Props = FormHelperTextProps & {
  message?: string;
};

const InputError = ({ message, children, ...props }: Props) =>
  message ? (
    <FormHelperText {...props} error>
      {message ?? children}
    </FormHelperText>
  ) : null;

export default InputError;
