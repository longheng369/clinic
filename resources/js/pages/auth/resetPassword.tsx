import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Stack, TextField } from '@mui/material';

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Reset Password" />
      <Box component="form" onSubmit={submit}>
        <Stack spacing={2}>
          <TextField
            id="email"
            type="email"
            name="email"
            label="Email"
            value={data.email}
            autoComplete="username"
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <TextField
            id="password"
            type="password"
            name="password"
            label="Password"
            value={data.password}
            autoComplete="new-password"
            autoFocus
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password}
            onChange={(e) => setData('password', e.target.value)}
          />
          <TextField
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            label="Confirm Password"
            value={data.password_confirmation}
            autoComplete="new-password"
            fullWidth
            error={Boolean(errors.password_confirmation)}
            helperText={errors.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={processing}
            sx={{ alignSelf: 'flex-end' }}
          >
            Reset Password
          </Button>
        </Stack>
      </Box>
    </>
  );
}
