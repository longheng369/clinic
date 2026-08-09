import { usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Save, Stethoscope } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { IPrescription, IPrescriptionFormData } from '@/interfaces/IPrescription'
import { IPatient } from '@/interfaces/IPatient'
import MedicineItemForm from './partials/prescriptionItemForm'
import { formatDob } from '@/utils/date'
import { useFieldArray, useForm } from 'react-hook-form'
import { useToast } from '@/components/toast'
import {
   Box,
   Button,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
} from '@mui/material'
import { IVisitWithMetaData } from '@/interfaces/IVisit'

const getFrequency = (item: IPrescriptionFormData['items'][number]) => {
   const doseCount = [item.morning, item.afternoon, item.evening, item.night]
      .filter((dose) => Number(dose) > 0)
      .length

   return (['QD', 'BID', 'TID', 'QID'][Math.min(doseCount, 4) - 1] ?? 'QD')
}

type Props = {
   patient: IPatient;
   selectedVisit: IVisitWithMetaData | null;
   prescription: IPrescription | null;
}

const PrescriptionTab = ({
   patient,
   selectedVisit,
   prescription,
}: Props) => {
   const { openModal, closeModal } = useModal()
   const { toast } = useToast()
   const [isSaving, setIsSaving] = useState(false)
   const { medicines, units } = usePage<{
      medicines: { id: number; name: string }[]
      units: { id: number; name: string }[]
   }>().props
   const prescriptionItems = useMemo<IPrescriptionFormData['items']>(() => (
      prescription?.items.map((item) => ({
         medicine: medicines.find((medicine) => medicine.id === item.medicine?.id) ?? item.medicine ?? { id: 0, name: '' },
         quantity: item.quantity ?? 0,
         unit: units.find((unit) => unit.name === item.unit) ?? { id: 0, name: item.unit },
         route: item.route,
         morning: null,
         afternoon: null,
         evening: null,
         night: null,
         numberOfDay: item.duration_days ?? 0,
         notes: item.notes,
      })) ?? []
   ), [medicines, prescription, units]);

   const { control, reset } = useForm<IPrescriptionFormData>({
      defaultValues: { items: prescriptionItems },
   });
   const { fields, append, update } = useFieldArray({
      control,
      name: 'items'
   });

   useEffect(() => {
      reset({ items: prescriptionItems });
   }, [prescriptionItems, reset]);

   const availableMedicineOptions = useMemo(() => {
      const existingMedicineIds = new Set(fields.map((field) => field.medicine?.id));
      return medicines.filter((medicine) => !existingMedicineIds.has(medicine.id));
   }, [medicines, fields]);

   const openAddModal = () => {
      openModal({
         title: 'Add Medicine',
         content: (
            <MedicineItemForm
               medicines={availableMedicineOptions}
               units={units}
               onSave={(data) => {
                  append(data);
                  closeModal();
               }}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const openEditModal = (index: number) => {
      const item = fields[index];
      openModal({
         title: 'Edit Medicine',
         content: (
            <MedicineItemForm
               medicines={medicines}
               units={units}
               defaultValues={item}
               onSave={(data) => {
                  update(index, data);
                  closeModal();
               }}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const savePrescription = () => {
      if (!selectedVisit || fields.length === 0) {
         return
      }

      const hasInvalidItem = fields.some((item) => !item.medicine?.id || !item.unit?.name)
      if (hasInvalidItem) {
         toast('Each medicine must have a medicine and unit selected.', { variant: 'error' })
         return
      }

      const payload = {
         visit_id: selectedVisit.id,
         notes: prescription?.notes ?? null,
         items: fields.map((item) => ({
            medicine_id: item.medicine.id,
            route: item.route,
            dosage: Math.max(
               Number(item.morning) || 0,
               Number(item.afternoon) || 0,
               Number(item.evening) || 0,
               Number(item.night) || 0,
            ),
            unit: item.unit.name,
            frequency: getFrequency(item),
            duration_days: item.numberOfDay > 0 ? item.numberOfDay : null,
            quantity: item.quantity ?? null,
            notes: item.notes ?? null,
         })),
      }

      setIsSaving(true)
      const options = {
         onSuccess: () => {
            toast(prescription ? 'Prescription updated.' : 'Prescription saved.', { variant: 'success' })
         },
         onError: () => {
            toast('Unable to save prescription.', { variant: 'error' })
         },
         onFinish: () => setIsSaving(false),
      }

      if (prescription) {
         router.put(`/patients/${patient.id}/prescriptions/${prescription.id}`, payload, options)
      } else {
         router.post(`/patients/${patient.id}/prescriptions`, payload, options)
      }
   }

   if (!selectedVisit) {
      return (
         <Box sx={{}}>
            <Typography component="h3" sx={{}}>
               Prescriptions
            </Typography>
            <Typography component="p" sx={{ mt: 0.5 }}>
               Select a visit to manage prescriptions.
            </Typography>
         </Box>
      )
   }

   if (!prescription && fields.length === 0) {
      return (
         <Box
            sx={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               py: 8,
               textAlign: 'center',
            }}
         >
            <Typography>
               No Prescription
            </Typography>

            <Typography
               component="p"
               sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                  mb: 3,
               }}
            >
               This visit doesn&apos;t have a prescription yet.
            </Typography>

            <Button
               variant="contained"
               onClick={openAddModal}
               startIcon={<Plus size={16} />}
            >
               Start Prescription
            </Button>
         </Box>
      );
   }

   return (
      <Box
         sx={{
            border: 1,
            borderColor: 'divider',
            position: 'relative',
            p: 4
         }}
      >
         <Typography sx={{ fontFamily: 'var(--font-khmer-moul)', color: 'blue', textAlign: 'center', letterSpacing: 1 }}>ព្រះរាជាណាចក្រកម្ពុជា</Typography>
         <Typography sx={{ fontFamily: 'var(--font-khmer-moul)', color: 'blue', textAlign: 'center', letterSpacing: 1, mt: 0.5 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</Typography>

         <Box
            sx={{
               position: 'absolute',
               top: 32,
               left: 32,
               display: 'flex',
               width: 80,
               height: 80,
               alignItems: 'center',
               justifyContent: 'center',
               flexShrink: 0,
               borderRadius: '50%',
               background: 'linear-gradient(135deg, #5a8f5a, #3d633d)',
            }}
         >
            <Stethoscope size={30} color="#fff" />
         </Box>

         <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)' }}>
                      កាលបរិច្ឆេទ <Typography component='span'>: {formatDob(prescription?.created_at ?? new Date().toISOString())}</Typography>
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)' }}>
                      វេជ្ជបណ្ឌិត <Typography component='span'>: {prescription?.recorded_by ?? '—'}</Typography>
                  </Typography>
               </Box>
               <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant='contained' startIcon={<Save size={16} />} onClick={savePrescription} disabled={isSaving}>
                     Save
                  </Button>
                  <Button onClick={openAddModal} variant='contained' color='info' startIcon={<Plus size={16} />}>
                     Add Medicine
                  </Button>
               </Box>
            </Box>
         </Box>

         {/* Patient Info */}
         <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 2 }}>
            <Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ឈ្មោះ
                  </Typography>
                  <Typography component="p" sx={{ fontFamily: 'var(--font-khmer)' }}>
                     {patient.khmer_first_name} {patient.khmer_last_name}
                     {patient.first_name && (
                        <Typography component="span" sx={{ ml: 0.5 }}>
                           ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
                        </Typography>
                     )}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     អាយុ
                  </Typography>
                  <Typography component="p" sx={{ mt: 0.5 }}>
                     {formatDob(patient.date_of_birth)}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ភេទ
                  </Typography>
                  <Typography component="p" sx={{ mt: 0.5 }}>
                     {patient.gender}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ទូរស័ព្ទ
                  </Typography>
                  <Typography component="p" sx={{ mt: 0.5 }}>
                     {patient.phone_number}
                  </Typography>
               </Box>
            </Box>
         </Box>

         {/* Medicine Table */}
         <Box>
            {fields.length === 0 ? (
               <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No medicines in this prescription.
               </Box>
            ) : (
               <TableContainer sx={{ mt: 2 }}>
                  <Table
                     sx={{
                        borderCollapse: 'collapse',
                        '& .MuiTableCell-root': {
                           border: 1,
                           borderColor: 'divider',
                        }
                     }}
                  >
                     <TableHead
                        sx={{
                           '& .MuiTableCell-root': {
                              fontFamily: 'var(--font-khmer)',
                              border: 1,
                              borderColor: 'divider',
                           }
                        }}
                     >
                        <TableRow
                           sx={{
                              border: 1,
                              borderColor: 'divider',
                              '& .MuiTableCell-root': {
                                 fontWeight: 'bold',
                              }
                           }}
                        >
                           <TableCell width='5%' align='center'>
                              ល.រ
                           </TableCell>
                           <TableCell width='20%'>
                              ឈ្មោះថ្នាំ
                           </TableCell>
                           <TableCell width='10%'>
                              ចំនួន
                           </TableCell>
                           <TableCell width='30%'>
                              ការប្រើប្រាស់
                           </TableCell>
                           <TableCell width='10%'>
                              ចំនួនថ្ងៃ
                           </TableCell>
                           <TableCell width='25%'>
                              កំណត់ចំណាំ
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {fields.map((field, index) => (
                           <TableRow
                              key={field.id}
                              sx={{
                                 cursor: 'pointer', transition: 'background-color 0.2s ease',
                                 '&:hover': {
                                    bgcolor: 'action.hover',
                                 },
                              }}
                              onClick={() => openEditModal(index)}
                           >
                              <TableCell align='center'>{index + 1}</TableCell>
                              <TableCell>{field.medicine?.name}</TableCell>
                              <TableCell>{field.quantity} {field.unit?.name}</TableCell>
                              <TableCell>{field.route} {field.morning && `ព្រឹក ${field.morning}គ្រាប់`} {field.morning && `រសៀល ${field.afternoon}គ្រាប់`} {field.morning && `ល្ងាច ${field.evening}គ្រាប់`} {field.morning && `យប់ ${field.night}គ្រាប់`}</TableCell>
                              <TableCell>{field.numberOfDay}</TableCell>
                              <TableCell>{field.notes}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            )}
         </Box>
      </Box>
   )
}

export default PrescriptionTab
