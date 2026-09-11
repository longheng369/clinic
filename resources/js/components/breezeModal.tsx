import { Dialog, DialogContent } from '@mui/material';

type Props = {
  children: React.ReactNode;
  show?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeable?: boolean;
  onClose?: () => void;
};

const maxWidthMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': 'xl',
} as const;

const BreezeModal = ({
  children,
  show = false,
  maxWidth = '2xl',
  closeable = true,
  onClose = () => {},
}: Props) => (
  <Dialog
    open={show}
    onClose={closeable ? onClose : undefined}
    maxWidth={maxWidthMap[maxWidth]}
    fullWidth
  >
    <DialogContent>{children}</DialogContent>
  </Dialog>
);

export default BreezeModal;
