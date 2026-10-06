import { Deferred, Head, usePage, router } from '@inertiajs/react';
import { IPatient } from '@/interfaces/IPatient';
import { IPrescription } from '@/interfaces/IPrescription';
import { History, Play } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '@/components/modal';
import PatientInfo from '@/components/patient/patientInfo';
import ConsultationTab from './partials/tab/consultation/index';
import AttachmentsTab from './partials/tab/attachment/index';
import SurveillanceTab from './partials/tab/surveillance/index';
import MedicationOrdersTab from './partials/tab/medication-orders/index';
import MedicationAdministrationTab from './partials/tab/medication-administration/index';
import PrescriptionTab from './partials/tab/prescription';
import ParaClinicTab from './partials/tab/para-clinic/index';
import VaccinationTab from '@/pages/patients/partials/tab/vaccination/index';
import BillingTab from './partials/tab/billing/index';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import VisitHistory from './partials/visitHistory';
import { IVisit, IVisitWithMetaData } from '@/interfaces/IVisit';
import { useToast } from '@/components/toast';
import { useTranslation } from 'react-i18next';
import theme from '@/theme';

type Tab =
  | 'consultation'
  | 'medication-orders'
  | 'medication-administration'
  | 'prescription'
  | 'admission'
  | 'para-clinic'
  | 'vaccination'
  | 'attachment'
  | 'surveillance'
  | 'billing';

const ALL_TABS: { key: Tab; label: string; requiresIpd?: boolean }[] = [
  { key: 'consultation', label: 'patients.show.tabs.consultation' },
  { key: 'prescription', label: 'patients.show.tabs.prescription' },
  { key: 'para-clinic', label: 'patients.show.tabs.paraClinic' },
  { key: 'vaccination', label: 'patients.show.tabs.vaccination' },
  { key: 'attachment', label: 'patients.show.tabs.attachment' },
  { key: 'billing', label: 'patients.show.tabs.billing' },
  {
    key: 'medication-orders',
    label: 'patients.show.tabs.medicationOrders',
    requiresIpd: true,
  },
  {
    key: 'medication-administration',
    label: 'patients.show.tabs.medicationAdministration',
    requiresIpd: true,
  },
  { key: 'surveillance', label: 'patients.show.tabs.surveillance', requiresIpd: true },
];

const DRAWER_WIDTH = '380px';

type Props = {
  patient: IPatient;
};

