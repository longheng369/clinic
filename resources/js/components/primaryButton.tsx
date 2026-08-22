import { Button, type ButtonProps } from '@mui/material';

type Props = ButtonProps;

const PrimaryButton = ({ children, ...props }: Props) => (
  <Button {...props} variant="contained" color="primary">
    {children}
  </Button>
);

export default PrimaryButton;
