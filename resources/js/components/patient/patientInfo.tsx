import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IPatient } from '@/interfaces/IPatient';
import { formatDob, calculateAge } from '@/utils/date';

type InfoItemProps = {
  label: string;
  value: ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => (
  <Stack spacing={0.25}>
    <Typography variant="caption" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body1" color="textPrimary">
      {value ?? '—'}
    </Typography>
  </Stack>
);

const Gender = ({ gender }: { gender: string }) => {
  const { t } = useTranslation();
  return (
    <Typography
      sx={{
        textTransform: 'capitalize',
        color: gender == 'male' ? 'info.main' : 'error.main',
      }}
      component="span"
    >
      {t(gender === 'male' ? 'patients.form.male' : 'patients.form.female')}
    </Typography>
  );
};

type Props = {
  patient: IPatient;
  className?: string;
  gridClassName?: string;
  compact?: boolean;
  latestWeight?: number | null;
};

const PatientInfo = ({ patient, compact = false, latestWeight }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" sx={{ height: 'fit-content' }}>
      <CardContent
        sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.info.khmerName')}
              value={`${patient.khmer_first_name} ${patient.khmer_last_name}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.info.englishName')}
              value={
                patient.first_name
                  ? `${patient.last_name ?? ''} ${patient.first_name}`.trim()
                  : null
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.dateOfBirth')}
              value={`${formatDob(patient.date_of_birth)} (${t('patients.info.yrs', { age: calculateAge(patient.date_of_birth) })})`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.phoneNumber')}
              value={patient.phone_number}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.gender')}
              value={<Gender gender={patient.gender} />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.bloodGroup')}
              value={patient.blood_group}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.nationalId')}
              value={patient.national_id}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.address')}
              value={
                [
                  patient.province?.name_in_khmer,
                  patient.district?.name_in_khmer,
                  patient.commune?.name_in_khmer,
                  patient.village?.name_in_khmer,
                ]
                  .filter(Boolean)
                  .join(', ') || patient.address
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.form.allergy')}
              value={patient.allergy}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label={t('patients.info.weight')}
              value={latestWeight != null ? `${latestWeight} kg` : null}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
