import { Head, Link, useForm } from '@inertiajs/react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('verification.send'))
  }

  return (
    <>
      <Head title="Email Verification" />
      <Stack spacing={3}>
        <Typography color="text.secondary" variant="body2">
               Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
        </Typography>
        {status === 'verification-link-sent' && <Alert severity="success">A new verification link has been sent to the email address you provided during registration.</Alert>}
        <Box component="form" onSubmit={submit}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" disabled={processing}>Resend Verification Email</Button>
            <Link href={route('logout')} method="post" as="button" style={{ border: 0, background: 'none', cursor: 'pointer' }}>
                     Log Out
            </Link>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
