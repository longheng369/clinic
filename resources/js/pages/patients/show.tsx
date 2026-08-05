import { Head, usePage, router } from '@inertiajs/react'
import { IPatient } from '@/interfaces/IPatient'
import { IPrescription } from '@/interfaces/IPrescription'
import { Hospital, LogOut, Circle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useModal } from '@/components/modal'
import PatientInfo from '@/components/patient/patientInfo'
import ConsultationTab from './partials/tab/consultation/index'
import AttachmentsTab from './partials/tab/attachment'
import SurveillanceTab from './partials/tab/surveillance'
import MedicationTab from './partials/tab/medication/index'
import PrescriptionTab from './partials/tab/prescription'
import ParaclinicByPatientTab from '../paraclinic-requests/partials/tab/byPatient'
import VaccinationTab from './partials/tab/vaccination'
import { cn } from '@/utils/cn'
import { Box, Button, IconButton, Tab, Tabs } from '@mui/material'

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

interface VisitSummary {
   id: number
   type: string
   status: string
   visit_date: string
   recorded_by?: string
   closed_at?: string | null
}

interface SelectedVisit {
   id: number
   type: string
   visit_date: string
   status: string
   recorded_by?: string
}

const PatientShow = ({ patient }: { patient: IPatient }) => {
   const params = new URLSearchParams(window.location.search)
   const tabFromUrl = params.get('tab')
   const { selectedVisit, allVisits, prescription } = usePage<{
      selectedVisit: SelectedVisit | null
      allVisits: VisitSummary[]
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
   const [isVisitDrawerOpen, setVisitDrawerOpen] = useState(false)

   useEffect(() => {
      if (!isVisitDrawerOpen) return

      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') setVisitDrawerOpen(false)
      }

      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
   }, [isVisitDrawerOpen])

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

   const formatVisitDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
   }

   return (
      <div className='h-full flex flex-col'>
         <Head title={`Patient - ${patient.khmer_last_name} ${patient.khmer_first_name}`} />

         <div className="p-8 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
               <PatientInfo patient={patient} className="lg:col-span-3" />
            </div>

            {selectedVisit ? (
               <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <Circle size={8} className={cn('fill-current', selectedVisit.status === 'active' ? 'text-green-500' : 'text-gray-400')} />
                  <span className="capitalize font-medium">{selectedVisit.status}</span>
                  <span className="text-gray-300">&middot;</span>
                  <span>{selectedVisit.type} Visit</span>
                  <span className="text-gray-300">&middot;</span>
                  <span>{formatVisitDate(selectedVisit.visit_date)}</span>
                  {selectedVisit.recorded_by && (
                     <>
                        <span className="text-gray-300">&middot;</span>
                        <span className="text-gray-400">by {selectedVisit.recorded_by}</span>
                     </>
                  )}
               </div>
            ) : (
               <div className="mb-4 text-sm text-gray-500 bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  No visits recorded
               </div>
            )}

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
         </div>

         <div
            id="patient-visit-history"
            role="dialog"
            aria-label="Patient visit history"
            className={cn(
               'fixed inset-y-0 right-0 z-1200 w-[min(calc(100vw-40px),360px)] border-l border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[380px]',
               isVisitDrawerOpen ? 'translate-x-0' : 'translate-x-full',
            )}
         >
            <div className="relative h-full">
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
                     height: 120,
                     padding: 0,
                     position: 'absolute',
                     left: -30,
                     top: '50%',
                     transform: 'translateY(-50%)',
                     zIndex: 1,
                     borderRadius: '12px 0 0 12px',
                     border: '1px solid #cbd5e1',
                     borderRight: 0,
                     '& .visit-history-label': {
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        whiteSpace: 'nowrap',
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em',
                     },
                  }}
               >
                  <span className="visit-history-label">Visit History</span>
               </Button>
               <div className="flex h-full flex-col" inert={!isVisitDrawerOpen ? true : undefined}>
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                     <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Visit history</h2>
                        <p className="mt-1 text-xs text-gray-400">{allVisits.length} recorded visits</p>
                     </div>
                     <IconButton aria-label="Close visit history" onClick={() => setVisitDrawerOpen(false)} size="small">
                        <X size={18} />
                     </IconButton>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                     <VisitHistory
                        allVisits={allVisits}
                        selectedVisit={selectedVisit}
                        formatVisitDate={formatVisitDate}
                        onVisitSelect={handleVisitSelect}
                        onAdmit={handleAdmit}
                        onClose={handleClose}
                     />
                  </div>
               </div>
            </div>
         </div>

         <button
            type="button"
            aria-label="Close visit history"
            onClick={() => setVisitDrawerOpen(false)}
            className={cn(
               'fixed inset-0 z-1190 bg-slate-950/20 transition-opacity duration-300',
               isVisitDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
         />

      </div>
   )
}

