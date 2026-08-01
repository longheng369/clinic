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
      background: {
         default: '#efefef',
         paper: '#ffffff',
      },
      text: {
         primary: '#1e293b',
         secondary: '#64748b',
      },
   },
   typography: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: 14,
   },
   shape: {
      borderRadius: 10,
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: 'none',
               fontWeight: 500,
            },
         },
      },
      MuiTextField: {
         defaultProps: {
            size: 'small',
         },
         styleOverrides: {
            root: {
               '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
               },
            },
         },
      },
   },
})

export default theme
