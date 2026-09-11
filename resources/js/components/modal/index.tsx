import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import Alert, { type AlertProps } from '@/components/modal/alert';

interface ModalConfig {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  preventClickAway?: boolean;
  preventEscape?: boolean;
  scrollable?: boolean;
}

interface DialogConfig {
  id: string;
  type: 'modal' | 'alert';
  title: ReactNode;
  content: ReactNode;
  open: boolean;
  config?: ModalConfig;
  alertProps?: Omit<AlertProps, 'onClose'>;
}

interface ModalContextType {
  openModal: (dialog: Omit<DialogConfig, 'id' | 'open' | 'type'>) => string;
  openAlert: (alert: Omit<AlertProps, 'onClose'>) => string;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
};

const extendedMaxWidths: Record<string, string> = {
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const dialogIdRef = useRef(0);
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);

  const openModal = useCallback(
    (dialog: Omit<DialogConfig, 'id' | 'open' | 'type'>) => {
      dialogIdRef.current += 1;
      const id = `modal-${dialogIdRef.current}`;
      setDialogs((prev) => [
        ...prev,
        { ...dialog, id, type: 'modal', open: true },
      ]);
      return id;
    },
    [],
  );

  const openAlert = useCallback((alertProps: Omit<AlertProps, 'onClose'>) => {
    dialogIdRef.current += 1;
    const id = `alert-${dialogIdRef.current}`;
    setDialogs((prev) => [
      ...prev,
      {
        id,
        type: 'alert',
        title: '',
        content: null,
        alertProps,
        open: true,
        config: { maxWidth: 'sm' },
      } as DialogConfig,
    ]);
    return id;
  }, []);

  const closeModal = useCallback(() => {
    setDialogs((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      return prev.map((d, i) => (i === lastIndex ? { ...d, open: false } : d));
    });
  }, []);

  const handleExited = useCallback((dialogId: string) => {
    setDialogs((prev) => prev.filter((d) => d.id !== dialogId));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, openAlert, closeModal }}>
      {children}
      {dialogs.map((dialog) => {
        const isAlert = dialog.type === 'alert';

        const content =
          isAlert && dialog.alertProps ? (
            <Alert {...dialog.alertProps} onClose={closeModal} />
          ) : (
            dialog.content
          );

        const handleClose = (
          _event: object,
          reason: 'backdropClick' | 'escapeKeyDown',
        ) => {
          if (reason === 'backdropClick' && dialog.config?.preventClickAway)
            return;
          if (reason === 'escapeKeyDown' && dialog.config?.preventEscape)
            return;
          closeModal();
        };

        const defaultSizes = ['sm', 'md', 'lg', 'xl'];
        const muiMaxWidth = (
          dialog.config?.maxWidth &&
          defaultSizes.includes(dialog.config.maxWidth)
            ? dialog.config.maxWidth
            : 'md'
        ) as 'sm' | 'md' | 'lg' | 'xl';

        const customWidth = dialog.config?.maxWidth
          ? extendedMaxWidths[dialog.config.maxWidth]
          : undefined;

        const titleId = `${dialog.id}-title`;
        const descriptionId = `${dialog.id}-description`;

        return (
          <Dialog
            key={dialog.id}
            open={dialog.open}
            onClose={handleClose}
            maxWidth={muiMaxWidth}
            fullWidth
            scroll={dialog.config?.scrollable ? 'paper' : 'body'}
            role={isAlert ? 'alertdialog' : 'dialog'}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            slotProps={{
              transition: {
                onExited: () => handleExited(dialog.id),
              },
            }}
            sx={
              customWidth
                ? {
                  '& .MuiDialog-paper': { maxWidth: customWidth },
                }
                : undefined
            }
          >
            {isAlert ? (
              <div id={descriptionId}>{content}</div>
            ) : (
              <>
                <DialogTitle id={titleId} sx={{ m: 0, p: 2, pr: 6 }}>
                  {dialog.title}
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={() => closeModal()}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <X size={20} />
                </IconButton>
                {content}
              </>
            )}
          </Dialog>
        );
      })}
    </ModalContext.Provider>
  );
};
