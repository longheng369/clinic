import { type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Input from '@/components/form/input';
import ConsultationSection from './ConsultationSection';
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
} from '../consultationTemplate';
import { IConsultationFormData } from '@/interfaces/IConsultation';
import { Grid, Typography } from '@mui/material';

type Props = {
  control: Control<IConsultationFormData>;
  viewOnly?: boolean;
};

const ConsultationForm = ({ control, viewOnly }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2 }}>
        <Input
          control={control}
          name="weight"
          label={t('patients.consultation.form.weight')}
          type="number"
          placeholder={t('patients.consultation.form.weightPlaceholder')}
          disabled={viewOnly}
          slotProps={{ htmlInput: { min: 0 } }}
          rules={{ required: t('patients.shared.form.required') }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>
        <Input
          control={control}
          name="chief_complaint"
          label={t('patients.consultation.form.chiefComplaint')}
          placeholder={t(
            'patients.consultation.form.chiefComplaintPlaceholder',
          )}
          disabled={viewOnly}
          rules={{ required: t('common.required') }}
        />
      </Grid>

      <ConsultationSection
        control={control}
        name="respiratory_system_symptoms"
        options={respiratorySymptoms}
        title={t('patients.consultation.form.sectionRespiratory')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="cardiovascular_symptoms"
        options={cardiovascularSymptoms}
        title={t('patients.consultation.form.sectionCardiovascular')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="neurological_symptoms"
        options={neurologicalSymptoms}
        title={t('patients.consultation.form.sectionNeurological')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="musculoskeletal_symptoms"
        options={musculoskeletalSymptoms}
        title={t('patients.consultation.form.sectionMusculoskeletal')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="digestive_symptoms"
        options={digestiveSymptoms}
        title={t('patients.consultation.form.sectionDigestive')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="renal_reproductive_symptoms"
        options={renalReproductiveSymptoms}
        title={t('patients.consultation.form.sectionRenalReproductive')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="skin_symptoms"
        options={skinSymptoms}
        title={t('patients.consultation.form.sectionSkin')}
        disabled={viewOnly}
      />

      <Grid size={12}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          {t('patients.consultation.form.sectionEyesEarsThroatMouth')}
        </Typography>
      </Grid>

      <ConsultationSection
        control={control}
        name="eye_symptoms"
        options={eyeSymptoms}
        title={t('patients.consultation.form.titleEye')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="ear_symptoms"
        options={earSymptoms}
        title={t('patients.consultation.form.titleEar')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="nose_symptoms"
        options={noseSymptoms}
        title={t('patients.consultation.form.titleNose')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="throat_symptoms"
        options={throatSymptoms}
        title={t('patients.consultation.form.titleThroat')}
        disabled={viewOnly}
      />

      <ConsultationSection
        control={control}
        name="psychology_symptoms"
        options={psychologySymptoms}
        title={t('patients.consultation.form.titlePsychology')}
        disabled={viewOnly}
      />

      <Grid size={12}>
        <Input
          control={control}
          name="diagnosis"
          label={t('patients.shared.form.diagnosis')}
          placeholder={t('patients.shared.form.enterDiagnosis')}
          disabled={viewOnly}
          rules={{
            required: t('patients.consultation.form.diagnosisRequired'),
          }}
        />
      </Grid>

      <Grid size={12}>
        <Input
          control={control}
          name="note"
          label={t('patients.shared.form.notes')}
          placeholder={t('patients.consultation.form.notesPlaceholder')}
          multiline
          rows={4}
          disabled={viewOnly}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 2 }}>
        <Input
          control={control}
          name="fee"
          label={t('patients.consultation.form.fee')}
          type="number"
          placeholder="0.00"
          disabled={viewOnly}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        />
      </Grid>
    </Grid>
  );
};

export default ConsultationForm;
