import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { ISurveillance } from '@/interfaces/ISurveillance';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { usePagination } from '@/hooks/usePagination';
import { formatCreatedDateTime } from '@/utils/date';
import { Box, Typography, Button } from '@mui/material';
import SurveillanceForm from './partials/SurveillanceForm';
import { O2_OPTIONS } from '@/config/surveillance';
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

type Props = {
  patientId: number;
  visitId: number | null;
};

const SurveillanceTab = ({ patientId, visitId }: Props) => {
  const { openModal, closeModal, openAlert } = useModal();
  const { surveillance } = usePage<{
    surveillance: PaginatedData<ISurveillance>;
  }>().props;
  const { t } = useTranslation();
  const { data: rows, total, current_page, per_page } = surveillance;

  const handleCreate = () => {
    openModal({
      title: t('patients.surveillance.createTitle'),
      content: (
        <SurveillanceForm
          patientId={patientId}
          defaultVisitId={visitId}
          onClose={closeModal}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleEdit = (s: ISurveillance) => {
    openModal({
      title: t('patients.surveillance.editTitle'),
      content: (
        <SurveillanceForm
          patientId={patientId}
          surveillance={s}
          defaultVisitId={visitId}
          onClose={closeModal}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleDelete = (s: ISurveillance) => {
    openAlert({
      message: t('patients.surveillance.deleteMessage'),
      description: t('common.deleteDescription'),
      variant: 'danger',
      confirmLabel: t('common.delete'),
      onConfirm: () =>
        router.delete(`/patients/${patientId}/surveillance/${s.id}`),
    });
  };

  const handlePaginationModelChange = usePagination({
    route: `/patients/${patientId}`,
    extraParams: { tab: 'surveillance' },
    only: ['surveillance'],
  });

  const renderO2Supply = (value: string | null) => {
    return O2_OPTIONS.find((opt) => opt.value == value)?.label;
  }

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: t('patients.surveillance.colDate'),
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row: ISurveillance) =>
        formatCreatedDateTime(row.created_at),
    },
    {
      field: 'blood_pressure',
      headerName: t('patients.surveillance.colBloodPressure'),
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row: ISurveillance) =>
        `${row.systolic}/${row.diastolic}`,
    },
    {
      field: 'pulse',
      headerName: t('patients.surveillance.colPulse'),
      flex: 1,
      minWidth: 90,
    },
    {
      field: 'temperature',
      headerName: t('patients.surveillance.colTemperature'),
      flex: 1,
      minWidth: 110,
      valueGetter: (_value, row: ISurveillance) => row.temperature.toFixed(1),
    },
    {
      field: 'rr',
      headerName: t('patients.surveillance.colRespiratoryRate'),
      flex: 1,
      minWidth: 90,
    },
    {
      field: 'spo2',
      headerName: t('patients.surveillance.colSpo2'),
      flex: 1,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<ISurveillance>) =>
        params.row.spo2 ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'o2_supply',
      headerName: t('patients.surveillance.colO2Supply'),
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<ISurveillance>) =>
        renderO2Supply(params.row.o2_supply) ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'note',
      headerName: t('patients.surveillance.colNote'),
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<ISurveillance>) =>
        params.row.note ?? (
          <Typography component="span" color="text.disabled">
            &mdash;
          </Typography>
        ),
    },
    {
      field: 'created_by',
      headerName: t('patients.surveillance.colCreatedBy'),
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<ISurveillance>) =>
        params.value ?? <Box>&mdash;</Box>,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('patients.surveillance.colActions'),
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<Pencil size={16} color="#2563eb" />}
          label={t('patients.surveillance.editAction')}
          onClick={() => handleEdit(params.row as ISurveillance)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<Trash2 size={16} color="#dc2626" />}
          label={t('patients.surveillance.deleteAction')}
          onClick={() => handleDelete(params.row as ISurveillance)}
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
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('patients.surveillance.subtitle')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={handleCreate}
        >
          {t('patients.surveillance.newRecord')}
        </Button>
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

export default SurveillanceTab;
