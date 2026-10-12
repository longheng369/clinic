import {
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { Printer, X } from 'lucide-react';
import { IPatient } from '@/interfaces/IPatient';
import PatientField from '@/pages/patients/partials/tab/prescription/partials/PatientField';
import NoPrint from '@/components/print/noPrint';
import { calculateAge, formatDob } from '@/utils/date';
import { IPrescription } from '@/interfaces/IPrescription';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  patient: IPatient;
  prescription: IPrescription;
  diagnoses: string[]
  instructionOptions: { label: string; value: number }[];
}

const Print = ({
  onClose,
  patient,
  prescription,
  diagnoses,
  instructionOptions,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Box className="prescription-printable">
      <Box>
        <NoPrint
          sx={{
            display: 'flex',
            gap: 1,
            pb: 1,
            mb: 1,
            borderBottom: 1,
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Printer size={16} />}
            onClick={() => window.print()}
          >
            {t('patients.prescription.printAgain')}
          </Button>
          <Button
            onClick={onClose}
            startIcon={<X size={16} />}
            variant="contained"
            color="error"
          >
            {t('common.close')}
          </Button>
        </NoPrint>

        <Typography
          sx={{
            fontFamily: 'Moul',
            color: 'info.main',
            textAlign: 'center',
            letterSpacing: 1,
            fontSize: '1.2rem',
          }}
        >
          ព្រះរាជាណាចក្រកម្ពុជា
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Moul',
            color: 'info.main',
            textAlign: 'center',
            letterSpacing: 1,
            mt: 0.5,
            fontSize: '1rem',
          }}
        >
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </Typography>

        <div className="patient-info" style={{ marginTop: '1rem' }}>
          <PatientField
            label={t('patients.prescription.khmerName')}
            value={`${patient.khmer_first_name} ${patient.khmer_last_name}`}
          />
          <PatientField
            label={t('patients.prescription.fullName')}
            value={`${patient.first_name} ${patient.last_name}`}
          />
          <PatientField
            label={t('patients.prescription.age')}
            value={t('patients.prescription.ageYears', {
              age: calculateAge(patient.date_of_birth),
            })}
          />
          <PatientField
            label={t('patients.prescription.gender')}
            value={
              patient.gender === 'male'
                ? t('patients.form.male')
                : t('patients.form.female')
            }
          />
          <PatientField label={t('patients.prescription.phone')} value={patient.phone_number} />
          <PatientField
            label={t('patients.prescription.bloodGroup')}
            value={patient.blood_group ?? ''}
          />
          <PatientField
            label={t('patients.prescription.date')}
            value={formatDob(
              prescription?.created_at ?? new Date().toISOString(),
            )}
          />
          <PatientField label={t('patients.shared.form.diagnosis')} value={diagnoses.join(', ')} />
        </div>

        <TableContainer sx={{ mt: 1 }}>
          <Table
            className="prescription-table"
            sx={{
              borderCollapse: 'collapse',
              '& .MuiTableCell-root': {
                border: 1,
                borderColor: 'divider',
                py: 0.5,
                px: 1,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width="5%" align="center">
                  {t('patients.prescription.no')}
                </TableCell>
                <TableCell width="30%">
                  {t('patients.prescription.medicineName')}
                </TableCell>
                <TableCell width="10%">
                  {t('patients.prescription.quantity')}
                </TableCell>
                <TableCell width="40%">
                  {t('patients.prescription.usage')}
                </TableCell>
                <TableCell width="10%" align="center">
                  {t('patients.prescription.days')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescription.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item.medicine?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {instructionOptions.find(
                      (opt) => opt.value === item.medicine_instruction_id,
                    )?.label ?? ''}{' '}
                    {item.morning &&
                      `${t('patients.prescription.morning')} ${item.morning} ${item.unit?.name}`}{' '}
                    {item.afternoon &&
                      `${t('patients.prescription.afternoon')} ${item.afternoon} ${item.unit?.name}`}{' '}
                    {item.evening &&
                      `${t('patients.prescription.evening')} ${item.evening} ${item.unit?.name}`}{' '}
                    {item.night &&
                      `${t('patients.prescription.night')} ${item.night} ${item.unit?.name}`},{' '}
                    {item.notes}
                  </TableCell>
                  <TableCell align="center">12</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ height: '150px' }}>
        <p style={{ textAlign: 'end' }}>
          {t('patients.prescription.treatingPhysician')}
        </p>
      </Box>
    </Box>
  );
};

export default Print
