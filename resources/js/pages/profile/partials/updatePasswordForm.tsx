import { useForm } from '@inertiajs/react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useRef, type FormEventHandler } from 'react';

export default function UpdatePasswordForm() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({ current_password: '', password: '', password_confirmation: '' });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (formErrors) => {
        if (formErrors.password) passwordInput.current?.focus();
        if (formErrors.current_password) currentPasswordInput.current?.focus();
      },
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Update Password</Typography>
      <Typography color="text.secondary" variant="body2">
        Ensure your account is using a long, random password to stay secure.
      </Typography>
      <Stack
        component="form"
        onSubmit={updatePassword}
        spacing={2}
        sx={{ mt: 2 }}
      >
        <TextField
          id="current_password"
          label="Current Password"
          type="password"
          inputRef={currentPasswordInput}
          value={data.current_password}
          onChange={(e) => setData('current_password', e.target.value)}
          autoComplete="current-password"
          fullWidth
          error={Boolean(errors.current_password)}
          helperText={errors.current_password}
        />
        <TextField
          id="password"
          label="New Password"
          type="password"
          inputRef={passwordInput}
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          autoComplete="new-password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          autoComplete="new-password"
          fullWidth
          error={Boolean(errors.password_confirmation)}
          helperText={errors.password_confirmation}
        />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Button type="submit" variant="contained" disabled={processing}>
            Save
          </Button>
          {recentlySuccessful && (
            <Typography color="text.secondary" variant="body2">
              Saved.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
