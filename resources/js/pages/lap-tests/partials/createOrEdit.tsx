import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';
import { ILapTest, ILapTestFormData } from '@/interfaces/ILapTest';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useToast } from '@/components/toast';
import { useModal } from '@/components/modal';
import { Save } from 'lucide-react';

interface LapTestFormProps {
  lapTest?: ILapTest;
}

const LapTestForm = ({ lapTest }: LapTestFormProps) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<ILapTestFormData>({
    defaultValues: lapTest,
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (lapTest) {
      router.put(
        `/settings/lap-tests/${lapTest.id}`,
        { ...data },
        {
          onSuccess: () => {
            closeModal();
            toast('Lap test updated successfully!', {
              variant: 'success',
              description: 'The lap test has been updated.',
            });
          },
          onFinish: () => {
            setIsProcessing(false);
          },
        },
      );

      return;
    }

    router.post(
      '/settings/lap-tests',
      { ...data },
      {
        onSuccess: () => {
          closeModal();
          toast('Lap test created successfully!', {
            variant: 'success',
            description: 'The lap test has been created.',
          });
        },
        onError: (errors) => {
          if (errors.name || errors.value) {
            toast('Unable to create lap test', {
              variant: 'error',
              description: errors.name ?? errors.value,
            });
          }
        },
        onFinish: () => {
          setIsProcessing(false);
        },
      },
    );
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid size={{ md: 12 }}>
            <Input
              label="Name"
              control={control}
              placeholder="e.g. CBC"
              name="name"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              label="Price ($)"
              control={control}
              type="number"
              name="price"
              rules={{ required: 'This field is required' }}
              slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              label="Description"
              control={control}
              name="description"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={() => closeModal()} variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          variant="contained"
          startIcon={<Save size={16} />}
        >
          Save
        </Button>
      </DialogActions>
    </Box>
  );
};

export default LapTestForm;
