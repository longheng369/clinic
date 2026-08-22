import BreezeModal from '@/components/breezeModal'
import { useForm } from '@inertiajs/react'
import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState, type FormEventHandler } from 'react'

export default function DeleteUserForm() {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false)
  const passwordInput = useRef<HTMLInputElement>(null)
  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' })
  const closeModal = () => { setConfirmingUserDeletion(false); clearErrors(); reset() }
  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault()
    destroy(route('profile.destroy'), { preserveScroll: true, onSuccess: closeModal, onError: () => passwordInput.current?.focus(), onFinish: () => reset() })
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Delete Account</Typography>
      <Typography color="text.secondary" variant="body2">Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.</Typography>
      <Button color="error" variant="contained" onClick={() => setConfirmingUserDeletion(true)} sx={{ alignSelf: 'flex-start', mt: 1 }}>Delete Account</Button>
      <BreezeModal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser}>
          <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" variant="body2">Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.</Typography>
            <TextField id="password" label="Password" type="password" inputRef={passwordInput} value={data.password} onChange={(e) => setData('password', e.target.value)} autoFocus fullWidth error={Boolean(errors.password)} helperText={errors.password} sx={{ mt: 3 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" color="error" variant="contained" disabled={processing}>Delete Account</Button>
          </DialogActions>
        </form>
      </BreezeModal>
    </Stack>
  )
}
