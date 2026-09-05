import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Plus, Printer, Save, Stethoscope, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  IPrescription,
  IPrescriptionFormData,
} from '@/interfaces/IPrescription';
import { IPatient } from '@/interfaces/IPatient';
import MedicineItemForm from './partials/prescriptionItemForm';
import { calculateAge, formatDob } from '@/utils/date';
import { useFieldArray, useForm } from 'react-hook-form';
import { useToast } from '@/components/toast';
import {
  Box,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IVisitWithMetaData } from '@/interfaces/IVisit';
import Print from '@/pages/patients/partials/tab/prescription/partials/print';
import PatientField from '@/pages/patients/partials/tab/prescription/partials/PatientField';

type Props = {
  patient: IPatient;
  selectedVisit: IVisitWithMetaData | null;
  prescription: IPrescription | null;
};

const PrescriptionTab = ({ patient, selectedVisit, prescription }: Props) => {
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!prescription);
  const [openPrint, setOpenPrint] = useState(false);
  const { medicines, medicationRoutes, medicineInstructions, consultationDiagnoses } = usePage<{
    medicines: { id: number; name: string; unit_id?: number | null; unit?: { id: number; name: string } | null; dosage?: string | null }[];
    medicationRoutes: { id: number; code: string; name: string }[];
    medicineInstructions: { id: number; code: string; name: string }[];
    consultationDiagnoses: string[];
  }>().props;
  const instructionOptions = useMemo(
    () =>
      medicineInstructions.map((instruction) => ({
        label: instruction.name,
        value: instruction.code,
      })),
    [medicineInstructions],
  );

  const prescriptionItems = useMemo<IPrescriptionFormData['items']>(
    () =>
      prescription?.items.map((item) => {
        const medicine = medicines.find(
          (medicine) => medicine.id === item.medicine?.id,
        );

        return {
          medicine:
            medicine ??
            item.medicine ??
            { id: 0, name: '' },
          quantity: item.quantity ?? 0,
          unit: item.unit ?? { id: 0, name: medicine?.unit?.name ?? '' },
          route: item.route,
          morning: item.morning ?? null,
          afternoon: item.afternoon ?? null,
          evening: item.evening ?? null,
          night: item.night ?? null,
          numberOfDay: item.number_of_day ?? null,
          notes: item.notes,
          instruction:
            instructionOptions.find(
              (opt) => opt.value === item.instruction,
            ) ?? null,
        };
      }) ?? [],
    [medicines, prescription, instructionOptions],
  );

  const { control, reset } = useForm<IPrescriptionFormData>({
    defaultValues: { items: prescriptionItems },
  });
  const { fields, append, update } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    reset({ items: prescriptionItems });
  }, [prescriptionItems, reset]);

  useEffect(() => {
    setIsEditing(!prescription);
  }, [prescription?.id, selectedVisit?.id]);

  const availableMedicineOptions = useMemo(() => {
    const existingMedicineIds = new Set(
      fields.map((field) => field.medicine?.id),
    );
    return medicines.filter(
      (medicine) => !existingMedicineIds.has(medicine.id),
    );
  }, [medicines, fields]);

  const openAddModal = () => {
    if (!isEditing) return;

    openModal({
      title: 'Add Medicine',
      content: (
        <MedicineItemForm
          medicines={availableMedicineOptions}
          routes={medicationRoutes}
          instructions={instructionOptions}
          onSave={(data) => {
            append(data);
            closeModal();
          }}
          onClose={closeModal}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const openEditModal = (index: number) => {
    if (!isEditing) return;

    const item = fields[index];
    openModal({
      title: 'Edit Medicine',
      content: (
        <MedicineItemForm
          medicines={medicines}
          routes={medicationRoutes}
          instructions={instructionOptions}
          defaultValues={item}
          onSave={(data) => {
            update(index, data);
            closeModal();
          }}
          onClose={closeModal}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const cancelEditing = () => {
    reset({ items: prescriptionItems });
    setIsEditing(false);
  };

  const savePrescription = () => {
    if (!selectedVisit || fields.length === 0) {
      return;
    }

    const hasInvalidItem = fields.some(
      (item) => !item.medicine?.id || !item.unit?.name,
    );
    if (hasInvalidItem) {
      toast('Each medicine must have a medicine and unit selected.', {
        variant: 'error',
      });
      return;
    }

    const payload = {
      visit_id: selectedVisit.id,
      notes: prescription?.notes ?? null,
      items: fields.map((item) => ({
        medicine_id: item.medicine.id,
        route: item.route,
        unit_id: item.unit?.id ?? null,
        morning: item.morning ?? null,
        afternoon: item.afternoon ?? null,
        evening: item.evening ?? null,
        night: item.night ?? null,
        number_of_day:
          item.numberOfDay && item.numberOfDay > 0 ? item.numberOfDay : null,
        quantity: item.quantity ?? null,
        notes: item.notes ?? null,
        instruction: item.instruction?.value ?? null,
      })),
    };

    setIsSaving(true);
    const options = {
      onSuccess: () => {
        setIsEditing(false);
        toast(prescription ? 'Prescription updated.' : 'Prescription saved.', {
          variant: 'success',
        });
      },
      onError: () => {
        toast('Unable to save prescription.', { variant: 'error' });
      },
      onFinish: () => setIsSaving(false),
    };

    if (prescription) {
      router.put(
        `/patients/${patient.id}/prescriptions/${prescription.id}`,
        payload,
        options,
      );
    } else {
      router.post(`/patients/${patient.id}/prescriptions`, payload, options);
    }
  };

  if (!selectedVisit) {
    return (
      <Box>
        <Typography component="h3">Prescriptions</Typography>
        <Typography component="p" sx={{ mt: 0.5 }}>
          Select a visit to manage prescriptions.
        </Typography>
      </Box>
    );
  }

  if (!prescription && fields.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography>No Prescription</Typography>

        <Typography
          component="p"
          sx={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 3,
          }}
        >
          This visit doesn&apos;t have a prescription yet.
        </Typography>

        <Button
          variant="contained"
          onClick={openAddModal}
          startIcon={<Plus size={16} />}
        >
          Start Prescription
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 0,
          position: 'relative',
          p: 4,
          minHeight: '100vh',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Moul',
            color: 'info.main',
            textAlign: 'center',
            letterSpacing: 1,
            fontSize: '1.3rem',
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
          }}
        >
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            top: 32,
            left: 32,
            display: 'flex',
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #5a8f5a, #3d633d)',
          }}
        >
          <Stethoscope size={30} color="#fff" />
        </Box>

        <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            {!isEditing ? (
              <Box className="no-print" sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Printer size={16} />}
                  onClick={() => setOpenPrint(true)}
                >
                  Print
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Pencil size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </Box>
            ) : (
              <Box className="no-print" sx={{ display: 'flex', gap: 1 }}>
                {prescription && (
                  <Button
                    variant="outlined"
                    startIcon={<X size={16} />}
                    onClick={cancelEditing}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<Save size={16} />}
                  onClick={savePrescription}
                  disabled={isSaving}
                >
                  Save
                </Button>
                <Button
                  onClick={openAddModal}
                  variant="contained"
                  color="info"
                  startIcon={<Plus size={16} />}
                  disabled={isSaving}
                >
                  Add Medicine
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {[
            {
              label: 'គោត្តនាម នាម',
              value: `${patient.khmer_first_name} ${patient.khmer_last_name}`,
            },
            {
              label: 'ភេទ',
              value: patient.gender,
            },
            {
              label: 'អាយុ',
              value: `${calculateAge(patient.date_of_birth)} ឆ្នាំ`,
            },
            {
              label: 'Name',
              value: `${patient.last_name} ${patient.first_name}`,
            },
            {
              label: 'ទូរស័ព្ទ',
              value: patient.phone_number,
            },
            {
              label: 'ក្រុមឈាម',
              value: patient.blood_group,
            },
            {
              label: 'អត្តសញ្ញាណប័ណ្ណ',
              value: patient.national_id,
            },
            {
              label: 'កាលបរិច្ឆេទ',
              value: formatDob(
                prescription?.created_at ?? new Date().toISOString(),
              ),
            },
            {
              label: 'Diagnosis',
              value: consultationDiagnoses.join(', '),
            },
          ].map((info) => (
            <PatientField
              key={info.label}
              label={info.label}
              value={info.value!}
              fontSize="14px"
            />
          ))}
        </Box>

        <Box>
          {fields.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              No medicines in this prescription.
            </Box>
          ) : (
            <TableContainer>
              <Table
                sx={{
                  borderCollapse: 'collapse',
                  '& .MuiTableCell-root': {
                    border: 1,
                    borderColor: 'divider',
                  },
                }}
              >
                <TableHead
                  sx={{
                    '& .MuiTableCell-root': {
                      border: 1,
                      borderColor: 'divider',
                    },
                  }}
                >
                  <TableRow
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      '& .MuiTableCell-root': {
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <TableCell width="5%" align="center">
                      ល.រ
                    </TableCell>
                    <TableCell width="30%">ឈ្មោះថ្នាំ</TableCell>
                    <TableCell width="10%">ចំនួន</TableCell>
                    <TableCell width="40%">ការប្រើប្រាស់</TableCell>
                    <TableCell width="10%">ចំនួនថ្ងៃ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow
                      key={field.id}
                      sx={
                        isEditing
                          ? {
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }
                          : undefined
                      }
                      onClick={
                        isEditing ? () => openEditModal(index) : undefined
                      }
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{field.medicine?.name}</TableCell>
                      <TableCell>
                        {field.quantity} {field.unit?.name}
                      </TableCell>
                      <TableCell>
                        {field.instruction?.label}{' '}
                        {field.morning &&
                          `ព្រឹក ${field.morning} ${field.unit.name}`}{' '}
                        {field.afternoon &&
                          `រសៀល ${field.afternoon} ${field.unit.name}`}{' '}
                        {field.evening &&
                          `ល្ងាច ${field.evening} ${field.unit.name}`}{' '}
                        {field.night && `យប់ ${field.night} ${field.unit.name}`}
                        , {field.notes}
                      </TableCell>
                      <TableCell>{field.numberOfDay}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ mt: 8 }}>
            <Typography>
              វេជ្ជបណ្ឌិត{' '}
              <Typography component="span">
                : {prescription?.created_by}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={openPrint}
        maxWidth="md"
        onClose={() => setOpenPrint(false)}
        slotProps={{
          transition: {
            onEntered: () => {
              window.print();
            },
          },
        }}
        scroll="body"
      >
        <Print
          onClose={() => setOpenPrint(false)}
          patient={patient}
          prescription={prescription!}
          diagnoses={consultationDiagnoses}
        />
      </Dialog>
    </>
  );
};

export default PrescriptionTab;
