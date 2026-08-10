import { IPrescriptionItemFormData } from '@/interfaces/IPrescription';
import { FC } from 'react'
import { useForm } from 'react-hook-form';
import Input from '@/components/form/input';
import { Box, DialogActions, DialogContent, Grid, Button } from '@mui/material';
import Select from '@/components/form/select';
import { MEDICINE_INSTRUCTION } from '@/config/prescription';
import Autocomplete from '@/components/form/autocomplete';

interface Props {
   onSave: (data: IPrescriptionItemFormData) => void;
   medicines: { id: number; name: string }[];
   units: { id: number; name: string }[];
   defaultValues?: IPrescriptionItemFormData;
}

type PrescriptionItemFormValues = Omit<IPrescriptionItemFormData, 'medicine' | 'unit' | 'instruction'> & {
   medicine: number | '';
   unit: number | '';
   instruction: string | null;
};

const toNullableNumber = (value: unknown): number | null => {
   if (value === null || value === undefined || value === '') return null

   const number = Number(value)
   return Number.isFinite(number) ? number : null
}

const routeOptions = [
   { label: 'Oral (PO)', value: 'PO' },
   { label: 'Intravenous (IV)', value: 'IV' },
   { label: 'Intramuscular (IM)', value: 'IM' },
   { label: 'Subcutaneous (SC)', value: 'SC' },
   { label: 'Topical', value: 'Topical' },
   { label: 'Sublingual', value: 'Sublingual' },
];

const PrescriptionItemForm: FC<Props> = ({
   onSave,
   medicines,
   units,
   defaultValues,
}) => {
   const { control, handleSubmit } = useForm<PrescriptionItemFormValues>({
      defaultValues: defaultValues
         ? {
            ...defaultValues,
            medicine: defaultValues.medicine?.id ?? '',
            unit: defaultValues.unit?.id ?? '',
            instruction: defaultValues.instruction?.value ?? null,
         }
         : {
            medicine: '',
            unit: '',
            route: '',
            notes: null,
            quantity: null,
            morning: null,
            afternoon: null,
            evening: null,
            night: null,
            numberOfDay: null,
            instruction: null,
         },
   });

   const onSubmit = (values: PrescriptionItemFormValues) => {
      const medicine = medicines.find((option) => option.id === values.medicine);
      const unit = units.find((option) => option.id === values.unit);
      const instruction = MEDICINE_INSTRUCTION.find((opt) => opt.value === values.instruction) ?? null;

      if (!medicine || !unit) {
         return;
      }

      onSave({
         ...values,
         medicine,
         unit,
         instruction,
         quantity: toNullableNumber(values.quantity),
         morning: toNullableNumber(values.morning),
         afternoon: toNullableNumber(values.afternoon),
         evening: toNullableNumber(values.evening),
         night: toNullableNumber(values.night),
         numberOfDay: toNullableNumber(values.numberOfDay),
      });
   };

   return (
      <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ borderTop: 1, borderColor: 'divider' }}>
         <DialogContent>
            <Grid container spacing={3}>
               <Grid size={{ md: 6 }}>
                  <Select control={control} name='medicine' label='Medicine' options={medicines.map((medicine) => ({ label: medicine.name, value: medicine.id }))} rules={{ required: 'Medicine is required' }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select control={control} name="route" label="Route" options={routeOptions} rules={{ required: 'Route is required' }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="quantity" label="Quantity" type="number" rules={{ required: 'Quantity is required', min: { value: 1, message: 'Min 1' }, valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name="unit"
                     label="Unit"
                     options={units.map((unit) => ({ label: unit.name, value: unit.id }))}
                     rules={{ required: 'Unit is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="morning" label="Morning" type="number" rules={{ valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="afternoon" label="Afternoon" type="number" rules={{ valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="evening" label="Evening" type="number" rules={{ valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="night" label="Night" type="number" rules={{ valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input control={control} name="numberOfDay" label="Number of Days" type="number" rules={{ valueAsNumber: true }} />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Autocomplete
                     control={control}
                     name="instruction"
                     label="Instruction"
                     options={MEDICINE_INSTRUCTION}
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 12 }}>
                  <Input control={control} name="notes" label="Notes" />
               </Grid>
            </Grid>
         </DialogContent>
         <DialogActions>
            <Button type="submit" variant="contained">
               {defaultValues ? "Save" : "Add"}
            </Button>
         </DialogActions>
      </Box>
   )
}

export default PrescriptionItemForm
