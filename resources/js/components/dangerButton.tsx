import { Button, type ButtonProps } from '@mui/material';

type Props = ButtonProps;

const DangerButton = ({ children, ...props }: Props) => (
  <Button {...props} variant="contained" color="error">
    {children}
  </Button>
);

export default DangerButton;
