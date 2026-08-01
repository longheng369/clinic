import { Head, Link, usePage } from '@inertiajs/react'
import { IDashboardVaccinationAlert } from '@/interfaces/IPatientVaccination'
import { AlertTriangle, Clock, Syringe, CheckCircle2 } from 'lucide-react'
import Button from '@mui/material/Button'

const Dashboard = () => {
    const { vaccinationDueAlerts } = usePage<{
        vaccinationDueAlerts: IDashboardVaccinationAlert[]
    }>().props

    const overdue = vaccinationDueAlerts.filter((a) => a.is_overdue)
    const upcoming = vaccinationDueAlerts.filter((a) => !a.is_overdue)

    return (
        <>
            <Button>Test</Button>
            <Head title="Dashboard" />
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-primary-600">
                        Overview of your clinic
                    </p>
                </div>

                {/* Vaccination Alerts section */}
                <div className="rounded-2xl border border-primary-100/50 bg-white shadow-md shadow-primary-500/5">
                    <div className="flex items-center gap-2 border-b border-primary-100/50 px-6 py-4">
                        <Syringe size={20} className="text-primary-500" />
                        <h2 className="text-base font-semibold text-gray-900">Vaccination Due Alerts</h2>
                        {vaccinationDueAlerts.length > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                                {vaccinationDueAlerts.length} alert{vaccinationDueAlerts.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {vaccinationDueAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 size={40} className="text-primary-300 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
                            <p className="text-sm text-gray-500">No vaccinations due within the next 7 days.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-primary-50/80">
                            {overdue.length > 0 && (
                                <div className="px-6 py-4">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5">
                                        <AlertTriangle size={14} />
                                        Overdue — {overdue.length} patient{overdue.length !== 1 ? 's' : ''}
                                    </h3>
                                    <div className="space-y-2">
                                        {overdue.map((alert, i) => (
                                            <AlertItem key={`overdue-${i}`} alert={alert} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {upcoming.length > 0 && (
                                <div className="px-6 py-4">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                                        <Clock size={14} />
                                        Due Within 7 Days — {upcoming.length} patient{upcoming.length !== 1 ? 's' : ''}
                                    </h3>
                                    <div className="space-y-2">
                                        {upcoming.map((alert, i) => (
                                            <AlertItem key={`upcoming-${i}`} alert={alert} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

const AlertItem = ({ alert }: { alert: IDashboardVaccinationAlert }) => {
    const patientName = `${alert.patient.khmer_last_name} ${alert.patient.khmer_first_name}`
    const englishName = alert.patient.first_name
        ? `${alert.patient.last_name ?? ''} ${alert.patient.first_name}`.trim()
        : null

    return (
        <Link
            href={`/patients/${alert.patient.id}?tab=vaccination`}
            className="flex items-center justify-between rounded-xl border border-primary-50/80 bg-primary-50/20 px-4 py-3 hover:bg-primary-50/40 hover:border-primary-200/50 transition-all duration-200"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                    {alert.is_overdue
                        ? <AlertTriangle size={16} className="text-red-500" />
                        : <Clock size={16} className="text-amber-500" />
                    }
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {patientName}
                        {englishName && <span className="text-gray-500 font-normal ml-1">({englishName})</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                        {alert.vaccine_name} — Dose {alert.dose_number} ({alert.doses_completed}/{alert.total_doses} completed)
                    </p>
                </div>
            </div>
            <div className="shrink-0 text-right">
                <span className={`text-xs font-medium ${alert.is_overdue ? 'text-red-600' : 'text-amber-600'}`}>
                    {alert.is_overdue ? 'Overdue: ' : 'Due: '}
                    {new Date(alert.due_date).toLocaleDateString('en-US', {
                        timeZone: 'Asia/Phnom_Penh',
                        month: 'short',
                        day: '2-digit',
                    })}
                </span>
            </div>
        </Link>
    )
}

export default Dashboard
