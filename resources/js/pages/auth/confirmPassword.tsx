import { Head, useForm } from '@inertiajs/react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'

export default function ConfirmPassword() {
   const { data, setData, post, processing, errors, reset } = useForm({ password: '' })

   const submit = (e: React.FormEvent) => {
      e.preventDefault()
      post(route('password.confirm'), { onFinish: () => reset('password') })
   }

   return (
      <>
         <Head title="Confirm Password" />
         <Stack spacing={3}>
            <Typography color="text.secondary" variant="body2">
               This is a secure area of the application. Please confirm your password before continuing.
            </Typography>
            <Box component="form" onSubmit={submit}>
               <Stack spacing={2}>
                  <TextField
                     id="password"
                     type="password"
                     name="password"
                     label="Password"
                     value={data.password}
                     autoFocus
                     fullWidth
                     error={Boolean(errors.password)}
                     helperText={errors.password}
                     onChange={(e) => setData('password', e.target.value)}
                  />
                  <Button type="submit" variant="contained" disabled={processing} sx={{ alignSelf: 'flex-end' }}>
                     Confirm
                  </Button>
               </Stack>
            </Box>
         </Stack>
      </>
   )
}
