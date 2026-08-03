import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import DateInput from '@/components/form/date'
import { IPatient, IPatientFormData } from '@/interfaces/IPatient';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast'
import { DialogActions, DialogContent, Grid, Box, Button } from '@mui/material'
import { useModal } from '@/components/modal';

const BLOOD_GROUPS = [
   { value: 'A+', label: 'A+' },
   { value: 'A-', label: 'A-' },
   { value: 'B+', label: 'B+' },
   { value: 'B-', label: 'B-' },
   { value: 'AB+', label: 'AB+' },
   { value: 'AB-', label: 'AB-' },
   { value: 'O+', label: 'O+' },
   { value: 'O-', label: 'O-' },
]

const KHMER_FONT = "'Battambang', 'Serey', 'Khmer OS', 'Noto Sans Khmer', sans-serif"

interface PatientFormProps {
   patient?: IPatient;
}

const PatientForm = ({ patient }: PatientFormProps) => {
   const { closeModal } = useModal()
   const [isProcessing, setIsProcessing] = useState(false);
   const { toast } = useToast()
   const { control, handleSubmit } = useForm<IPatientFormData>({
      defaultValues: patient ?? {
         khmer_first_name: '',
         khmer_last_name: '',
         first_name: '',
         last_name: '',
         date_of_birth: '',
         address: null,
         blood_group: null,
         phone_number: '',
         gender: 'male',
         allergy: '',
         national_id: '',
      }
   });

   const onSubmit = handleSubmit((data) => {
      setIsProcessing(true);
      if (patient) {
         router.put(`/patients/${patient.id}`, { ...data }, {
            onSuccess: () => {
               closeModal();
               toast('Patient updated successfully!', { variant: 'success', description: 'The patient has been updated.' });
            },
            onFinish: () => {
               setIsProcessing(false);
            },
         });

         return;
      }

      router.post('/patients', { ...data }, {
         onSuccess: () => {
            closeModal();
            toast('Patient created successfully!', { variant: 'success', description: 'The patient has been created.' })
         },
         onFinish: () => {
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
                     name="khmer_first_name"
                     label="Khmer First Name"
                     sx={{ fontFamily: KHMER_FONT }}
                     slotProps={{ htmlInput: { spellCheck: false } }}
                     rules={{
                        required: 'This field is required',
                        pattern: {
                           value: /^[\u1780-\u17FF\s]+$/,
                           message: "Only Khmer characters are allowed",
                        },
                     }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="khmer_last_name"
                     label="Khmer Last Name"
                     sx={{ fontFamily: KHMER_FONT }}
                     slotProps={{ htmlInput: { spellCheck: false } }}
                     rules={{
                        required: 'This field is required',
                        pattern: {
                           value: /^[\u1780-\u17FF\s]+$/,
                           message: "Only Khmer characters are allowed",
                        },
                     }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="first_name"
                     label="First Name (English)"
                     slotProps={{ htmlInput: { spellCheck: false } }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="last_name"
                     label="Last Name (English)"
                     slotProps={{ htmlInput: { spellCheck: false } }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <DateInput
                     control={control}
                     name="date_of_birth"
                     label="Date of Birth"
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="phone_number"
                     label="Phone Number"
                     rules={{ required: 'This field is required' }}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name="gender"
                     label="Gender"
                     rules={{ required: 'This field is required' }}
                     options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                     ]}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Select
                     control={control}
                     name="blood_group"
                     label="Blood Group"
                     options={BLOOD_GROUPS}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="national_id"
                     label="National ID"
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <Input
                     control={control}
                     name="address"
                     label="Address"
                  />
               </Grid>
               <Grid size={{ md: 12 }}>
                  <Input
                     control={control}
                     name="allergy"
                     label="Allergy"
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
               {patient ? "Save" : "Create"}
            </Button>
         </DialogActions>
      </Box>
   )
}

export default PatientForm