const PatientShow = ({ patient }: Props) => {
  const params = new URLSearchParams(window.location.search);
  const tabFromUrl = params.get('tab');
  const { selectedVisit, allVisits, prescription, latestWeight } = usePage<{
    selectedVisit: IVisitWithMetaData | null;
    allVisits: IVisit[];
    prescription: IPrescription | null;
    latestWeight: number | null;
  }>().props;

  const visibleTabs =
    selectedVisit?.type === 'IPD'
      ? ALL_TABS
      : ALL_TABS.filter((t) => !t.requiresIpd);

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (tabFromUrl && visibleTabs.some((t) => t.key === tabFromUrl))
      return tabFromUrl as Tab;
    return (visibleTabs[0]?.key as Tab) ?? 'consultation';
  });
  const { openAlert } = useModal();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isVisitDrawerOpen, setVisitDrawerOpen] = useState(false);
  const [isStartingVisit, setIsStartingVisit] = useState(false);

  const hasActiveVisit = allVisits.some((v) => v.status === 'active');

  const handleAdmit = (visitId: number) => {
    openAlert({
      message: t('patients.show.admitTitle'),
      description: t('patients.show.admitDescription'),
      variant: 'info',
      confirmLabel: t('patients.show.admit'),
      onConfirm: () => router.patch(`/visits/${visitId}/admit`),
    });
  };

  const handleClose = (visitId: number) => {
    openAlert({
      message: t('patients.show.closeVisitTitle'),
      description: t('patients.show.closeVisitDescription'),
      variant: 'warning',
      confirmLabel: t('common.close'),
      onConfirm: () =>
        router.patch(
          `/visits/${visitId}/close`,
          {},
          {
            onError: (errors) => {
              const message = Object.values(errors)[0];
              toast(
                typeof message === 'string'
                  ? message
                  : t('patients.show.unableToCloseVisit'),
                { variant: 'error' },
              );
            },
          },
        ),
    });
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url);
  };

  const handleVisitSelect = (visitId: number) => {
    setVisitDrawerOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('visit', String(visitId));
    router.visit(url.pathname + url.search);
  };

  const handleStartNewVisit = () => {
    setIsStartingVisit(true);
    router.post(
      `/patients/${patient.id}/visits`,
      {},
      {
        onError: () => {
          toast(t('patients.show.unableToStartVisit'), { variant: 'error' });
        },
        onFinish: () => setIsStartingVisit(false),
      },
    );
  };

  const formatVisitDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Head
        title={t('patients.show.title', {
          khmer_first_name: patient.khmer_first_name,
          khmer_last_name: patient.khmer_last_name,
        })}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <PatientInfo patient={patient} latestWeight={latestWeight} />
        </Box>

        {selectedVisit ? (
          <Paper
            variant="outlined"
            sx={{
              mb: 3,
              px: 4,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor:
                  selectedVisit.status === 'active'
                    ? 'success.main'
                    : 'text.disabled',
              }}
            />
            <Typography
              component="span"
              sx={{
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {selectedVisit.status}
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: '#e2e8f0' }}
            />
            <Typography component="span" sx={{ fontSize: 14 }}>
              {t('patients.show.visitType', { type: selectedVisit.type })}
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: '#e2e8f0' }}
            />
            <Typography component="span" sx={{ fontSize: 14 }}>
              {formatVisitDate(selectedVisit.created_at)}
            </Typography>
            {selectedVisit.created_by && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: '#e2e8f0' }}
                />
                <Typography
                  component="span"
                  sx={{ color: 'text.secondary', fontSize: 14 }}
                >
                  {t('patients.shared.by', {
                    name: selectedVisit.created_by.name,
                  })}
                </Typography>
              </>
            )}
            <Box sx={{ flex: 1 }} />
            {!hasActiveVisit && (
              <Button
                variant="contained"
                size="small"
                startIcon={<Play size={16} />}
                onClick={handleStartNewVisit}
                disabled={isStartingVisit}
              >
                {t('patients.show.startNewVisit')}
              </Button>
            )}
          </Paper>
        ) : (
          <Paper
            className="no-print"
            variant="outlined"
            sx={{
              mb: 4,
              px: 4,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              {t('patients.show.noVisits')}
            </Typography>
            {!hasActiveVisit && (
              <Button
                variant="contained"
                size="small"
                startIcon={<Play size={16} />}
                onClick={handleStartNewVisit}
                disabled={isStartingVisit}
              >
                {t('patients.show.startNewVisit')}
              </Button>
            )}
          </Paper>
        )}

        {selectedVisit ? (
          <Paper variant="outlined">
            <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => handleTabChange(value as Tab)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {visibleTabs.map((tab) => (
                  <Tab
                    key={tab.key}
                    value={tab.key}
                    label={t(tab.label)}
                  />
                ))}
              </Tabs>
            </Box>
            <Box sx={{ p: 3, minWidth: 0, overflowX: 'auto' }}>
              <TabContent
                tab={activeTab}
                patientId={patient.id}
                patient={patient}
                selectedVisit={selectedVisit}
                prescription={prescription}
              />
            </Box>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography color="text.secondary">
              {t('patients.show.selectVisit')}
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        aria-label={
          isVisitDrawerOpen
            ? t('patients.show.ariaCloseHistory')
            : t('patients.show.ariaOpenHistory')
        }
        aria-expanded={isVisitDrawerOpen}
        aria-controls="patient-visit-history"
        onClick={() => setVisitDrawerOpen((open) => !open)}
        disableElevation
        sx={{
          minWidth: 0,
          width: 30,
          padding: '15px 0',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          right: isVisitDrawerOpen ? DRAWER_WIDTH : 0,
          transition: 'right 200ms cubic-bezier(0, 0, 0.2, 1)',
          zIndex: (theme) => theme.zIndex.drawer,
          borderRadius: '12px 0 0 12px',
          border: '1px solid #cbd5e1',
          borderRight: 0,
          '& .visit-history-label': {
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          },
        }}
      >
        <Box component="span" className="visit-history-label">
          {t('patients.show.visitHistory')}
        </Box>
      </Button>

      <Drawer
        anchor="right"
        open={isVisitDrawerOpen}
        onClose={() => setVisitDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 380,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <History />
            <Typography variant="h6" sx={{ textAlign: 'center', py: 1 }}>
              {t('patients.show.visitHistory')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <VisitHistory
              allVisits={allVisits}
              selectedVisit={selectedVisit}
              onVisitSelect={handleVisitSelect}
              onAdmit={handleAdmit}
              onClose={handleClose}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

const TabLoading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 8,
    }}
  >
    <CircularProgress size={28} />
  </Box>
);

const TabContent = ({
  tab,
  patientId,
  patient,
  selectedVisit,
  prescription,
}: {
  tab: Tab;
  patientId: number;
  patient: IPatient;
  selectedVisit: IVisitWithMetaData | null;
  prescription: IPrescription | null;
}) => {
  switch (tab) {
    case 'consultation':
      return (
        <Deferred data="consultations" fallback={<TabLoading />}>
          <ConsultationTab
            patientId={patientId}
            visitId={selectedVisit?.id ?? null}
          />
        </Deferred>
      );
    case 'medication-orders':
      return (
        <Deferred
          data={['medicationOrders', 'activeVisits', 'medicines']}
          fallback={<TabLoading />}
        >
          <MedicationOrdersTab
            patientId={patientId}
            visitId={selectedVisit?.id ?? 0}
          />
        </Deferred>
      );
    case 'medication-administration':
      return (
        <Deferred data="medicationOrders" fallback={<TabLoading />}>
          <MedicationAdministrationTab visitId={selectedVisit?.id ?? 0} />
        </Deferred>
      );
    case 'prescription':
      return (
        <Deferred
          data={['prescription', 'medicines', 'units']}
          fallback={<TabLoading />}
        >
          <PrescriptionTab
            patient={patient}
            selectedVisit={selectedVisit}
            prescription={prescription}
          />
        </Deferred>
      );
    case 'para-clinic':
      return (
        <Deferred data="paraClinicRequests" fallback={<TabLoading />}>
          <ParaClinicTab patientId={patientId} selectedVisitId={selectedVisit?.id ?? null} />
        </Deferred>
      );
    case 'attachment':
      return (
        <Deferred data="attachments" fallback={<TabLoading />}>
          <AttachmentsTab patientId={patientId} selectedVisit={selectedVisit} />
        </Deferred>
      );
    case 'vaccination':
      return (
        <Deferred
          data={[
            'vaccinations',
            'vaccines',
            'vaccineCard',
            'vaccinationAlerts',
          ]}
          fallback={<TabLoading />}
        >
          <VaccinationTab patient={patient} />
        </Deferred>
      );
    case 'surveillance':
      return (
        <Deferred data="surveillance" fallback={<TabLoading />}>
          <SurveillanceTab
            patientId={patientId}
            visitId={selectedVisit?.id ?? null}
          />
        </Deferred>
      );
    case 'billing':
      return (
        <Deferred data="billing" fallback={<TabLoading />}>
          <BillingTab visitId={selectedVisit?.id ?? 0} />
        </Deferred>
      );
  }
};

export default PatientShow;
