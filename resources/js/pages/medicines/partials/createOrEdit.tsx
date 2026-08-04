import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { IMedicine, IMedicineFormData, MEDICINE_TYPES } from '@/interfaces/IMedicine';
import { IUnit } from '@/interfaces/IUnit';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast'
import { DialogActions, DialogContent, Grid, Box, Button } from '@mui/material'
import { useModal } from '@/components/modal';

interface CategoryOption {
   value: number
   label: string
}

interface MedicineFormProps {
   medicine?: IMedicine;
   units: IUnit[];
}

const MedicineForm = ({ medicine, units }: MedicineFormProps) => {
   const { closeModal } = useModal()
   const [isProcessing, setIsProcessing] = useState(false);
   const [categories, setCategories] = useState<CategoryOption[]>([]);
   const [categoriesLoading, setCategoriesLoading] = useState(true);
   const { toast } = useToast()
   const { control, handleSubmit } = useForm<IMedicineFormData>({
      defaultValues: medicine ?? {
         name: '',
         type: undefined,
         description: '',
         dosage: '',
         category_id: null,
         unit_id: null,
         unit_price: null,
      }
   });

   useEffect(() => {
      setCategoriesLoading(true)
      fetch('/api/categories')
         .then((res) => {
            if (!res.ok) throw new Error('Failed to load categories')
            return res.json()
         })
         .then((data: { id: number; name: string }[]) => {
            setCategories(data.map((item) => ({ value: item.id, label: item.name })))
         })
         .catch(() => {
            toast('Failed to load categories', { variant: 'error' })
         })
         .finally(() => setCategoriesLoading(false))
   }, [])

   const onSubmit = handleSubmit((data) => {
      setIsProcessing(true);
      if (medicine) {
         router.put(`/medicines/${medicine.id}`, { ...data }, {
            onSuccess: () => {
               toast('Medicine updated successfully!', { variant: 'success', description: 'The medicine has been updated.' });
            },
            onFinish: () => {
               closeModal();
               setIsProcessing(false);
            },
         });

         return;
      }

      router.post('/medicines', { ...data }, {
         onSuccess: () => {
            toast('Medicine created successfully!', { variant: 'success', description: 'The medicine has been created.' })
         },
         onError: (errors) => {
            if (errors.name) {
               toast('Unable to create medicine', {
                  variant: 'error',
                  description: errors.name,
               });
            }
         },
         onFinish: () => {
            closeModal();
            setIsProcessing(false);
         },
      })
   })

   return (
      <Box component="form" onSubmit={onSubmit} noValidate>
         <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={3}>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name='name'
                     label="Name"
                     sx={{
                        fontFamily: 'Poppins'
                     }}
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name='type'
                     label="Type"
                     options={MEDICINE_TYPES}
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name='category_id'
                     label="Category"
                     options={categories}
                     disabled={categoriesLoading}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name='unit_id'
                     label="Unit"
                     options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
                     rules={{ required: 'Please select unit' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name='dosage'
                     label="Dosage"
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name='unit_price'
                     label="Unit Price"
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 12 }}>
                  <Input
                     control={control}
                     name='description'
                     label="Description"
                  />
               </Grid>
            </Grid>
         </DialogContent>
         <DialogActions>
            <Button
               type="button"
               onClick={() => closeModal()}
               variant="outlined"
            >
               Cancel
            </Button>
            <Button
               type="submit"
               disabled={isProcessing}
               variant='contained'
            >
               {medicine ? "Save" : "Create"}
            </Button>
         </DialogActions>
      </Box>
   )
}

export default MedicineForm
