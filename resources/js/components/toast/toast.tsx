import { useEffect } from 'react';
import { Alert, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

type Props = ToastData & {
  onClose: (id: string) => void;
};

const Toast = ({
  id,
  message,
  description,
  variant,
  duration,
  onClose,
}: Props) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ position: 'static', transform: 'none' }}
    >
      <Alert
        severity={variant}
        role="alert"
        sx={{ width: '100%', minWidth: 320, alignItems: 'flex-start' }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => onClose(id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </IconButton>
        }
      >
        <Stack spacing={0.25}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {message}
          </Typography>
          {description && (
            <Typography variant="caption">{description}</Typography>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
