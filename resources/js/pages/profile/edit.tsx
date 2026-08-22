import { Head } from '@inertiajs/react'
import { Box, Paper, Stack } from '@mui/material'
import UpdatePasswordForm from './partials/updatePasswordForm'
import UpdateProfileInformationForm from './partials/updateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  return (
    <>
      <Head title="Profile" />
      <Box sx={{ py: 6, maxHeight: '100%', overflowY: 'auto' }}>
        <Stack spacing={3} sx={{ px: { sm: 3, lg: 4 } }}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
          </Paper>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
            <UpdatePasswordForm />
          </Paper>
        </Stack>
      </Box>
    </>
  )
}
