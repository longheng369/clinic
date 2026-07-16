import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Calendar, User } from 'lucide-react'

interface VisitData {
    id: number
    patient_id: number
    type: string
    status: string
    visit_date: string
    recorded_by?: string
    created_at: string
    updated_at: string
}

interface PatientData {
    id: number
    khmer_first_name: string
    khmer_last_name: string
    first_name?: string
    last_name?: string
    phone_number?: string
    gender?: string
}

interface ConsultationRow {
    id: number
    chief_complaint: string
    diagnosis?: string
    fee?: number
    recorded_by?: string
    created_at: string
}

interface MedicationRow {
    id: number
    medicine?: string
    route: string
    dosage: number
    unit: string
    interval: string
    status: string
    recorded_by?: string
    created_at: string
}

interface SurveillanceRow {
    id: number
    systolic: number
    diastolic: number
    pulse: number
    temperature: number
    rr: number
    spo2: number
    o2_supply: string
    recorded_by?: string
    created_at: string
}

interface ParaclinicRow {
    id: number
    request_number: string
    doctor?: string
    status: string
    tests_count: number
    created_at: string
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    prescribed: { label: 'Prescribed', className: 'bg-blue-100 text-blue-700' },
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    provided: { label: 'Provided', className: 'bg-green-100 text-green-700' },
    continued: { label: 'Continued', className: 'bg-amber-100 text-amber-700' },
    stopped: { label: 'Stopped', className: 'bg-gray-100 text-gray-500' },
}

const VisitShow = ({ visit, patient, consultations, medicationAdministrations, surveillances, paraclinicRequests }: {
    visit: VisitData
    patient: PatientData
    consultations: ConsultationRow[]
    medicationAdministrations: MedicationRow[]
    surveillances: SurveillanceRow[]
    paraclinicRequests: ParaclinicRow[]
}) => {
    return (
        <>
            <Head title={`Visit - ${patient.khmer_last_name} ${patient.khmer_first_name}`} />

            <div className="border-b border-gray-200 bg-white px-8 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/patients/${patient.id}`}
                        className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-primary-100 text-primary-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                <span className="font-khmer text-[18px]">{patient.khmer_last_name} {patient.khmer_first_name}</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    visit.type === 'IPD' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
                                }`}>
                                    {visit.type}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(visit.visit_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}
                                </span>
                                <span className={`text-xs ${visit.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                    &middot; {visit.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* Consultations */}
                {consultations.length > 0 && (
                    <Section title="Consultations" count={consultations.length}>
                        {consultations.map((c) => (
                            <Row key={c.id}>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{c.chief_complaint}</p>
                                    {c.diagnosis && <p className="text-xs text-gray-500 mt-0.5">{c.diagnosis}</p>}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                                    {c.fee ? <span>${c.fee.toFixed(2)}</span> : null}
                                    <span>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                                    {c.recorded_by && <span>by {c.recorded_by}</span>}
                                </div>
                            </Row>
                        ))}
                    </Section>
                )}

                {/* Medications */}
                {medicationAdministrations.length > 0 && (
                    <Section title="Medications" count={medicationAdministrations.length}>
                        {medicationAdministrations.map((m) => {
                            const badge = STATUS_BADGE[m.status] ?? { label: m.status, className: 'bg-gray-100 text-gray-600' }
                            return (
                                <Row key={m.id}>
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <span className="text-sm font-medium text-gray-900 truncate">{m.medicine ?? '—'}</span>
                                        <span className="text-xs text-gray-500">{m.route}</span>
                                        <span className="text-xs text-gray-500">{m.dosage} {m.unit} &middot; {m.interval}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                        </span>
                                        {m.recorded_by && <span className="text-xs text-gray-400">by {m.recorded_by}</span>}
                                    </div>
                                </Row>
                            )
                        })}
                    </Section>
                )}

                {/* Surveillances */}
                {surveillances.length > 0 && (
                    <Section title="Vital Signs" count={surveillances.length}>
                        {surveillances.map((s) => (
                            <Row key={s.id}>
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-sm text-gray-900 font-medium">{s.systolic}/{s.diastolic}</span>
                                    <span className="text-xs text-gray-500">Pulse {s.pulse}</span>
                                    <span className="text-xs text-gray-500">Temp {s.temperature.toFixed(1)}°C</span>
                                    <span className="text-xs text-gray-500">RR {s.rr}</span>
                                    <span className="text-xs text-gray-500">SpO₂ {s.spo2}%</span>
                                    <span className="text-xs text-gray-400">{s.o2_supply}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                                    <span>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                                    {s.recorded_by && <span>by {s.recorded_by}</span>}
                                </div>
                            </Row>
                        ))}
                    </Section>
                )}

                {/* Paraclinic Requests */}
                {paraclinicRequests.length > 0 && (
                    <Section title="Paraclinic Requests" count={paraclinicRequests.length}>
                        {paraclinicRequests.map((r) => (
                            <Row key={r.id}>
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="text-sm font-medium text-gray-900">{r.request_number}</span>
                                    {r.doctor && <span className="text-xs text-gray-500">Dr. {r.doctor}</span>}
                                    <span className="text-xs text-gray-400">{r.tests_count} test{r.tests_count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs shrink-0">
                                    <span className="text-gray-500">{r.status}</span>
                                    <span className="text-gray-400">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                                </div>
                            </Row>
                        ))}
                    </Section>
                )}

                {consultations.length === 0 && medicationAdministrations.length === 0 && surveillances.length === 0 && paraclinicRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Calendar size={40} className="text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No records</h3>
                        <p className="text-sm text-gray-500">This visit has no associated records.</p>
                    </div>
                )}
            </div>
        </>
    )
}

const Section = ({ title, count, children }: { title: string; count: number; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-700">{title} <span className="text-gray-400 font-normal">({count})</span></h2>
        </div>
        <div className="divide-y divide-gray-50">{children}</div>
    </div>
)

const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between px-5 py-3">{children}</div>
)

export default VisitShow
