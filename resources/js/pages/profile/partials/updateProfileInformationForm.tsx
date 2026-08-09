import { Link, useForm, usePage } from '@inertiajs/react'
import { Alert, Button, Link as MuiLink, Stack, TextField, Typography } from '@mui/material'
import { type FormEventHandler } from 'react'

export default function UpdateProfileInformation({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
   const user = usePage().props.auth.user
   const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({ name: user?.name ?? '', email: user?.email ?? '' })

   const submit: FormEventHandler = (e) => {
      e.preventDefault()
      patch(route('profile.update'))
   }

   return (
      <Stack spacing={1}>
         <Typography variant="h6">Profile Information</Typography>
         <Typography color="text.secondary" variant="body2">Update your account&apos;s profile information and email address.</Typography>
         <Stack component="form" onSubmit={submit} spacing={2} sx={{ mt: 2 }}>
            <TextField id="name" label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus autoComplete="name" fullWidth error={Boolean(errors.name)} helperText={errors.name} />
            <TextField id="email" type="email" label="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="username" fullWidth error={Boolean(errors.email)} helperText={errors.email} />
            {mustVerifyEmail && user && user.email_verified_at === null && (
               <Stack spacing={1}>
                  <Typography variant="body2">Your email address is unverified. <MuiLink component={Link as React.ElementType} href={route('verification.send')} method="post" as="button" underline="hover">Click here to re-send the verification email.</MuiLink></Typography>
                  {status === 'verification-link-sent' && <Alert severity="success">A new verification link has been sent to your email address.</Alert>}
               </Stack>
            )}
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
               <Button type="submit" variant="contained" disabled={processing}>Save</Button>
               {recentlySuccessful && <Typography color="text.secondary" variant="body2">Saved.</Typography>}
            </Stack>
         </Stack>
      </Stack>
   )
}
