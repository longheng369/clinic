import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  fullScreen?: boolean;
  preventClickAway?: boolean;
  preventEscape?: boolean;
  scrollable?: boolean;
  contentSx?: SxProps<Theme>;
}

const extendedMaxWidths: Record<string, string> = {
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullScreen = false,
  preventClickAway = false,
  preventEscape = false,
  scrollable = false,
  contentSx,
}: ModalProps) => {
  const defaultSizes = ['sm', 'md', 'lg', 'xl'];
  const muiMaxWidth = (defaultSizes.includes(maxWidth) ? maxWidth : 'md') as
    'sm' | 'md' | 'lg' | 'xl';
  const customWidth = extendedMaxWidths[maxWidth];

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      fullWidth
      maxWidth={muiMaxWidth}
      scroll={scrollable ? 'paper' : 'body'}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' && preventClickAway) return;
        if (reason === 'escapeKeyDown' && preventEscape) return;
        onClose();
      }}
      sx={
        customWidth
          ? { '& .MuiDialog-paper': { maxWidth: customWidth } }
          : undefined
      }
    >
      <DialogTitle sx={{ pr: 6, borderBottom: 1, borderColor: 'divider' }}>
        {title}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          ...(fullScreen && { p: 0 }),
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
