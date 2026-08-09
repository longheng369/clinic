import { createTheme } from '@mui/material/styles'

const theme = createTheme({
   palette: {
      primary: {
         main: '#4a7a4a',
         light: '#7aab7a',
         dark: '#3d633d',
         contrastText: '#ffffff',
      },
      secondary: {
         main: '#96715c',
         light: '#bd9c82',
         dark: '#7d5e4d',
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
      background: {
         default: '#efefef',
         paper: '#ffffff',
      },
      text: {
         primary: '#1e293b',
         secondary: '#64748b',
      },
      divider: '#cbd5e1',
   },
   typography: {
      fontFamily: '"Poppins", "Siemreap", system-ui, sans-serif',
      fontSize: 14,
      button: {
         textTransform: 'none',
         fontWeight: 500,
      },
   },
   shape: {
      borderRadius: 10,
   },
   spacing: 4,
   components: {
      MuiCssBaseline: {
         styleOverrides: {
            body: {
               backgroundColor: '#efefef',
            },
         },
      },
      MuiButton: {
         defaultProps: {
            disableElevation: true,
         },
         styleOverrides: {
            root: {
               textTransform: 'none',
               fontWeight: 500,
               borderRadius: 10,
            },
         },
      },
      MuiIconButton: {
         styleOverrides: {
            root: {
               borderRadius: 10,
            },
         },
      },
      MuiTextField: {
         defaultProps: {
            size: 'small',
            fullWidth: true,
            variant: 'standard',
         },
         styleOverrides: {
            root: {
               '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
               },
            },
         },
      },
      MuiFormControl: {
         defaultProps: {
            fullWidth: true,
            size: 'small',
            variant: 'standard',
         },
      },
      MuiPaper: {
         styleOverrides: {
            root: {
               backgroundImage: 'none',
            },
         },
      },
      MuiDialog: {
         styleOverrides: {
            paper: {
               borderRadius: 16,
            },
         },
      },
      MuiChip: {
         styleOverrides: {
            root: {
               borderRadius: 8,
            },
         },
      },
   },
})

export default theme
