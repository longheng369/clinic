import { Box, Button } from '@mui/material'
import { usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Search } from 'lucide-react'
import MarForm from './partials/MarForm'
import MarGrid from './partials/MarGrid'
import { IMedicationOrder } from '@/interfaces/IMedicationOrder'
import { IPatient } from '@/interfaces/IPatient'
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
   const { medicationOrders, activeVisits, medicines } = usePage<{
      medicationOrders: PaginatedData<IMedicationOrder>
      activeVisits: { id: number; type: string; visit_date: string; created_by?: string }[]
      medicines: { id: number; name: string }[]
   }>().props

   const [searchTerm, setSearchTerm] = useState('')

   const filteredData = useMemo(() => {
      if (!searchTerm.trim()) return medicationOrders.data
      const q = searchTerm.toLowerCase()
      return medicationOrders.data.filter(
         (m) => m.medicine?.name.toLowerCase().includes(q) ?? false
      )
   }, [medicationOrders.data, searchTerm])

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
            <MarForm
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

   const handleEdit = (order: IMedicationOrder) => {
      openModal({
         title: 'Edit Prescription',
         content: (
            <MarForm
               patientId={patientId}
               activeVisits={activeVisits}
               medicines={medicines}
               order={order}
               selectedVisitId={selectedVisit.id}
               onClose={() => closeModal()}
            />
         ),
         config: { preventClickAway: true, maxWidth: '2xl' },
      })
   }

   const { data, ...pagination } = medicationOrders

   return (
      <Box>
         <Button onClick={handleCreate} startIcon={<Plus size={16} />} variant='contained'>
            Add Medicine
         </Button>

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
               orders={filteredData}
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
