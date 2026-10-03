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
import { useTranslation } from 'react-i18next';

interface CategoryFormProps {
  category?: ICategory;
}

const CategoryForm = ({ category }: CategoryFormProps) => {
  const { t } = useTranslation();
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
        },
        onError: (errors) => {
          if (errors.name) {
            toast(t('categories.createError'), {
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
              label={t('categories.name')}
              control={control}
              placeholder={t('categories.namePlaceholder')}
              name="name"
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Textarea
              label={t('categories.description')}
              control={control}
              name="description"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={() => closeModal()} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          variant="contained"
          startIcon={<Save size={16} />}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default CategoryForm;
