import { Box } from '@mui/material'
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
         <Box>
            <Box>Medication</Box>
            <Box>Select a visit to view medications.</Box>
         </Box>
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
      <Box>
         <Box>
            <Box>
               <Search size={16} />
               <Box
                  component="input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter prescriptions..."
               />
            </Box>
            <Button onClick={handleCreate}>
               <Plus size={18} /> Add to Drug Chart
            </Button>
         </Box>

         {filteredData.length === 0 ? (
            <Box>
               <Box>No prescriptions found</Box>
               <Box>
                  {searchTerm ? 'Try a different search term.' : 'Add medication to the drug chart for this patient.'}
               </Box>
            </Box>
         ) : (
            <MarGrid
               patient={patient}
               medications={filteredData}
               visitId={selectedVisit.id}
               onEdit={handleEdit}
            />
         )}

         {!searchTerm.trim() && data.length > 0 && (
            <Box>
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
            </Box>
         )}
      </Box>
   )
}

export default MedicationTab
