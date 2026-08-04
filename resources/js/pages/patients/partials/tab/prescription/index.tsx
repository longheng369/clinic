import { usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Stethoscope } from 'lucide-react'
import { IPrescription, IPrescriptionFormData } from '@/interfaces/IPrescription'
import { IPatient } from '@/interfaces/IPatient'
import MedicineItemForm from './partials/prescriptionItemForm'
import { formatDob } from '@/utils/date'
import { useFieldArray, useForm } from 'react-hook-form'
import {
   Box,
   Button,
   Button as MuiButton,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
} from '@mui/material'

interface SelectedVisit {
   id: number
   type: string
   visit_date: string
   status: string
   recorded_by?: string
}

const PrescriptionTab = ({
   patient,
   selectedVisit,
   prescription,
}: {
   patient: IPatient
   selectedVisit: SelectedVisit | null
   prescription: IPrescription | null
}) => {
   const { openModal, closeModal } = useModal()
   const { medicines } = usePage<{ medicines: { id: number; name: string }[] }>().props
   console.log(medicines)
   const { control } = useForm<IPrescriptionFormData>();
   const { fields, append, update } = useFieldArray({
      control,
      name: 'items'
   });

   const openAddModal = () => {
      openModal({
         title: 'Add Medicine',
         content: (
            <MedicineItemForm
               medicines={medicines}
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

   if (!selectedVisit) {
      return (
         <Box className="flex flex-col items-center justify-center py-16 text-center">
            <Typography component="h3" className="text-lg font-semibold text-gray-900 mb-1">
               Prescriptions
            </Typography>
            <Typography component="p" className="text-sm text-gray-500">
               Select a visit to manage prescriptions.
            </Typography>
         </Box>
      )
   }

   if (!prescription) {
      return (
         <Box className="flex flex-col items-center justify-center py-16 text-center">
            <Typography component="h3" className="text-lg font-semibold text-gray-900 mb-1">
               No Prescription
            </Typography>
            <Typography component="p" className="text-sm text-gray-500 mb-6">
               This visit doesn&apos;t have a prescription yet.
            </Typography>
            <MuiButton variant="contained" onClick={openAddModal} startIcon={<Plus size={18} />} sx={{ textTransform: 'none' }}>
               Start Prescription
            </MuiButton>
         </Box>
      )
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

         <Box className='flex items-center justify-center size-20 rounded-full bg-linear-to-br from-primary-500 to-primary-700 shrink-0 absolute top-8 left-8'>
            <Stethoscope size={30} className='text-white' />
         </Box>

         <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)' }}>
                     កាលបរិច្ឆេទ <Typography component='span'>: {formatDob(prescription.created_at)}</Typography>
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)' }}>
                     វេជ្ជបណ្ឌិត <Typography component='span'>: {prescription.recorded_by ?? '—'}</Typography>
                  </Typography>
               </Box>
               <Button onClick={openAddModal} variant='contained' startIcon={<Plus size={16} />}>
                  Add Medicine
               </Button>
            </Box>
         </Box>

         {/* Patient Info */}
         <Box className="border border-gray-300 p-4 mt-4">
            <Box className="grid grid-cols-4">
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ឈ្មោះ
                  </Typography>
                  <Typography component="p" sx={{ fontFamily: 'var(--font-khmer)' }}>
                     {patient.khmer_last_name} {patient.khmer_first_name}
                     {patient.first_name && (
                        <Typography component="span" className="font-sans text-gray-500 text-xs ml-1.5">
                           ({patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name})
                        </Typography>
                     )}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     អាយុ
                  </Typography>
                  <Typography component="p" className="text-sm">
                     {formatDob(patient.date_of_birth)}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ភេទ
                  </Typography>
                  <Typography component="p" className="text-sm capitalize">
                     {patient.gender}
                  </Typography>
               </Box>
               <Box>
                  <Typography sx={{ fontFamily: 'var(--font-khmer)', color: 'gray' }}>
                     ទូរស័ព្ទ
                  </Typography>
                  <Typography component="p" className="text-sm">
                     {patient.phone_number}
                  </Typography>
               </Box>
            </Box>
         </Box>

         {/* Medicine Table */}
         <Box>
            {prescription.items.length === 0 ? (
               <Box className="py-10 text-center text-sm text-gray-400">
                  No medicines in this prescription.
               </Box>
            ) : (
               <TableContainer sx={{ mt: 2 }}>
                  <Table className="w-full text-base table-fixed border-collapse">
                     <TableHead>
                        <TableRow className="bg-blue-200 border border-blue-200 font-semibold font-khmer">
                           <TableCell component="th" scope="col" className="text-start px-2 py-4 w-[5%]">
                              ល.រ
                           </TableCell>
                           <TableCell component="th" scope="col" className="text-start w-[25%]">
                              ឈ្មោះថ្នាំ
                           </TableCell>
                           <TableCell component="th" scope="col" className="text-start w-[10%]">
                              ចំនួន
                           </TableCell>
                           <TableCell component="th" scope="col" className="text-start w-[20%]">
                              ការប្រើប្រាស់
                           </TableCell>
                           <TableCell component="th" scope="col" className="text-start w-[10%]">
                              ចំនួនថ្ងៃ
                           </TableCell>
                           <TableCell component="th" scope="col" className="text-start w-[30%]">
                              កំណត់ចំណាំ
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {fields.map((field, index) => (
                           <TableRow key={field.id} className="border border-gray-300 text-center cursor-pointer" onClick={() => openEditModal(index)}>
                              <TableCell className="px-2 py-4 text-start">{index + 1}</TableCell>
                              <TableCell className="py-4 text-start">{field.medicine?.name}</TableCell>
                              <TableCell className="py-4 text-start">{field.quantity} {field.unit?.name}</TableCell>
                              <TableCell className="px-2 py-4 text-start font-khmer">{field.route} {field.morning && `ព្រឹក ${field.morning}គ្រាប់`} {field.morning && `រសៀល ${field.afternoon}គ្រាប់`} {field.morning && `ល្ងាច ${field.evening}គ្រាប់`} {field.morning && `យប់ ${field.night}គ្រាប់`}</TableCell>
                              <TableCell className="px-2 py-4 text-start">{field.numberOfDay}</TableCell>
                              <TableCell className="px-2 py-4 text-start font-khmer">{field.notes}</TableCell>
                           </TableRow>
                        ))}
                        <TableRow>
                           <TableCell colSpan={6} className="px-2 py-4 text-center">
                              <MuiButton
                                 variant="contained"
                                 onClick={openAddModal}
                                 className="bg-linear-to-br from-primary-500 to-primary-700 !border-none text-white shadow-md shadow-primary-500/20 hover:from-primary-600 hover:to-primary-800"
                                 sx={{ textTransform: 'none' }}
                              >
                                 + Add medicine
                              </MuiButton>
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </TableContainer>
            )}
         </Box>
      </Box>
   )
}

export default PrescriptionTab
