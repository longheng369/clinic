import { IPrescriptionItemFormData } from '@/interfaces/IPrescription';
import React, { FC } from 'react'
import { useForm, useController } from 'react-hook-form';
import Input from '@/components/form/input';
import { Box, DialogActions, DialogContent, Grid, Button } from '@mui/material';
import Select from '@/components/form/select';

interface Props {
   onSave: (data: IPrescriptionItemFormData) => void;
   medicines: { id: number; name: string }[];
   defaultValues?: IPrescriptionItemFormData;
}

const routeOptions = [
   { label: 'Oral (PO)', value: 'PO' },
   { label: 'Intravenous (IV)', value: 'IV' },
   { label: 'Intramuscular (IM)', value: 'IM' },
   { label: 'Subcutaneous (SC)', value: 'SC' },
   { label: 'Topical', value: 'Topical' },
   { label: 'Sublingual', value: 'Sublingual' },
];

const unitList = [
   { id: 1, name: 'Tablet' },
   { id: 2, name: 'Capsule' },
   { id: 3, name: 'mL' },
   { id: 4, name: 'mg' },
   { id: 5, name: 'g' },
];

const PrescriptionItemForm: FC<Props> = ({
   onSave,
   medicines,
   defaultValues,
}) => {
   const { control, handleSubmit } = useForm<IPrescriptionItemFormData>({
      defaultValues: defaultValues ?? {
         quantity: 0,
         morning: 0,
         afternoon: 0,
         evening: 0,
         night: 0,
         numberOfDay: 0,
      },
   });

   return (
      <Box component='form' onSubmit={() => handleSubmit(onSave)} noValidate sx={{ borderTop: 1, borderColor: 'divider' }}>
         <DialogContent>
            <Grid container spacing={3}>
               <Grid size={{ md: 6 }}>
                  <Select control={control} name='medicine' label='Medicine' options={medicines.map((opt) => ({ label: opt.name, value: opt }))} rules={{ required: 'Medicine is required' }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select control={control} name="route" label="Route" options={routeOptions} rules={{ required: 'Route is required' }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select control={control} name="unit" label="Unit" options={unitList.map((opt) => ({ label: opt.name, value: opt }))} rules={{ required: 'Unit is required' }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="quantity" label="Quantity" type="number" rules={{ required: 'Quantity is required', min: { value: 1, message: 'Min 1' } }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="morning" label="Morning" type="number" />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="afternoon" label="Afternoon" type="number" />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="evening" label="Evening" type="number" />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="night" label="Night" type="number" />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="numberOfDay" label="Number of Days" type="number" />
               </Grid>
               <Grid size={{ md: 12 }}>
                  <Input control={control} name="notes" label="Notes" />
               </Grid>
            </Grid>
         </DialogContent>
         <DialogActions>
            <Button type="submit" variant='contained'>Add Medicine</Button>
         </DialogActions>
      </Box>
   )
}

export default PrescriptionItemForm
