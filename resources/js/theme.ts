import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a7a4a',
      light: '#7aab7a',
      dark: '#3d633d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#213C51',
      light: '#bd9c82',
      dark: '#1A3041',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
      light: '#4ade80',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Siemreap", system-ui, sans-serif',
    fontSize: 14,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
