import { Head, Link, useForm } from '@inertiajs/react'
import { Alert, Box, Button, Checkbox, FormControlLabel, InputAdornment, Link as MuiLink, Stack, TextField, Typography } from '@mui/material'
import { LogIn, Lock, Mail } from 'lucide-react'

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
  const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false })

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault()
    post(route('login'), { onFinish: () => reset('password') })
  }

  return (
    <>
      <Head title="Log in" />
      <Stack spacing={2} sx={{ alignItems: 'stretch' }}>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            component="img"
            src="/storage/hospital-logo.jpeg"
            alt="Hospital logo"
            sx={{ width: 150, height: 150, objectFit: 'contain', borderRadius: 2 }}
          />
          <Typography variant="h5">Welcome back</Typography>
          <Typography color="text.secondary" variant="body1">Sign in to your clinic account</Typography>
        </Stack>
        {status && <Alert severity="info">{status}</Alert>}
        <Box component="form" onSubmit={submit}>
          <Stack spacing={2.5}>
            <TextField
              id="email"
              type="email"
              name="email"
              label="Email"
              value={data.email}
              size='small'
              variant='standard'
              autoComplete="username"
              autoFocus
              placeholder="you@clinic.com"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment> } }}
              onChange={(e) => setData('email', e.target.value)}
            />
            <TextField
              id="password"
              type="password"
              name="password"
              label="Password"
              size='small'
              variant='standard'
              value={data.password}
              autoComplete="current-password"
              placeholder="••••••••"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock size={18} /></InputAdornment> } }}
              onChange={(e) => setData('password', e.target.value)}
            />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel control={<Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />} label="Remember me" />
              {canResetPassword && <MuiLink component={Link as React.ElementType} href={route('password.request')} underline="hover" variant="body2">Forgot password?</MuiLink>}
            </Stack>
            <Button type="submit" variant="contained" fullWidth disabled={processing} startIcon={<LogIn size={18} />}>{processing ? 'Signing in...' : 'Sign in'}</Button>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