const VisitHistory = ({
   allVisits,
   selectedVisit,
   formatVisitDate,
   onVisitSelect,
   onAdmit,
   onClose,
}: {
   allVisits: VisitSummary[]
   selectedVisit: SelectedVisit | null
   formatVisitDate: (date: string) => string
   onVisitSelect: (visitId: number) => void
   onAdmit: (visitId: number) => void
   onClose: (visitId: number) => void
}) => {
   if (allVisits.length === 0) {
      return <p className="py-4 text-center text-sm text-gray-400">No visits recorded</p>
   }

   return (
      <div className="relative space-y-4">
         <div className="absolute bottom-3 left-3 top-3 w-px bg-slate-200" aria-hidden="true" />
         {allVisits.map((v) => {
            const isSelected = selectedVisit?.id === v.id

            return (
               <div key={v.id} className="relative flex gap-3">
                  <div className="relative z-10 flex w-6 shrink-0 justify-center">
                     <span
                        className={cn(
                           'mt-3 h-3 w-3 rounded-full border-2 border-white shadow-sm',
                           isSelected
                              ? 'bg-primary-500 ring-2 ring-primary-100'
                              : v.status === 'active'
                                 ? 'bg-green-500'
                                 : 'bg-slate-300',
                        )}
                     />
                  </div>

                  <div className={cn(
                     'min-w-0 flex-1 rounded-lg border transition-colors',
                     isSelected
                        ? 'border-primary-300 bg-primary-50/60'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100',
                  )}>
                     <button
                        type="button"
                        onClick={() => onVisitSelect(v.id)}
                        className="w-full px-3.5 py-3 text-left"
                     >
                        <div className="flex items-start justify-between gap-3">
                           <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700">{formatVisitDate(v.visit_date)}</p>
                              <span className={cn(
                                 'mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                                 v.type === 'IPD' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700',
                              )}>
                                 {v.type} visit
                              </span>
                           </div>
                           <span className={cn(
                              'shrink-0 text-[11px] font-medium capitalize',
                              v.status === 'active' ? 'text-green-600' : 'text-gray-400',
                           )}>
                              {v.status}
                           </span>
                        </div>

                        <div className="mt-2 text-[11px] text-gray-400">
                           {v.recorded_by ? `Recorded by ${v.recorded_by}` : 'Recorded visit'}
                           {v.closed_at ? <span> &middot; Closed {formatVisitDate(v.closed_at)}</span> : ''}
                        </div>
                     </button>

                     {v.status === 'active' && isSelected && (
                        <div className="flex items-center gap-1.5 border-t border-primary-100 px-3.5 py-2" onClick={(e) => e.stopPropagation()}>
                           {v.type === 'OPD' && (
                              <button
                                 type="button"
                                 onClick={() => onAdmit(v.id)}
                                 className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 transition-colors hover:bg-amber-100"
                              >
                                 <Hospital size={11} />
                                 Admit
                              </button>
                           )}
                           <button
                              type="button"
                              onClick={() => onClose(v.id)}
                              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-gray-200"
                           >
                              <LogOut size={11} />
                              Close
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            )
         })}
      </div>
   )
}

const TabContent = ({ tab, patientId, patient, selectedVisit, prescription }: { tab: Tab; patientId: number; patient: IPatient; selectedVisit: SelectedVisit | null; prescription: IPrescription | null }) => {
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
