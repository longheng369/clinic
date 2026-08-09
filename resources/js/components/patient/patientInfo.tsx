import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { type ReactNode } from 'react'
import { IPatient } from '@/interfaces/IPatient'
import { formatDob } from '@/utils/date'

type InfoItemProps = {
   label: string
   value: ReactNode
}

const InfoItem = ({ label, value }: InfoItemProps) => (
   <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Siemreap, Poppins, sans-serif' }}>
         {label}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontFamily: 'Siemreap, Poppins, sans-serif' }}>
         {value ?? <span style={{ color: '#cbd5e1' }}>—</span>}
      </Typography>
   </Stack>
)

type Props = {
   patient: IPatient
   className?: string
   gridClassName?: string
   compact?: boolean
}

const PatientInfo = ({ patient, compact = false }: Props) => (
   <Card variant="outlined" sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
         <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ឈ្មោះខ្មែរ" value={<Typography component="span" sx={{ fontFamily: 'Siemreap', fontSize: 16 }}>{`${patient.khmer_first_name} ${patient.khmer_last_name}`}</Typography>} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ឈ្មោះអង់គ្លេស" value={patient.first_name ? `${patient.last_name ?? ''} ${patient.first_name}`.trim() : null} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ថ្ងៃខែឆ្នាំកំណើត" value={formatDob(patient.date_of_birth)} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ទូរស័ព្ទ" value={patient.phone_number} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ភេទ" value={patient.gender} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="ក្រុមឈាម" value={patient.blood_group} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="អត្តសញ្ញាណប័ណ្ណ" value={patient.national_id} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="អាសយដ្ឋាន" value={patient.address} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><InfoItem label="អាលែកហ្ស៊ី" value={patient.allergy} /></Grid>
         </Grid>
      </CardContent>
   </Card>
)

export default PatientInfo
