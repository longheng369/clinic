import { Head, usePage, router } from '@inertiajs/react'
import { IPatient } from '@/interfaces/IPatient'
import { IPrescription } from '@/interfaces/IPrescription'
import { History, Play } from 'lucide-react'
import { useState } from 'react'
import { useModal } from '@/components/modal'
import PatientInfo from '@/components/patient/patientInfo'
import ConsultationTab from './partials/tab/consultation/index'
import AttachmentsTab from './partials/tab/attachment'
import SurveillanceTab from './partials/tab/surveillance'
import MedicationTab from './partials/tab/medication/index'
import PrescriptionTab from './partials/tab/prescription'
import ParaclinicByPatientTab from '../paraclinic-requests/partials/tab/byPatient'
import VaccinationTab from './partials/tab/vaccination'
import { Box, Button, Divider, Drawer, Paper, Tab, Tabs, Typography } from '@mui/material'
import VisitHistory from './partials/visitHistory'
import { IVisit, IVisitWithMetaData } from '@/interfaces/IVisit'
import { useToast } from '@/components/toast'

type Tab = 'consultation' | 'medication' | 'prescription' | 'admission' | 'paraclinic' | 'vaccination' | 'attachment' | 'surveillance'

const ALL_TABS: { key: Tab; label: string; requiresIpd?: boolean }[] = [
   { key: 'consultation', label: 'Consultation' },
   { key: 'prescription', label: 'Prescription' },
   { key: 'paraclinic', label: 'Paraclinic' },
   { key: 'vaccination', label: 'Vaccination' },
   { key: 'attachment', label: 'Attachment' },
   { key: 'medication', label: 'Medication', requiresIpd: true },
   { key: 'surveillance', label: 'Surveillance', requiresIpd: true },
]

const DRAWER_WIDTH = '380px'

type Props = {
   patient: IPatient
};

