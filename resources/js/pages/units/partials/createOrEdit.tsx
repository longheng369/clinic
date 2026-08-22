import { useForm } from 'react-hook-form'
import Input from '@/components/form/input-deprecated'
import Textarea from '@/components/form/textarea'
import { IUnit, IUnitFormData } from '@/interfaces/IUnit';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Box, Button, Stack } from '@mui/material';
import { useToast } from '@/components/toast'

interface UnitFormProps {
    unit?: IUnit;
    onClose: () => void;
}

const UnitForm = ({ unit, onClose }: UnitFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast()
  const { control, handleSubmit } = useForm<IUnitFormData>({
    defaultValues: unit
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (unit) {
      router.put(`/settings/units/${unit.id}`, { ...data }, {
        onSuccess: () => {
          onClose();
          toast('Unit updated successfully!', { variant: 'success', description: 'The unit has been updated.' });
        },
        onFinish: () => {
          setIsProcessing(false);
        },
      });

      return;
    }

    router.post('/settings/units', { ...data }, {
      onSuccess: () => {
        onClose();
        toast('Unit created successfully!', { variant: 'success', description: 'The unit has been created.' })
      },
      onError: (errors) => {
        if (errors.name) {
          toast('Unable to create unit', {
            variant: 'error',
            description: errors.name,
          });
        }
      },
      onFinish: () => {
        setIsProcessing(false);
      },
    })
  })

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ borderTop: 1, borderColor: 'divider' }} noValidate>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Input
          label="Name"
          control={control}
          placeholder='Enter name'
          name='name'
          rules={{ required: 'This field is required' }}
        />

        <Textarea
          label="Description"
          control={control}
          name='description'
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{p: 1, borderTop: 1, borderColor: 'divider', justifyContent: 'flex-end'}}>
        <Button
          type="button"
          onClick={onClose}
          variant="outlined"
        >
                    Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
        >
                    Submit
        </Button>
      </Stack>
    </Box>
  )
}

export default UnitForm
