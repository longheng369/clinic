import { type Control } from 'react-hook-form'
import Input from '@/components/form/input'
import ConsultationSection from './ConsultationSection'
import {
  respiratorySymptoms,
  cardiovascularSymptoms,
  neurologicalSymptoms,
  musculoskeletalSymptoms,
  digestiveSymptoms,
  renalReproductiveSymptoms,
  skinSymptoms,
  eyeSymptoms,
  earSymptoms,
  noseSymptoms,
  throatSymptoms,
  psychologySymptoms,
} from '../consultationTemplate'
import { IConsultationFormData } from '@/interfaces/IConsultation'
import { Grid, Typography } from '@mui/material'

type Props = {
    control: Control<IConsultationFormData>
    viewOnly?: boolean
}

const ConsultationForm = ({ control, viewOnly }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2 }}>
        <Input
          control={control}
          name="weight"
          label="Weight (kg)"
          type="number"
          placeholder="e.g. 65"
          disabled={viewOnly}
          slotProps={{ htmlInput: { min: 0 } }}
          rules={{ required: 'Required' }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>
        <Input
          control={control}
          name="chief_complaint"
          label="Chief complaint"
          placeholder="Describe the main complaint..."
          disabled={viewOnly}
          rules={{ required: 'This field is required' }}
        />
      </Grid>

      <ConsultationSection
        control={control}
        name="respiratory_system_symptoms"
        options={respiratorySymptoms}
        title="1. Respiratory system"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="cardiovascular_symptoms"
        options={cardiovascularSymptoms}
        title="2. Cardiovascular"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="neurological_symptoms"
        options={neurologicalSymptoms}
        title="3. Neurological"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="musculoskeletal_symptoms"
        options={musculoskeletalSymptoms}
        title="4. Musculoskeletal"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="digestive_symptoms"
        options={digestiveSymptoms}
        title="5. Digestive"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="renal_reproductive_symptoms"
        options={renalReproductiveSymptoms}
        title="6. Renal / Reproductive"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="skin_symptoms"
        options={skinSymptoms}
        title="7. Skin"
        disabled={viewOnly}
      />

      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    8. EYES / EARS / THROAT / MOUTH
        </Typography>
      </Grid>

      <ConsultationSection
        control={control}
        name="eye_symptoms"
        options={eyeSymptoms}
        title="EYE"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="ear_symptoms"
        options={earSymptoms}
        title="EAR"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="nose_symptoms"
        options={noseSymptoms}
        title="NOSE"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="throat_symptoms"
        options={throatSymptoms}
        title="THROAT"
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="psychology_symptoms"
        options={psychologySymptoms}
        title="PSYCHOLOGY"
        disabled={viewOnly}
      />

      <Grid size={12}>
        <Input
          control={control}
          name="diagnosis"
          label="Diagnosis"
          placeholder="Enter diagnosis"
          disabled={viewOnly}
        />
      </Grid>

      <Grid size={12}>
        <Input
          control={control}
          name="note"
          label="Notes"
          placeholder="Additional notes..."
          multiline
          rows={4}
          disabled={viewOnly}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 2 }}>
        <Input
          control={control}
          name="fee"
          label="Fee ($)"
          type="number"
          placeholder="0.00"
          disabled={viewOnly}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        />
      </Grid>
    </Grid>
  )
}

export default ConsultationForm