const PatientShow = ({ patient }: Props) => {
   const params = new URLSearchParams(window.location.search)
   const tabFromUrl = params.get('tab')
   const { selectedVisit, allVisits, prescription } = usePage<{
      selectedVisit: IVisitWithMetaData | null
      allVisits: IVisit[]
      prescription: IPrescription | null
   }>().props

   const visibleTabs = selectedVisit?.type === 'IPD'
      ? ALL_TABS
      : ALL_TABS.filter((t) => !t.requiresIpd)

   const [activeTab, setActiveTab] = useState<Tab>(() => {
      if (tabFromUrl && visibleTabs.some((t) => t.key === tabFromUrl)) return tabFromUrl as Tab
      return visibleTabs[0]?.key as Tab ?? 'consultation'
   })
   const { openAlert } = useModal()
   const { toast } = useToast()
   const [isVisitDrawerOpen, setVisitDrawerOpen] = useState(false)
   const [isStartingVisit, setIsStartingVisit] = useState(false)

   const handleAdmit = (visitId: number) => {
      openAlert({
         message: 'Admit patient to IPD?',
         description: 'This will change the visit type to Inpatient.',
         variant: 'info',
         confirmLabel: 'Admit',
         onConfirm: () => router.patch(`/visits/${visitId}/admit`),
      })
   }

   const handleClose = (visitId: number) => {
      openAlert({
         message: 'Close this visit?',
         description: 'All records will remain but no new activity can be added.',
         variant: 'warning',
         confirmLabel: 'Close',
         onConfirm: () => router.patch(`/visits/${visitId}/close`),
      })
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      const url = new URL(window.location.href)
      url.searchParams.set('tab', tab)
      window.history.replaceState({}, '', url)
   }

   const handleVisitSelect = (visitId: number) => {
      setVisitDrawerOpen(false)
      const url = new URL(window.location.href)
      url.searchParams.set('visit', String(visitId))
      router.visit(url.pathname + url.search)
   }

   const handleStartNewVisit = () => {
      setIsStartingVisit(true)
      router.post(`/patients/${patient.id}/visits`, {}, {
         onSuccess: () => {
            toast('New visit started!', { variant: 'success' })
         },
         onError: () => {
            toast('Unable to start a new visit.', { variant: 'error' })
         },
         onFinish: () => setIsStartingVisit(false),
      })
   }

   const formatVisitDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
   }

   return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
         <Head title={`Patient - ${patient.khmer_last_name} ${patient.khmer_first_name}`} />

         <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
            <Box sx={{ mb: 3 }}>
               <PatientInfo patient={patient} />
            </Box>

            {selectedVisit ? (
               <Paper
                  variant="outlined"
                  sx={{
                     mb: 4,
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
                        bgcolor: selectedVisit.status === 'active' ? 'success.main' : 'text.disabled',
                     }}
                  />
                  <Typography component="span" sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: 14 }}>
                     {selectedVisit.status}
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0' }} />
                  <Typography component="span" sx={{ fontSize: 14 }}>
                     {selectedVisit.type} Visit
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0' }} />
                  <Typography component="span" sx={{ fontSize: 14 }}>
                     {formatVisitDate(selectedVisit.created_at)}
                  </Typography>
                  {selectedVisit.created_by && (
                     <>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0' }} />
                        <Typography component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
                           by {selectedVisit.created_by.name}
                        </Typography>
                     </>
                  )}
               </Paper>
            ) : (
               <Paper variant="outlined" sx={{ mb: 4, px: 4, py: 2.5 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                     No visits recorded
                  </Typography>
               </Paper>
            )}

            {selectedVisit ? (
               <Box sx={{ borderRadius: 1, border: '1px solid #cbd5e1', bgcolor: '#fff' }}>
                  <Box sx={{ borderBottom: '1px solid #cbd5e1' }}>
                     <Tabs
                        value={activeTab}
                        onChange={(_, value) => handleTabChange(value as Tab)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                           px: 2,
                           '& .MuiTab-root': {
                              textTransform: 'none',
                              fontWeight: 500,
                              py: 1.5,
                              color: '#64748b',
                              '&.Mui-selected': { color: '#4a7a4a' },
                           },
                           '& .MuiTabs-indicator': { bgcolor: '#5a8f5a' },
                        }}
                     >
                        {visibleTabs.map((tab) => (
                           <Tab key={tab.key} value={tab.key} label={tab.label} />
                        ))}
                     </Tabs>
                  </Box>
                  <Box sx={{ p: 3 }}>
                     <TabContent tab={activeTab} patientId={patient.id} patient={patient} selectedVisit={selectedVisit} prescription={prescription} />
                  </Box>
               </Box>
            ) : (
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography>No active visit</Typography>
                  <Button
                     variant='contained'
                     sx={{ mt: 1 }}
                     startIcon={<Play size={16} />}
                     onClick={handleStartNewVisit}
                     disabled={isStartingVisit}
                  >
                     Start New Visit
                  </Button>
               </Box>
            )}
         </Box>

         <Button
            variant="contained"
            aria-label={isVisitDrawerOpen ? 'Close visit history' : 'Open visit history'}
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
               zIndex: (theme) => theme.zIndex.modal + 1,
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
            <Box sx={{}}>Visit History</Box>
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
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <History />
                  <Typography variant='h6' sx={{ textAlign: 'center', py: 1 }}>
                     Visit History
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
   )
}

const TabContent = ({ tab, patientId, patient, selectedVisit, prescription }: { tab: Tab; patientId: number; patient: IPatient; selectedVisit: IVisitWithMetaData | null; prescription: IPrescription | null }) => {
   switch (tab) {
      case 'consultation':
         return <ConsultationTab patientId={patientId} />
      case 'medication':
         return <MedicationTab patientId={patientId} patient={patient} selectedVisit={selectedVisit} />
      case 'prescription':
         return <PrescriptionTab patient={patient} selectedVisit={selectedVisit} prescription={prescription} />
      case 'paraclinic':
         return <ParaclinicByPatientTab patientId={patientId} />
      case 'attachment':
         return <AttachmentsTab patientId={patientId} selectedVisit={selectedVisit} />
      case 'vaccination':
         return <VaccinationTab patient={patient} />
      case 'surveillance':
         return <SurveillanceTab patientId={patientId} selectedVisit={selectedVisit} />
   }
}

export default PatientShow
