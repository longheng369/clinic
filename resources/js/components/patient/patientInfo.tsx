import { type ReactNode } from 'react'
import { IPatient } from '@/interfaces/IPatient'
import { formatDob } from '@/utils/date'
import { cn } from '@/utils/cn'

const InfoItem = ({ label, value, className }: { label: string; value: ReactNode; className?: string }) => (
   <div>
       <dt className="font-khmer text-gray-500 text-sm mb-0.5">{label}</dt>
      <dd className={cn('text-sm text-gray-900', className)}>
         {value ?? <span className="text-gray-300">&mdash;</span>}
      </dd>
   </div>
)

interface Props {
   patient: IPatient
   className?: string
   gridClassName?: string
   compact?: boolean
}

const PatientInfo = ({ patient, className, gridClassName, compact = false }: Props) => {
   const padding = compact ? 'p-4' : 'p-6'

   return (
      <div className={cn('rounded-xl border border-gray-300 bg-white h-fit', padding, className)}>
         <div className={cn('grid gap-6', gridClassName ?? 'grid-cols-3')}>
            <InfoItem label="ឈ្មោះខ្មែរ" value={`${patient.khmer_first_name} ${patient.khmer_last_name}`} className="font-khmer text-[16px]" />
            <InfoItem label="ឈ្មោះអង់គ្លេស" value={patient.first_name ? `${patient.last_name ?? ''} ${patient.first_name}`.trim() : null} />
            <InfoItem label="ថ្ងៃខែឆ្នាំកំណើត" value={formatDob(patient.date_of_birth)} />
            <InfoItem label="ទូរស័ព្ទ" value={patient.phone_number} />
            <InfoItem label="ភេទ" value={<span className="capitalize">{patient.gender}</span>} />
            <InfoItem label="ក្រុមឈាម" value={patient.blood_group} />
            <InfoItem label="អត្តសញ្ញាណប័ណ្ណ" value={patient.national_id} />
            <InfoItem label="អាសយដ្ឋាន" value={patient.address} />
            <InfoItem label="អាលែកហ្ស៊ី" value={patient.allergy} />
         </div>
      </div>
   )
}

export default PatientInfo
