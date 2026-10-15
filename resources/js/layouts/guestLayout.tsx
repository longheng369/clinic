import { Box, Paper } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const GuestLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: { xs: 2, sm: 4 },
        py: 6,
        background: '#ffffff',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 448,
          p: 4,
          borderRadius: 4,
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.04)'
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default GuestLayout;
