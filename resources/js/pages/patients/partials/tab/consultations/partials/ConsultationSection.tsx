import { useController, type Control, type Path } from 'react-hook-form'
import Input from '@/components/form/input'
import ConsultationCheckboxGroup from './ConsultationCheckboxGroup'
import { type OptionType } from '../consultationTemplate'
import { IConsultationFormData } from '@/interfaces/IConsultation'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

type SectionProps = {
   title: string
   name: keyof IConsultationFormData & string
   options: OptionType[]
   control: Control<IConsultationFormData>
   disabled?: boolean
}

const OTHER_FIELD_MAP: Record<string, string> = {
   respiratory_system_symptoms: 'respiratory_system_others_note',
   cardiovascular_symptoms: 'cardiovascular_others_note',
   neurological_symptoms: 'neurological_others_note',
   musculoskeletal_symptoms: 'musculoskeletal_others_note',
   digestive_symptoms: 'digestive_others_note',
   renal_reproductive_symptoms: 'renal_reproductive_others_note',
   skin_symptoms: 'skin_others_note',
   eye_symptoms: 'eye_others_note',
   ear_symptoms: 'ear_others_note',
   nose_symptoms: 'nose_others_note',
   throat_symptoms: 'throat_others_note',
   psycology_symptoms: 'psycology_others_note',
}

const NormalCheckbox = ({ control, name, othersName, disabled }: { control: Control<IConsultationFormData>; name: Path<IConsultationFormData>; othersName: Path<IConsultationFormData>; disabled?: boolean }) => {
   const { field } = useController({ control, name })
   const { field: othersField } = useController({ control, name: othersName })
   const value: string[] = Array.isArray(field.value) ? field.value : []
   const isNormal = value.includes('NORMAL')

   return (
      <FormControlLabel
         control={
            <Checkbox
               checked={isNormal}
               disabled={disabled}
               onChange={() => {
                  field.onChange(isNormal ? [] : ['NORMAL'])
                  if (!isNormal) othersField.onChange('')
               }}
               size="small"
            />
         }
         label={<span className="text-sm">Normal</span>}
         sx={{ m: 0 }}
      />
   )
}

const ConsultationSection = ({ title, name, options, control, disabled }: SectionProps) => {
   const restOptions = options.filter((o) => o.value !== 'NORMAL')
   const othersName = OTHER_FIELD_MAP[name] as Path<IConsultationFormData>

   return (
      <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>{title}</Typography>
            <NormalCheckbox control={control} name={name as Path<IConsultationFormData>} othersName={othersName} disabled={disabled} />
         </Box>
         <ConsultationCheckboxGroup
            control={control}
            name={name as Path<IConsultationFormData>}
            options={restOptions}
            disabled={disabled}
         />
         <Input
            control={control}
            name={othersName}
            label="Others"
            placeholder="Specify other symptoms..."
            disabled={disabled}
         />
      </Box>
   )
}

export default ConsultationSection
