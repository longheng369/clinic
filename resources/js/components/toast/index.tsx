import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { router } from '@inertiajs/react';
import { Box } from '@mui/material';
import Toast, {
  type ToastVariant,
  type ToastData,
} from '@/components/toast/toast';

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const idRef = useRef(0);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, options?: ToastOptions) => {
    idRef.current += 1;
    const id = `toast-${idRef.current}`;
    const data: ToastData = {
      id,
      message,
      description: options?.description,
      variant: options?.variant ?? 'info',
      duration: options?.duration ?? 4000,
    };
    setToasts((prev) => [...prev, data]);
    return id;
  }, []);

  const lastFlashRef = useRef<{ message: string; time: number } | null>(null);

  useEffect(() => {
    return router.on('success', (event) => {
      const flash = (event.detail.page.props as { flash?: { success?: string | null; error?: string | null } }).flash;
      const success = flash?.success;
      const error = flash?.error;
      if (!success && !error) return;

      const message = success ?? error ?? '';
      const now = Date.now();
      const last = lastFlashRef.current;
      if (last?.message === message && now - last.time < 1500) return;
      lastFlashRef.current = { message, time: now };

      if (success) toast(success, { variant: 'success' });
      if (error) toast(error, { variant: 'error' });
    });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <Box
        aria-live="polite"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: (theme) => theme.zIndex.snackbar,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <Box key={t.id} sx={{ pointerEvents: 'auto' }}>
            <Toast {...t} onClose={dismiss} />
          </Box>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};
