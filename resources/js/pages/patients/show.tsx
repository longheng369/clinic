import { Head, Link } from '@inertiajs/react'
import { IPatient } from '@/interfaces/IPatient'
import { ArrowLeft, User } from 'lucide-react'
import { useState } from 'react'
import AttachmentsTab from './partials/tab/attachment'
import SurveillanceTab from './partials/tab/surveillance'

type Tab = 'consultation' | 'medication' | 'admission' | 'paraclinic' | 'attachment' | 'surveillance'

const TABS: { key: Tab; label: string }[] = [
    { key: 'consultation', label: 'Consultation' },
    { key: 'medication', label: 'Medication' },
    { key: 'admission', label: 'Admission' },
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
                {/* Basic Info Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
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
            return <Placeholder title="Consultation" description="Patient consultation records will appear here." patientId={patientId} />
        case 'medication':
            return <Placeholder title="Medication" description="Medication history and prescriptions will appear here." patientId={patientId} />
        case 'admission':
            return <Placeholder title="Admission" description="Admission records will appear here." patientId={patientId} />
        case 'paraclinic':
            return <Placeholder title="Paraclinic" description="Paraclinic test results will appear here." patientId={patientId} />
        case 'attachment':
            return <AttachmentsTab patientId={patientId} />
        case 'surveillance':
            return <SurveillanceTab patientId={patientId} />
    }
}

const Placeholder = ({ title, description, patientId }: { title: string; description: string; patientId: number }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-2">Patient ID: {patientId}</p>
    </div>
)

export default PatientShow
