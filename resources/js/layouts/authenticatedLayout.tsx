import { Box } from '@mui/material'
import Sidebar from './sidebar'

type Props = {
   children: React.ReactNode
}

const AuthenticatedLayout = ({ children }: Props) => {
  return (
    <Box component="main" sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box component="section" sx={{ flex: 1, maxHeight: '100vh', width: '100%', overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  )
}

export default AuthenticatedLayout
