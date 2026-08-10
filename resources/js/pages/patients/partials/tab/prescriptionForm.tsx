import { Box } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import Select from '@/components/form/select-deprecated'
import Input from '@/components/form/input-deprecated'
import Textarea from '@/components/form/textarea'
import { IPrescription } from '@/interfaces/IPrescription'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { Plus, Trash2 } from 'lucide-react'

const ROUTE_OPTIONS = [
   { value: 'PO', label: 'PO' },
   { value: 'IV', label: 'IV' },
   { value: 'IM', label: 'IM' },
   { value: 'SC', label: 'SC' },
   { value: 'SL', label: 'SL' },
   { value: 'PR', label: 'PR' },
   { value: 'Topical', label: 'Topical' },
   { value: 'Inhalation', label: 'Inhale' },
   { value: 'Otic', label: 'Otic' },
   { value: 'Ophthalmic', label: 'Ophth' },
]

const FREQUENCY_OPTIONS = [
   { value: 'QD', label: 'QD' },
   { value: 'BID', label: 'BID' },
   { value: 'TID', label: 'TID' },
   { value: 'QID', label: 'QID' },
   { value: 'QHS', label: 'QHS' },
   { value: 'PRN', label: 'PRN' },
]

interface PrescriptionFormProps {
    patientId: number
    activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
    medicines: { id: number; name: string }[]
    prescription?: IPrescription
    selectedVisitId?: number
    onClose: () => void
}

type PrescriptionFormValues = { visit_id: number; notes: string | null; items: { medicine_id: number | null; route: string; dosage: number | null; unit: string; frequency: string; number_of_day: number | null; quantity: number | null; notes: string | null }[] }

const emptyItem = () => ({
   medicine_id: null,
   route: 'PO',
   dosage: null,
   unit: '',
   frequency: 'QD',
   number_of_day: null,
   quantity: null,
   notes: null,
})

const PrescriptionForm = ({ patientId, activeVisits, medicines, prescription, selectedVisitId, onClose }: PrescriptionFormProps) => {
   const [isProcessing, setIsProcessing] = useState(false)
   const { toast } = useToast()

   const { control, handleSubmit } = useForm<PrescriptionFormValues>({
      defaultValues: prescription
         ? {
            visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
            notes: prescription.notes ?? '',
            items: prescription.items.map((i) => ({
               medicine_id: i.medicine?.id ?? null,
               route: i.route,
               dosage: i.dosage,
               unit: i.unit,
               frequency: i.frequency,
                number_of_day: i.number_of_day,
               quantity: i.quantity,
               notes: i.notes,
            })),
         }
         : {
            visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
            notes: '',
            items: [emptyItem()],
         },
   })

   const { fields, append, remove } = useFieldArray({ control, name: 'items' })

   const medicineOptions = medicines.map((m) => ({ value: m.id, label: m.name }))

   const visitOptions = activeVisits.map((v) => ({
      value: v.id,
      label: `${v.type} — ${new Date(v.visit_date).toLocaleDateString()}`,
   }))

   const onSubmit = handleSubmit((data) => {
      setIsProcessing(true)

      const payload = data as any

      if (prescription) {
         router.put(`/patients/${patientId}/prescriptions/${prescription.id}`, payload, {
            onSuccess: () => {
               onClose()
               toast('Prescription updated!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
         })
      } else {
         router.post(`/patients/${patientId}/prescriptions`, payload, {
            onSuccess: () => {
               onClose()
               toast('Prescription created!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
         })
      }
   })

   return (
      <form onSubmit={onSubmit} noValidate>
         <Box>
            {visitOptions.length > 1 && (
               <Box>
                  <Select
                     label="Visit"
                     control={control}
                     name="visit_id"
                     options={visitOptions}
                     rules={{ required: 'This field is required' }}
                  />
               </Box>
            )}

            <Box>
               <Box>
                  <Box>Medicines</Box>
                  <Button
                     type="button"
                     variant="outline"
                     size="xs"
                     onClick={() => append(emptyItem())}
                  >
                     <Plus size={14} /> Add Medicine
                  </Button>
               </Box>

               <Box>
                  <table>
                     <thead>
                        <tr>
                           <th>Medicine</th>
                           <th>Route</th>
                           <th>Freq</th>
                           <th>Dosage</th>
                           <th>Unit</th>
                           <th>Duration</th>
                           <th>Qty</th>
                           <th>Notes</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {fields.map((field, index) => (
                           <tr key={field.id}>
                              <td>
                                 <Select
                                    control={control}
                                    name={`items.${index}.medicine_id`}
                                    options={medicineOptions}
                                    rules={{ required: true }}
                                    placeholder="Select medicine..."
                                 />
                              </td>
                              <td>
                                 <Select
                                    control={control}
                                    name={`items.${index}.route`}
                                    options={ROUTE_OPTIONS}
                                    rules={{ required: true }}
                                 />
                              </td>
                              <td>
                                 <Select
                                    control={control}
                                    name={`items.${index}.frequency`}
                                    options={FREQUENCY_OPTIONS}
                                    rules={{ required: true }}
                                    compact
                                 />
                              </td>
                              <td>
                                 <Input
                                    control={control}
                                    type="number"


                                    name={`items.${index}.dosage`}
                                    rules={{ required: true }}
                                    placeholder="0"
                                 />
                              </td>
                              <td>
                                 <Input
                                    control={control}
                                    type="text"
                                    name={`items.${index}.unit`}
                                    rules={{ required: true }}
                                    placeholder="mg"
                                 />
                              </td>
                              <td>
                                 <Input
                                    control={control}
                                    type="number"

                                     name={`items.${index}.number_of_day`}
                                    placeholder="7"
                                 />
                              </td>
                              <td>
                                 <Input
                                    control={control}
                                    type="number"


                                    name={`items.${index}.quantity`}
                                    placeholder="0"
                                 />
                              </td>
                              <td>
                                 <Input
                                    control={control}
                                    type="text"
                                    name={`items.${index}.notes`}
                                    placeholder="..."
                                 />
                              </td>
                              <td>
                                 {fields.length > 1 && (
                                    <button
                                       type="button"
                                       onClick={() => remove(index)}
                                    >
                                       <Trash2 size={14} />
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </Box>

               {fields.length === 0 && (
                  <Box>
                            No medicines added. Click &quot;Add Medicine&quot; to begin.
                  </Box>
               )}
            </Box>

            <Textarea
               label="General Notes"
               control={control}
               name="notes"
               placeholder="Optional general notes for this prescription..."
            />
         </Box>

         <Box>
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" disabled={isProcessing}>
               {prescription ? 'Update' : 'Create Prescription'}
            </Button>
         </Box>
      </form>
   )
}

export default PrescriptionForm
