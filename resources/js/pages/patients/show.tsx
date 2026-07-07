import { Head, Link, usePage, router } from '@inertiajs/react'
import { IPatient } from '@/interfaces/IPatient'
import { ArrowLeft, User, Activity, Hospital, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useModal } from '@/components/modal'
import ConsultationTab from './partials/tab/consultation'
import AttachmentsTab from './partials/tab/attachment'
import SurveillanceTab from './partials/tab/surveillance'
import MedicationTab from './partials/tab/medication'
import ParaclinicByPatientTab from '../paraclinic-requests/partials/tab/byPatient'

type Tab = 'consultation' | 'medication' | 'admission' | 'paraclinic' | 'attachment' | 'surveillance'

const TABS: { key: Tab; label: string }[] = [
    { key: 'consultation', label: 'Consultation' },
    { key: 'medication', label: 'Medication' },
    { key: 'paraclinic', label: 'Paraclinic' },
    { key: 'attachment', label: 'Attachment' },
    { key: 'surveillance', label: 'Surveillance' },
]

const PatientShow = ({ patient }: { patient: IPatient }) => {
    const params = new URLSearchParams(window.location.search)
    const tabFromUrl = params.get('tab')
    const [activeTab, setActiveTab] = useState<Tab>(() => {
        if (tabFromUrl && TABS.some((t) => t.key === tabFromUrl)) return tabFromUrl as Tab
        return 'consultation'
    })
    const { activeVisits, visitHistory } = usePage<{
        activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
        visitHistory: { data: { id: number; type: string; visit_date: string; recorded_by?: string; closed_at: string }[]; current_page: number; last_page: number }
    }>().props
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

    return (
        <>
            <Head title={`Patient - ${patient.khmer_last_name} ${patient.khmer_first_name}`} />

            {/* Top bar */}
            <div className="border-b border-gray-200 bg-white px-8 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/patients"
                        className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-primary-100 text-primary-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                <span className="font-khmer text-[18px]">{patient.khmer_last_name} {patient.khmer_first_name}</span>
                            </h1>
                            {patient.first_name && (
                                <p className="text-sm text-gray-500">
                                    {patient.last_name ? `${patient.last_name} ` : ''}{patient.first_name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Top row: Basic Info + Visits side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Basic Info Card */}
                    <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <InfoItem label="Khmer Name" value={`${patient.khmer_last_name} ${patient.khmer_first_name}`} className="font-khmer text-[16px]" />
                            <InfoItem label="English Name" value={patient.first_name ? `${patient.last_name ?? ''} ${patient.first_name}`.trim() : null} />
                            <InfoItem label="Date of Birth" value={patient.date_of_birth} />
                            <InfoItem label="Phone Number" value={patient.phone_number} />
                            <InfoItem label="Gender" value={<span className="capitalize">{patient.gender}</span>} />
                            <InfoItem label="Blood Group" value={patient.blood_group} />
                            <InfoItem label="National ID" value={patient.national_id} />
                            <InfoItem label="Address" value={patient.address} />
                            <InfoItem label="Allergy" value={patient.allergy} />
                        </div>
                    </div>

                    {/* Right column: Active Visits + Visit History */}
                    <div className="space-y-4">
                        {activeVisits.length > 0 && (
                            <div className="rounded-xl border border-gray-200 bg-white p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity size={16} className="text-primary-500" />
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Active Visits</h2>
                                </div>
                                <div className="space-y-2">
                                    {activeVisits.map((v) => (
                                        <div key={v.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        v.type === 'IPD' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
                                                    }`}>
                                                        {v.type === 'IPD' ? 'IPD' : 'OPD'}
                                                    </span>
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(v.visit_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                                    </span>
                                                </div>
                                                {v.recorded_by && (
                                                    <span className="text-[11px] text-gray-400 shrink-0">by {v.recorded_by}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                {v.type === 'OPD' && (
                                                    <button
                                                        onClick={() => handleAdmit(v.id)}
                                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                                                    >
                                                        <Hospital size={12} />
                                                        Admit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleClose(v.id)}
                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                >
                                                    <LogOut size={12} />
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {visitHistory.data.length > 0 && (
                            <div className="rounded-xl border border-gray-200 bg-white p-5">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Visit History</h2>
                                <div className="space-y-1.5">
                                    {visitHistory.data.map((v) => (
                                        <Link
                                            key={v.id}
                                            href={`/visits/${v.id}`}
                                            className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                                    {v.type}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {new Date(v.visit_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                                </span>
                                                <span className="text-[11px] text-gray-400">
                                                    Closed {new Date(v.closed_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                                </span>
                                            </div>
                                            {v.recorded_by && (
                                                <span className="text-[11px] text-gray-400 shrink-0">by {v.recorded_by}</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="rounded-xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto px-6">
                            {TABS.map((tab) => (
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
                        <TabContent tab={activeTab} patientId={patient.id} />
                    </div>
                </div>
            </div>
        </>
    )
}

const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
    <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">{label}</dt>
        <dd className={`text-sm text-gray-900 ${className ?? ''}`}>{value ?? <span className="text-gray-300">&mdash;</span>}</dd>
    </div>
)

const TabContent = ({ tab, patientId }: { tab: Tab; patientId: number }) => {
    switch (tab) {
        case 'consultation':
            return <ConsultationTab patientId={patientId} />
        case 'medication':
            return <MedicationTab patientId={patientId} />
        case 'paraclinic':
            return <ParaclinicByPatientTab patientId={patientId} />
        case 'attachment':
            return <AttachmentsTab patientId={patientId} />
        case 'surveillance':
            return <SurveillanceTab patientId={patientId} />
    }
}

export default PatientShow
