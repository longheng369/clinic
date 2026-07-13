import { useRef } from 'react'
import { Printer, Syringe, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { IPatient } from '@/interfaces/IPatient'
import { formatDob } from '@/utils/date'
import { IVaccineCardItem } from '@/interfaces/IPatientVaccination'
import Button from '@/components/button/button'

interface VaccineCardProps {
    patient: IPatient
    cardData: IVaccineCardItem[]
}

const VaccineCard = ({ patient, cardData }: VaccineCardProps) => {
    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = () => {
        const originalTitle = document.title
        document.title = `Vaccination Card - ${patient.khmer_last_name} ${patient.khmer_first_name}`
        window.print()
        document.title = originalTitle
    }

    const ageInMonths = (() => {
        const dob = new Date(patient.date_of_birth)
        const now = new Date()
        return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth())
    })()

    const ageDisplay = ageInMonths >= 12
        ? `${Math.floor(ageInMonths / 12)} year${Math.floor(ageInMonths / 12) > 1 ? 's' : ''} ${ageInMonths % 12} month${ageInMonths % 12 !== 1 ? 's' : ''}`
        : `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`

    return (
        <div ref={printRef}>
            <div className="mb-4 flex items-center justify-between print:hidden">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Syringe size={16} className="text-primary-500" />
                    Vaccination Card
                </h3>
                <Button onClick={handlePrint} variant="outlined" color="secondary" startIcon={<Printer size={16} />}>
                    Print Vaccine Card
                </Button>
            </div>

            <div className="vaccine-card-print border border-gray-200 rounded-xl bg-white overflow-hidden">
                {/* Card header */}
                <div className="bg-primary-500 px-6 py-4 print:bg-gray-100 print:text-black">
                    <h2 className="text-lg font-bold text-white print:text-gray-900">Vaccination Card</h2>
                </div>

                {/* Patient info */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Patient:</span>
                            <span className="ml-2 font-medium text-gray-900">
                                {patient.khmer_last_name} {patient.khmer_first_name}
                            </span>
                            {patient.first_name && (
                                <span className="ml-1 text-gray-500">
                                    ({patient.last_name ?? ''} {patient.first_name})
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-gray-500">DOB:</span>
                            <span className="ml-2 text-gray-900">{formatDob(patient.date_of_birth)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Age:</span>
                            <span className="ml-2 text-gray-900">{ageDisplay}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Phone:</span>
                            <span className="ml-2 text-gray-900">{patient.phone_number}</span>
                        </div>
                    </div>
                </div>

                {/* Vaccine cards */}
                <div className="px-6 py-4">
                    {cardData.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No vaccines defined.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cardData.map((item) => (
                                <div
                                    key={item.vaccine.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-sm text-gray-900">{item.vaccine.name}</h4>
                                        {item.total_doses > 0 && item.doses_completed >= item.total_doses ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                <CheckCircle size={12} /> Completed
                                            </span>
                                        ) : item.next_dose_due_date ? (
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                new Date(item.next_dose_due_date) < new Date()
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {new Date(item.next_dose_due_date) < new Date() ? (
                                                    <AlertTriangle size={12} />
                                                ) : (
                                                    <Clock size={12} />
                                                )}
                                                {new Date(item.next_dose_due_date) < new Date() ? 'Overdue' : 'Pending'}
                                            </span>
                                        ) : item.eligible ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                <CheckCircle size={12} /> Complete
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                                Not eligible
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    {item.total_doses > 0 && (
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>{item.doses_completed} of {item.total_doses} doses</span>
                                                <span>{Math.round((item.doses_completed / item.total_doses) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-1.5 rounded-full bg-primary-500 transition-all"
                                                    style={{ width: `${(item.doses_completed / item.total_doses) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Next dose info */}
                                    {item.next_dose_number && item.next_dose_due_date ? (
                                        <div className="text-xs text-gray-600 mt-1">
                                            <span className="font-medium">Next:</span> Dose {item.next_dose_number} — {item.next_dose_due_date}
                                        </div>
                                    ) : item.doses_completed >= item.total_doses && item.total_doses > 0 ? (
                                        <div className="text-xs text-green-600 mt-1 font-medium">All doses completed</div>
                                    ) : item.eligible ? (
                                        <div className="text-xs text-gray-400 mt-1">Ready for dose 1</div>
                                    ) : (
                                        <div className="text-xs text-gray-400 mt-1">Outside age range for this vaccine</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Print styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .vaccine-card-print,
                    .vaccine-card-print * {
                        visibility: visible;
                    }
                    .vaccine-card-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none;
                        margin: 0;
                        padding: 0;
                    }
                    .vaccine-card-print .bg-primary-500 {
                        background-color: #f3f4f6 !important;
                        color: #111827 !important;
                    }
                    @page {
                        margin: 1.5cm;
                    }
                }
            `}</style>
        </div>
    )
}

export default VaccineCard
