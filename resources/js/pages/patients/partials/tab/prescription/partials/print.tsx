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

type Props = {
  onClose: () => void;
  patient: IPatient;
  prescription: IPrescription;
  diagnoses: string[]
}

const formatGenderValue = (gender: string) => {
  return gender === 'male' ? 'ប្រុស' : 'ស្រី';
}

const Print = ({ onClose, patient, prescription, diagnoses }: Props) => {
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
            Print Again
          </Button>
          <Button
            onClick={onClose}
            startIcon={<X size={16} />}
            variant="contained"
            color="error"
          >
            Close
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
            fontSize: '1rem'
          }}
        >
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </Typography>

        <div className="patient-info" style={{ marginTop: '1rem' }}>
          <PatientField
            label="គោត្តនាម នាម"
            value={`${patient.khmer_first_name} ${patient.khmer_last_name}`}
          />
          <PatientField
            label="Full Name"
            value={`${patient.first_name} ${patient.last_name}`}
          />
          <PatientField
            label="អាយុ"
            value={`${calculateAge(patient.date_of_birth)} ឆ្នាំ`}
          />
          <PatientField label="ភេទ" value={formatGenderValue(patient.gender)} />
          <PatientField label="ទូរស័ព្ទ" value={patient.phone_number} />
          <PatientField label="ក្រុមឈាម" value={patient.blood_group ?? ''} />
          <PatientField
            label="កាលបរិច្ឆេទ"
            value={formatDob(
              prescription?.created_at ?? new Date().toISOString(),
            )}
          />
          <PatientField label="Diagnosis" value={diagnoses.join(', ')} />
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
                  ល.រ
                </TableCell>
                <TableCell width="30%">ឈ្មោះថ្នាំ</TableCell>
                <TableCell width="10%">ចំនួន</TableCell>
                <TableCell width="40%">ការប្រើប្រាស់</TableCell>
                <TableCell width="10%" align="center">
                  ចំនួនថ្ងៃ
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
                    {item.instruction}{' '}
                    {item.morning && `ព្រឹក ${item.morning} ${item.unit?.name}`}{' '}
                    {item.afternoon &&
                      `រសៀល ${item.afternoon} ${item.unit?.name}`}{' '}
                    {item.evening && `ល្ងាច ${item.evening} ${item.unit?.name}`}{' '}
                    {item.night && `យប់ ${item.night} ${item.unit?.name}`},{' '}
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
        <p>
          អ្នកព្យាបាល: <span>{prescription?.created_by}</span>
        </p>
      </Box>
    </Box>
  );
};

export default Print
