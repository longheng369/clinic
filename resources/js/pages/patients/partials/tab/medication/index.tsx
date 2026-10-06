import { Box, Button } from '@mui/material';
import { usePage } from '@inertiajs/react';
import { useModal } from '@/components/modal';
import { Plus } from 'lucide-react';
import MarForm from './partials/MarForm';
import MarGrid from './partials/MarGrid';
import { IMedicationOrder } from '@/interfaces/IMedicationOrder';
import { IPatient } from '@/interfaces/IPatient';
import Pagination from '@/components/table/Pagination';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IVisitWithMetaData } from '@/interfaces/IVisit';

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
  patient: IPatient;
  selectedVisit: IVisitWithMetaData | null;
};

const MedicationTab = ({ patientId, patient, selectedVisit }: Props) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { medicationOrders, activeVisits, medicines, medicationRoutes } = usePage<{
    medicationOrders: PaginatedData<IMedicationOrder>;
    activeVisits: {
      id: number;
      type: string;
      visit_date: string;
      created_by?: string;
    }[];
    medicines: { id: number; name: string }[];
    medicationRoutes: { id: number; name: string }[];
  }>().props;

  const [searchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return medicationOrders.data;
    const q = searchTerm.toLowerCase();
    return medicationOrders.data.filter(
      (m) => m.medicine?.name.toLowerCase().includes(q) ?? false,
    );
  }, [medicationOrders.data, searchTerm]);

  if (!selectedVisit) {
    return (
      <Box>
        <Box>{t('patients.medication.title')}</Box>
        <Box>{t('patients.medication.selectVisit')}</Box>
      </Box>
    );
  }

  const handleCreate = () => {
    openModal({
      title: t('patients.shared.form.addToDrugChart'),
      content: (
        <MarForm
          patientId={patientId}
          activeVisits={activeVisits}
          medicines={medicines}
          routes={medicationRoutes}
          selectedVisitId={selectedVisit.id}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const handleEdit = (order: IMedicationOrder) => {
    openModal({
      title: t('patients.shared.form.editPrescription'),
      content: (
        <MarForm
          patientId={patientId}
          activeVisits={activeVisits}
          medicines={medicines}
          routes={medicationRoutes}
          order={order}
          selectedVisitId={selectedVisit.id}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    });
  };

  const { data, ...pagination } = medicationOrders;

  return (
    <Box>
      <Button
        onClick={handleCreate}
        startIcon={<Plus size={16} />}
        variant="contained"
      >
        {t('patients.shared.form.addMedicine')}
      </Button>

      {filteredData.length === 0 ? (
        <Box>
          <Box>{t('patients.medication.noPrescriptions')}</Box>
          <Box>
            {searchTerm
              ? t('patients.shared.form.tryDifferentSearch')
              : t('patients.medication.emptyHint')}
          </Box>
        </Box>
      ) : (
        <MarGrid
          patient={patient}
          orders={filteredData}
          visitId={selectedVisit.id}
          onEdit={handleEdit}
        />
      )}

      {!searchTerm.trim() && data.length > 0 && (
        <Box>
          <Pagination
            meta={{
              current_page: pagination.current_page,
              last_page: pagination.last_page,
              per_page: pagination.per_page,
              total: pagination.total,
              from: pagination.from,
              to: pagination.to,
            }}
            baseUrl={window.location.pathname + window.location.search}
          />
        </Box>
      )}
    </Box>
  );
};

export default MedicationTab;
