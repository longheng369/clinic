import { Box, Button, Typography } from '@mui/material';
import { usePage, router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Trash2, Plus, IdCard, Pencil } from 'lucide-react';
import VaccinationForm from './partials/vaccinationForm';
import VaccineCard from '../VaccineCard';
import VaccinationAlertBanner from '../VaccinationAlertBanner';
import { IPatient } from '@/interfaces/IPatient';
import {
  IPatientVaccination,
  IVaccineCardItem,
  IVaccinationAlert,
} from '@/interfaces/IPatientVaccination';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { useCallback } from 'react';

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface VaccinationTabProps {
  patient: IPatient;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

const VaccinationTab = ({ patient }: VaccinationTabProps) => {
  const { openModal, closeModal, openAlert } = useModal();
  const { vaccinations, vaccines, vaccineCard, vaccinationAlerts } = usePage<{
    vaccinations: PaginatedData<IPatientVaccination>;
    vaccines: { id: number; name: string }[];
    vaccineCard: IVaccineCardItem[];
    vaccinationAlerts: IVaccinationAlert[];
  }>().props;

  const { data: rows, total, current_page, per_page } = vaccinations;

  const handleCreate = () => {
    openModal({
      title: 'Record Vaccination',
      content: (
        <VaccinationForm
          patientId={patient.id}
          vaccines={vaccines}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true },
    });
  };

  const handleShowCard = () => {
    openModal({
      title: 'Vaccination Card',
      content: <VaccineCard patient={patient} cardData={vaccineCard} />,
      config: { maxWidth: '3xl' },
    });
  };

  const handleEdit = (v: IPatientVaccination) => {
    openModal({
      title: 'Edit Vaccination Record',
      content: (
        <VaccinationForm
          patientId={patient.id}
          vaccines={vaccines}
          vaccination={v}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true },
    });
  };

  const handleDelete = (v: IPatientVaccination) => {
    openAlert({
      message: 'Delete this vaccination record?',
      description: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () =>
        router.delete(`/patients/${patient.id}/vaccinations/${v.id}`),
    });
  };

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      router.get(
        `/patients/${patient.id}`,
        { page: String(model.page + 1), per_page: String(model.pageSize), tab: 'vaccination' },
        { preserveState: true, replace: true, only: ['vaccinations'] },
      );
    },
    [patient.id],
  );

  const columns: GridColDef[] = [
    {
      field: 'vaccine.name',
      headerName: 'វ៉ាក់សាំង',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IPatientVaccination) => row.vaccine?.name ?? null,
      renderCell: (params: GridRenderCellParams<IPatientVaccination>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'dose_number',
      headerName: 'ដូស',
      flex: 1,
      minWidth: 80,
      valueGetter: (_value, row: IPatientVaccination) => `ដូស ${row.dose_number}`,
    },
    {
      field: 'administered_date',
      headerName: 'កាលបរិច្ឆេទចាក់',
      flex: 1,
      minWidth: 140,
      valueGetter: (_value, row: IPatientVaccination) =>
        formatDate(row.administered_date),
    },
    {
      field: 'administered_by',
      headerName: 'អ្នកចាក់',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<IPatientVaccination>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'notes',
      headerName: 'កំណត់ចំណាំ',
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams<IPatientVaccination>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'សកម្មភាព',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`card-${params.id}`}
          icon={<IdCard size={16} color="#64748b" />}
          label="Show vaccination card"
          onClick={handleShowCard}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label="Edit vaccination"
          onClick={() => handleEdit(params.row as IPatientVaccination)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label="Delete vaccination"
          onClick={() => handleDelete(params.row as IPatientVaccination)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <VaccinationAlertBanner alerts={vaccinationAlerts} />

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Vaccination records for this patient
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleCreate}
            startIcon={<Plus size={16} />}
            variant="contained"
          >
            Record Vaccination
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        paginationMode="server"
        paginationModel={{ page: current_page - 1, pageSize: per_page }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};

export default VaccinationTab;
