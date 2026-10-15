import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import {
  IMedicine,
  IMedicineFormData,
  MEDICINE_TYPES,
} from '@/interfaces/IMedicine';
import { IUnit } from '@/interfaces/IUnit';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { DialogActions, DialogContent, Grid, Box, Button } from '@mui/material';
import { useModal } from '@/components/modal';
import { useTranslation } from 'react-i18next';

interface CategoryOption {
  value: number;
  label: string;
}

interface MedicineFormProps {
  medicine?: IMedicine;
  units: IUnit[];
}

const MedicineForm = ({ medicine, units }: MedicineFormProps) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { toast } = useToast();
  const { control, handleSubmit } = useForm<IMedicineFormData>({
    defaultValues: medicine ?? {
      name: '',
      type: undefined,
      description: '',
      dosage: '',
      category_id: null,
      unit_id: null,
      unit_price: null,
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    setCategoriesLoading(true);
    fetch('/api/categories', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then((data: { id: number; name: string }[]) => {
        setCategories(
          data.map((item) => ({ value: item.id, label: item.name })),
        );
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          toast(t('medicines.loadCategoriesFailed'), { variant: 'error' });
        }
      })
      .finally(() => setCategoriesLoading(false));
    return () => controller.abort();
  }, [toast, t]);

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (medicine) {
      router.put(
        `/medicines/${medicine.id}`,
        { ...data },
        {
          onFinish: () => {
            closeModal();
            setIsProcessing(false);
          },
        },
      );

      return;
    }

    router.post(
      '/medicines',
      { ...data },
      {
        onError: (errors) => {
          if (errors.name) {
            toast(t('medicines.createError'), {
              variant: 'error',
              description: errors.name,
            });
          }
        },
        onFinish: () => {
          closeModal();
          setIsProcessing(false);
        },
      },
    );
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={3}>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="name"
              label={t('medicines.name')}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="type"
              label={t('medicines.type')}
              options={MEDICINE_TYPES.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="category_id"
              label={t('medicines.category')}
              options={categories}
              disabled={categoriesLoading}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="unit_id"
              label={t('medicines.unit')}
              options={units.map((unit) => ({
                value: unit.id,
                label: unit.name,
              }))}
              rules={{ required: t('medicines.selectUnit') }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="dosage"
              label={t('medicines.dosage')}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="unit_price"
              label={t('medicines.unitPrice')}
              rules={{ required: t('common.required') }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input
              control={control}
              name="description"
              label={t('medicines.description')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={() => closeModal()} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isProcessing} variant="contained">
          {medicine ? t('common.save') : t('common.create')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default MedicineForm;
