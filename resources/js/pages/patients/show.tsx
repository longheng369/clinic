import { Head, Link, usePage, router } from '@inertiajs/react'
import { IPatient } from '@/interfaces/IPatient'
import { IPrescription } from '@/interfaces/IPrescription'
import { ArrowLeft, Hospital, LogOut, Circle } from 'lucide-react'
import { useState } from 'react'
import { useModal } from '@/components/modal'
import PatientInfo from '@/components/patient/patientInfo'
import ConsultationTab from './partials/tab/consultation'
import AttachmentsTab from './partials/tab/attachment'
import SurveillanceTab from './partials/tab/surveillance'
import MedicationTab from './partials/tab/medication'
import PrescriptionTab from './partials/tab/prescription'
import ParaclinicByPatientTab from '../paraclinic-requests/partials/tab/byPatient'
import VaccinationTab from './partials/tab/vaccination'
import { cn } from '@/utils/cn'

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

            <div className="border-b border-gray-300 bg-white px-8 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/patients"
                        className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            <span className="font-khmer text-[18px]">{patient.khmer_last_name} {patient.khmer_first_name}</span>
                        </h1>
                        {patient.first_name && (
                            <p className="text-md text-gray-500">
                                {patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <PatientInfo patient={patient} className="lg:col-span-2" />

                    <div className="rounded-xl border border-gray-300 bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Visits</h2>
                            <span className="inline-flex items-center justify-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                                {allVisits.length}
                            </span>
                        </div>

                        {allVisits.length === 0 ? (
                            <p className="text-sm text-gray-400 py-4 text-center">No visits recorded</p>
                        ) : (
                            <div className="space-y-1">
                                {allVisits.map((v) => {
                                    const isSelected = selectedVisit?.id === v.id
                                    return (
                                        <div key={v.id} className="relative">
                                            <button
                                                onClick={() => handleVisitSelect(v.id)}
                                                className={cn(
                                                    'w-full text-left px-3.5 py-2.5 rounded-lg border transition-colors',
                                                    isSelected
                                                        ? 'border-primary-300 bg-primary-50/60 border-l-2 border-l-primary-500'
                                                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100 border-l-2 border-l-transparent',
                                                )}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className={cn(
                                                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0',
                                                            v.type === 'IPD' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700',
                                                        )}>
                                                            {v.type}
                                                        </span>
                                                        <span className="text-xs text-gray-600 truncate">
                                                            {formatVisitDate(v.visit_date)}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Circle
                                                            size={6}
                                                            className={cn(
                                                                'fill-current',
                                                                v.status === 'active' ? 'text-green-500' : 'text-gray-400',
                                                            )}
                                                        />
                                                        <span className="text-[11px] text-gray-400 capitalize">{v.status}</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-1.5">
                                                    <span className="text-[11px] text-gray-400">
                                                        {v.recorded_by ? `by ${v.recorded_by}` : ''}
                                                        {v.closed_at ? <span className="text-gray-400"> &middot; Closed {formatVisitDate(v.closed_at)}</span> : ''}
                                                    </span>

                                                    {v.status === 'active' && isSelected && (
                                                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                            {v.type === 'OPD' && (
                                                                <button
                                                                    onClick={() => handleAdmit(v.id)}
                                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                                                                >
                                                                    <Hospital size={11} />
                                                                    Admit
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleClose(v.id)}
                                                                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                            >
                                                                <LogOut size={11} />
                                                                Close
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
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

                <div className="rounded-xl border border-gray-300 bg-white">
                    <div className="border-b border-gray-300">
                        <nav className="flex overflow-x-auto px-6">
                            {visibleTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-6">
                        <TabContent tab={activeTab} patientId={patient.id} patient={patient} selectedVisit={selectedVisit} prescription={prescription} />
                    </div>
                </div>
            </div>
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
