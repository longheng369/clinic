import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';
import { ICategory, ICategoryFormData } from '@/interfaces/ICategory';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { useToast } from '@/components/toast';
import { useModal } from '@/components/modal';
import { Save } from 'lucide-react';

interface CategoryFormProps {
  category?: ICategory;
}

const CategoryForm = ({ category }: CategoryFormProps) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<ICategoryFormData>({
    defaultValues: category,
  });

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (category) {
      router.put(
        `/settings/categories/${category.id}`,
        { ...data },
        {
          onSuccess: () => {
            closeModal();
            toast('Category updated successfully!', {
              variant: 'success',
              description: 'The category has been updated.',
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
      '/settings/categories',
      { ...data },
      {
        onSuccess: () => {
          closeModal();
          toast('Category created successfully!', {
            variant: 'success',
            description: 'The category has been created.',
          });
        },
        onError: (errors) => {
          if (errors.name) {
            toast('Unable to create category', {
              variant: 'error',
              description: errors.name,
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
              placeholder="Enter name"
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

export default CategoryForm;
