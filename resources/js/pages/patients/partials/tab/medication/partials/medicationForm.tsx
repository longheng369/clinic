import { Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import NumberInput from '@/components/form/number'
import Select from '@/components/form/select'
import { IMedicationAdministration, IMedicationFormData } from '@/interfaces/IMedicationAdministration'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'

const ROUTE_OPTIONS = [
   { value: 'PO', label: 'PO (Oral)' },
   { value: 'IV', label: 'IV (Intravenous)' },
   { value: 'IM', label: 'IM (Intramuscular)' },
   { value: 'SC', label: 'SC (Subcutaneous)' },
   { value: 'SL', label: 'SL (Sublingual)' },
   { value: 'PR', label: 'PR (Rectal)' },
   { value: 'Topical', label: 'Topical' },
   { value: 'Inhalation', label: 'Inhalation' },
   { value: 'Otic', label: 'Otic (Ear)' },
   { value: 'Ophthalmic', label: 'Ophthalmic (Eye)' },
]

const INTERVAL_OPTIONS = [
   { value: 'QD', label: 'QD (Once daily)' },
   { value: 'BID', label: 'BID (Twice daily)' },
   { value: 'TID', label: 'TID (Three times daily)' },
   { value: 'QID', label: 'QID (Four times daily)' },
   { value: 'QHS', label: 'QHS (At bedtime)' },
   { value: 'PRN', label: 'PRN (As needed)' },
]

interface MedicationFormProps {
   patientId: number
   activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
   medicines: { id: number; name: string }[]
   medication?: IMedicationAdministration
   selectedVisitId?: number
   onClose: () => void
}

const MedicationForm = ({ patientId, activeVisits, medicines, medication, selectedVisitId, onClose }: MedicationFormProps) => {
   const [isProcessing, setIsProcessing] = useState(false)
   const { toast } = useToast()

   const now = new Date()
   now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
   const defaultStartsAt = now.toISOString().slice(0, 16)

   const getStartsAtValue = () => {
      if (medication?.starts_at) {
         const d = new Date(medication.starts_at)
         d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
         return d.toISOString().slice(0, 16)
      }
      return defaultStartsAt
   }

   const { control, handleSubmit } = useForm<IMedicationFormData>({
      defaultValues: medication
         ? {
            visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
            medicine_id: medication.medicine?.id ?? null,
            route: medication.route,
            dosage: medication.dosage,
            unit: medication.unit,
            interval: medication.interval,
            duration: medication.duration,
            starts_at: getStartsAtValue(),
            notes: medication.notes ?? '',
         }
         : {
            visit_id: selectedVisitId ?? activeVisits[0]?.id ?? 0,
            medicine_id: null,
            route: '',
            dosage: null,
            unit: '',
            interval: '',
            duration: null,
            starts_at: defaultStartsAt,
            notes: '',
         },
   })

   const medicineOptions = medicines.map((m) => ({ value: m.id, label: m.name }))

   const visitOptions = activeVisits.map((v) => ({
      value: v.id,
      label: `${v.type} — ${new Date(v.visit_date).toLocaleDateString()}`,
   }))

   const onSubmit = handleSubmit((data) => {
      setIsProcessing(true)

      if (medication) {
         router.put(`/patients/${patientId}/medications/${medication.id}`, { ...data }, {
            onSuccess: () => {
               onClose()
               toast('Medication updated!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
         })
      } else {
         router.post(`/patients/${patientId}/medications`, { ...data }, {
            onSuccess: () => {
               onClose()
               toast('Added to drug chart!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
         })
      }
   })

   return (
      <form onSubmit={onSubmit} noValidate>
         <Box>
            {visitOptions.length > 1 && (
               <Select
                  label="Visit"
                  control={control}
                  name="visit_id"
                  options={visitOptions}
                  rules={{ required: 'This field is required' }}
               />
            )}

            <Select
               label="Medicine"
               control={control}
               name="medicine_id"
               options={medicineOptions}
               rules={{ required: 'This field is required' }}
            />

            <Box>
               <Select
                  label="Route"
                  control={control}
                  name="route"
                  options={ROUTE_OPTIONS}
                  rules={{ required: 'This field is required' }}
               />
               <Select
                  label="Interval"
                  control={control}
                  name="interval"
                  options={INTERVAL_OPTIONS}
                  rules={{ required: 'This field is required' }}
               />
            </Box>

            <Box>
               <NumberInput
                  label="Dosage"
                  control={control}
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  placeholder="e.g. 500"
                  name="dosage"
                  rules={{ required: 'Required', min: { value: 0, message: 'Min 0' } }}
               />
               <Input
                  label="Unit"
                  control={control}
                  type="text"
                  placeholder="e.g. mg, g, ml"
                  name="unit"
                  rules={{ required: 'Required' }}
               />
            </Box>

            <Box>
               <NumberInput
                  label="Duration (total doses)"
                  control={control}
                  slotProps={{ htmlInput: { min: 1, max: 365 } }}
                  placeholder="e.g. 3"
                  name="duration"
                  rules={{ required: 'Required', min: { value: 1, message: 'Min 1' } }}
               />
               <Input
                  label="Start Date & Time"
                  control={control}
                  type="datetime-local"
                  name="starts_at"
                  rules={{ required: 'Required' }}
               />
            </Box>

            <Input
               label="Notes"
               control={control}
               name="notes"
               placeholder="Optional notes..."
               multiline
               rows={3}
            />
         </Box>

         <Box>
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit" disabled={isProcessing}>
               {medication ? 'Update' : 'Add to Drug Chart'}
            </Button>
         </Box>
      </form>
   )
}

export default MedicationForm
