import { usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Search } from 'lucide-react'
import MedicationForm from './partials/medicationForm'
import MarGrid from './partials/MarGrid'
import { IMedicationAdministration } from '@/interfaces/IMedicationAdministration'
import { IPatient } from '@/interfaces/IPatient'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/table/Pagination'
import { useState, useMemo } from 'react'
import { IVisitWithMetaData } from '@/interfaces/IVisit'

interface PaginatedData<T> {
   data: T[]
   current_page: number
   last_page: number
   per_page: number
   total: number
   from: number
   to: number
}

type Props = {
   patientId: number;
   patient: IPatient;
   selectedVisit: IVisitWithMetaData | null
}

const MedicationTab = ({ patientId, patient, selectedVisit }: Props) => {
   const { openModal, closeModal } = useModal()
   const { medicationAdministrations, activeVisits, medicines } = usePage<{
      medicationAdministrations: PaginatedData<IMedicationAdministration>
      activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
      medicines: { id: number; name: string }[]
   }>().props

   const [searchTerm, setSearchTerm] = useState('')

   const filteredData = useMemo(() => {
      if (!searchTerm.trim()) return medicationAdministrations.data
      const q = searchTerm.toLowerCase()
      return medicationAdministrations.data.filter(
         (m) => m.medicine?.name.toLowerCase().includes(q) ?? false
      )
   }, [medicationAdministrations.data, searchTerm])

   if (!selectedVisit) {
      return (
         <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Medication</h3>
            <p className="text-sm text-gray-500">Select a visit to view medications.</p>
         </div>
      )
   }

   const handleCreate = () => {
      openModal({
         title: 'Add to Drug Chart',
         content: (
            <MedicationForm
               patientId={patientId}
               activeVisits={activeVisits}
               medicines={medicines}
               selectedVisitId={selectedVisit.id}
               onClose={() => closeModal()}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const handleEdit = (prescription: IMedicationAdministration) => {
      openModal({
         title: 'Edit Prescription',
         content: (
            <MedicationForm
               patientId={patientId}
               activeVisits={activeVisits}
               medicines={medicines}
               medication={prescription}
               selectedVisitId={selectedVisit.id}
               onClose={() => closeModal()}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const { data, ...pagination } = medicationAdministrations

   return (
      <div>
         <div className="mb-4 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter prescriptions..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
               />
            </div>
            <Button onClick={handleCreate}>
               <Plus size={18} /> Add to Drug Chart
            </Button>
         </div>

         {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
               <p className="text-sm font-medium text-gray-900">No prescriptions found</p>
               <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try a different search term.' : 'Add medication to the drug chart for this patient.'}
               </p>
            </div>
         ) : (
            <MarGrid
               patient={patient}
               medications={filteredData}
               visitId={selectedVisit.id}
               onEdit={handleEdit}
            />
         )}

         {!searchTerm.trim() && data.length > 0 && (
            <div className="mt-4">
               <Pagination
                  meta={{
                     current_page: pagination.current_page,
                     last_page: pagination.last_page,
                     per_page: pagination.per_page,
                     total: pagination.total,
                     from: pagination.from,
                     to: pagination.to,
                  }}
                  baseUrl={window.location.pathname + window.location.search}
               />
            </div>
         )}
      </div>
   )
}

export default MedicationTab
