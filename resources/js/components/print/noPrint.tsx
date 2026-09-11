import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

type Props = {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
};
const NoPrint = ({ children, className, sx }: Props) => {
  return <Box className={`no-print ${className}`} sx={sx}>{children}</Box>;
};

export default NoPrint
