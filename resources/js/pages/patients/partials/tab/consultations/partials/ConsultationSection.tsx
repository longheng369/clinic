import { useController, type Control, type Path } from 'react-hook-form'
import Input from '@/components/form/input'
import Checkbox from '@/components/form/checkbox'
import CheckboxGroup from '@/components/form/checkboxGroup'
import { type OptionType } from '../consultationTemplate'
import { IConsultationFormData } from '@/interfaces/IConsultation'
import { cn } from '@/utils/cn'
import { Box, Grid, Typography } from '@mui/material'

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

const ConsultationSection = ({ title, name, options, control, disabled }: SectionProps) => {
    const hasNormalOption = options.some((option) => option.value === 'NORMAL')
    const checkboxOptions = options
      .filter((option) => option.value !== 'NORMAL')
      .map((option) => ({
         value: option.value,
         colSpan: option.colSpan,
         text: option.text && (
            <span className={cn('text-base font-semibold text-gray-800', /[\u1780-\u17FF\u19E0-\u19FF]/.test(option.text) && 'font-khmer')}>
               {option.text}
            </span>
         ),
         label: option.label && (
            <span className={cn('text-base', /[\u1780-\u17FF\u19E0-\u19FF]/.test(option.label) && 'font-khmer')}>
               {option.label}
            </span>
            ),
        }))
    const othersName = OTHER_FIELD_MAP[name] as Path<IConsultationFormData>
    const { field: othersField } = useController({ control, name: othersName })

    return (
       <Grid size={12}>
          <Box>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: hasNormalOption ? 'space-between' : 'flex-start' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>{title}</Typography>
               {hasNormalOption && (
                  <Checkbox
                     control={control}
                     name={name as Path<IConsultationFormData>}
                     value="NORMAL"
                     exclusive
                     disabled={disabled}
                     label={<span className="text-sm">Normal</span>}
                     size="small"
                     sx={{ p: 0.5 }}
                     onCheckedChange={(checked) => {
                        if (checked) othersField.onChange('')
                     }}
                  />
               )}
            </Box>
            <CheckboxGroup
               control={control}
               name={name as Path<IConsultationFormData>}
               options={checkboxOptions}
               disabled={disabled}
               exclusiveValue={hasNormalOption ? 'NORMAL' : undefined}
               grid
               checkboxProps={{ size: 'small', sx: { p: 0.5 } }}
            />
            <Input
               control={control}
               name={othersName}
               label="Others"
               placeholder="Specify other symptoms..."
               disabled={disabled}
            />
         </Box>
      </Grid>
   )
}

export default ConsultationSection
