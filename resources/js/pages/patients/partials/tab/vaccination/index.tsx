import { Box, Button, Typography } from '@mui/material';
import { usePage, router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Trash2, Plus, IdCard, Pencil } from 'lucide-react';
import VaccinationForm from './partials/vaccinationForm';
import VaccineCard from '../VaccineCard';
import { IPatient } from '@/interfaces/IPatient';
import {
  IPatientVaccination,
  IVaccineCardItem,
  IVaccinationAlert,
  IVaccineOption,
} from '@/interfaces/IPatientVaccination';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { useTranslation } from 'react-i18next';

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
  const { vaccinations, vaccines, vaccineCard } = usePage<{
    vaccinations: PaginatedData<IPatientVaccination>;
    vaccines: IVaccineOption[];
    vaccineCard: IVaccineCardItem[];
    vaccinationAlerts: IVaccinationAlert[];
  }>().props;
  const { t } = useTranslation();

  const { data: rows, total, current_page, per_page } = vaccinations;

  const handleCreate = () => {
    openModal({
      title: t('patients.vaccination.recordVaccination'),
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
      title: t('patients.vaccination.cardTitle'),
      content: <VaccineCard patient={patient} cardData={vaccineCard} />,
      config: { maxWidth: '3xl' },
    });
  };

  const handleEdit = (v: IPatientVaccination) => {
    openModal({
      title: t('patients.vaccination.editTitle'),
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
      message: t('patients.vaccination.deleteMessage'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () =>
        router.delete(`/patients/${patient.id}/vaccinations/${v.id}`),
    });
  };

  const handlePaginationModelChange = usePagination({
    route: `/patients/${patient.id}`,
    extraParams: (model) => ({
      tab: 'vaccination',
      per_page: String(model.pageSize),
    }),
    only: ['vaccinations'],
  });

  const columns: GridColDef[] = [
    {
      field: 'vaccine.name',
      headerName: t('vaccines.vaccineName'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row: IPatientVaccination) =>
        row.vaccine?.name ?? null,
      renderCell: (params: GridRenderCellParams<IPatientVaccination>) =>
        params.value ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'dose_number',
      headerName: t('vaccines.dose'),
      flex: 1,
      minWidth: 80,
      valueGetter: (_value, row: IPatientVaccination) =>
        t('patients.vaccination.doseCell', { dose_number: row.dose_number }),
    },
    {
      field: 'administered_date',
      headerName: t('vaccines.administeredDate'),
      flex: 1,
      minWidth: 140,
      valueGetter: (_value, row: IPatientVaccination) =>
        formatDate(row.administered_date),
    },
    {
      field: 'administered_by',
      headerName: t('common.createdBy'),
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
      headerName: t('common.note'),
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
      headerName: t('common.action'),
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`card-${params.id}`}
          icon={<IdCard size={16} color="#64748b" />}
          label={t('patients.vaccination.showCardAction')}
          onClick={handleShowCard}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('patients.vaccination.editAction')}
          onClick={() => handleEdit(params.row as IPatientVaccination)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('patients.vaccination.deleteAction')}
          onClick={() => handleDelete(params.row as IPatientVaccination)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography>
          {t('patients.vaccination.subtitle')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleCreate}
            startIcon={<Plus size={16} />}
            variant="contained"
          >
            {t('patients.vaccination.recordVaccination')}
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
