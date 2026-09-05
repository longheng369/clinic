import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';
import {
  IMedicineInstruction,
  IMedicineInstructionFormData,
} from '@/interfaces/IMedicineInstruction';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useToast } from '@/components/toast';
import { useModal } from '@/components/modal';
import { Save } from 'lucide-react';

interface MedicineInstructionFormProps {
  medicineInstruction?: IMedicineInstruction;
}

const MedicineInstructionForm = ({ medicineInstruction }: MedicineInstructionFormProps) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<IMedicineInstructionFormData>({
    defaultValues: medicineInstruction,
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (medicineInstruction) {
      router.put(
        `/settings/medicine-instructions/${medicineInstruction.id}`,
        { ...data },
        {
          onSuccess: () => {
            closeModal();
            toast('Medicine instruction updated successfully!', {
              variant: 'success',
              description: 'The medicine instruction has been updated.',
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
      '/settings/medicine-instructions',
      { ...data },
      {
        onSuccess: () => {
          closeModal();
          toast('Medicine instruction created successfully!', {
            variant: 'success',
            description: 'The medicine instruction has been created.',
          });
        },
        onError: (errors) => {
          if (errors.code || errors.name) {
            toast('Unable to create medicine instruction', {
              variant: 'error',
              description: errors.code ?? errors.name,
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
          <Grid size={{ md: 6 }}>
            <Input
              label="Code"
              control={control}
              placeholder="e.g. BEFORE_MEAL"
              name="code"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              label="Name"
              control={control}
              placeholder="e.g. មុនបាយ"
              name="name"
              rules={{ required: 'This field is required' }}
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

export default MedicineInstructionForm;
