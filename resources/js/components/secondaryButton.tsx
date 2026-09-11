import { Button, type ButtonProps } from '@mui/material';

type Props = ButtonProps;

const SecondaryButton = ({ type = 'button', children, ...props }: Props) => (
  <Button {...props} type={type} variant="outlined" color="inherit">
    {children}
  </Button>
);

export default SecondaryButton;
