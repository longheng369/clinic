import { Box, Paper } from '@mui/material'

type Props = {
   children: React.ReactNode
}

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
            background: 'linear-gradient(135deg, #e3f0e3 0%, #f4f9f4 50%, #f0e8e0 100%)',
            '&::before': {
               content: '""',
               position: 'absolute',
               inset: 0,
               pointerEvents: 'none',
               background: 'radial-gradient(ellipse at top left, #c8e0c8 0%, transparent 50%)',
            },
            '&::after': {
               content: '""',
               position: 'absolute',
               inset: 0,
               pointerEvents: 'none',
               background: 'radial-gradient(ellipse at bottom right, #e0d0c1 0%, transparent 50%)',
            },
         }}
      >
         <Paper
            elevation={1}
            sx={{
               position: 'relative',
               zIndex: 1,
               width: '100%',
               maxWidth: 448,
               p: 4,
            }}
         >
            {children}
         </Paper>
      </Box>
   )
}

export default GuestLayout
