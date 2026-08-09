import { Head, useForm } from '@inertiajs/react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'

export default function ForgotPassword({ status }: { status?: string }) {
   const { data, setData, post, processing, errors } = useForm({ email: '' })

   const submit = (e: React.FormEvent) => {
      e.preventDefault()
      post(route('password.email'))
   }

   return (
      <>
         <Head title="Forgot Password" />
         <Stack spacing={3}>
            <Typography color="text.secondary" variant="body2">
               Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
            </Typography>
            {status && <Alert severity="success">{status}</Alert>}
            <Box component="form" onSubmit={submit}>
               <Stack spacing={2}>
                  <TextField
                     id="email"
                     type="email"
                     name="email"
                     label="Email"
                     value={data.email}
                     autoFocus
                     fullWidth
                     error={Boolean(errors.email)}
                     helperText={errors.email}
                     onChange={(e) => setData('email', e.target.value)}
                  />
                  <Button type="submit" variant="contained" disabled={processing} sx={{ alignSelf: 'flex-end' }}>
                     Email Password Reset Link
                  </Button>
               </Stack>
            </Box>
         </Stack>
      </>
   )
}
