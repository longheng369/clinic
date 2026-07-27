import { type ReactNode } from 'react'
import { IPatient } from '@/interfaces/IPatient'
import { formatDob } from '@/utils/date'
import { cn } from '@/utils/cn'

const InfoItem = ({ label, value, className }: { label: string; value: ReactNode; className?: string }) => (
    <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">{label}</dt>
        <dd className={cn('text-sm text-gray-900', className)}>
            {value ?? <span className="text-gray-300">&mdash;</span>}
        </dd>
    </div>
)

interface Props {
    patient: IPatient
    title?: string
    className?: string
    gridClassName?: string
    compact?: boolean
}

const PatientInfo = ({ patient, title = 'Basic Information', className, gridClassName, compact = false }: Props) => {
    const padding = compact ? 'p-4' : 'p-6'

    return (
        <div className={cn('rounded-xl border border-gray-300 bg-white', padding, className)}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">{title}</h2>
            <div className={cn('grid gap-6', gridClassName ?? 'grid-cols-3')}>
                <InfoItem label="Khmer Name" value={`${patient.khmer_last_name} ${patient.khmer_first_name}`} className="font-khmer text-[16px]" />
                <InfoItem label="English Name" value={patient.first_name ? `${patient.last_name ?? ''} ${patient.first_name}`.trim() : null} />
                <InfoItem label="Date of Birth" value={formatDob(patient.date_of_birth)} />
                <InfoItem label="Phone Number" value={patient.phone_number} />
                <InfoItem label="Gender" value={<span className="capitalize">{patient.gender}</span>} />
                <InfoItem label="Blood Group" value={patient.blood_group} />
                <InfoItem label="National ID" value={patient.national_id} />
                <InfoItem label="Address" value={patient.address} />
                <InfoItem label="Allergy" value={patient.allergy} />
            </div>
        </div>
    )
}

export default PatientInfo
