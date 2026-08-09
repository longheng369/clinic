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
            elevation={0}
            sx={{
               position: 'relative',
               zIndex: 1,
               width: '100%',
               maxWidth: 448,
               px: 4,
               py: 4,
               borderRadius: 3,
               bgcolor: 'rgba(255, 255, 255, 0.95)',
               boxShadow: '0 20px 25px -5px rgba(90, 143, 90, 0.05)',
               border: '1px solid rgba(200, 224, 200, 0.5)',
               backdropFilter: 'blur(8px)',
            }}
         >
            {children}
         </Paper>
      </Box>
   )
}

export default GuestLayout
