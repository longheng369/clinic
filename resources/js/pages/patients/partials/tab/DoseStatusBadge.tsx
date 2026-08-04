import type { IMedicationDose } from '@/interfaces/IMedicationDose'

const DOSE_STATUS: Record<string, { label: string; className: string }> = {
   pending: { label: 'Pending', className: 'bg-blue-100 text-blue-700' },
   provided: { label: 'Provided', className: 'bg-green-100 text-green-700' },
   missed: { label: 'Missed', className: 'bg-orange-100 text-orange-700' },
   refused: { label: 'Refused', className: 'bg-purple-100 text-purple-700' },
   cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
   overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
}

function getEffectiveStatus(dose: IMedicationDose): string {
   if (dose.status === 'pending' && new Date(dose.scheduled_at) < new Date()) {
      return 'overdue'
   }
   return dose.status
}

interface DoseStatusBadgeProps {
    dose: IMedicationDose
}

const DoseStatusBadge = ({ dose }: DoseStatusBadgeProps) => {
   const effective = getEffectiveStatus(dose)
   const badge = DOSE_STATUS[effective]

   return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
         {badge.label}
      </span>
   )
}

export { DOSE_STATUS, getEffectiveStatus }
export default DoseStatusBadge
