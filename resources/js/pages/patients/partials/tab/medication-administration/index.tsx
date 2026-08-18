import { Box } from '@mui/material'
import { usePage } from '@inertiajs/react'
import { Search } from 'lucide-react'
import MarGrid from '../medication/partials/MarGrid'
import { IMedicationOrder } from '@/interfaces/IMedicationOrder'
import { IPatient } from '@/interfaces/IPatient'
import Pagination from '@/components/table/Pagination'
import { useState, useMemo } from 'react'

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
   patient: IPatient
   visitId: number
}

const MedicationAdministrationTab = ({ patient, visitId }: Props) => {
   const { medicationOrders } = usePage<{
      medicationOrders: PaginatedData<IMedicationOrder>
   }>().props

   const [searchTerm, setSearchTerm] = useState('')

   const filteredData = useMemo(() => {
      if (!searchTerm.trim()) return medicationOrders.data
      const q = searchTerm.toLowerCase()
      return medicationOrders.data.filter(
         (m) => m.medicine?.name.toLowerCase().includes(q) ?? false
      )
   }, [medicationOrders.data, searchTerm])

   const { data, ...pagination } = medicationOrders

   return (
      <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Box sx={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
               <Box
                  component="span"
                  sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}
               >
                  <Search size={16} />
               </Box>
               <Box
                  component="input"
                  type="text"
                  placeholder="Search medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                     width: '100%',
                     pl: 4,
                     pr: 2,
                     py: 1,
                     borderRadius: 1,
                     border: '1px solid #cbd5e1',
                     fontSize: 14,
                     outline: 'none',
                     '&:focus': { borderColor: '#5a8f5a', boxShadow: '0 0 0 1px rgba(90,143,90,0.2)' },
                  }}
               />
            </Box>
         </Box>

         {filteredData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
               <Box sx={{ fontSize: 18, fontWeight: 600, color: '#475569', mb: 1 }}>No medications to administer</Box>
               <Box sx={{ color: '#94a3b8', fontSize: 14 }}>
                  {searchTerm ? 'Try a different search term.' : 'Add medication orders from the Medication Orders tab.'}
               </Box>
            </Box>
         ) : (
            <MarGrid
               patient={patient}
               orders={filteredData}
               visitId={visitId}
               showActions={false}
            />
         )}

         {!searchTerm.trim() && data.length > 0 && (
            <Box sx={{ mt: 2 }}>
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
                  only={['medicationOrders']}
               />
            </Box>
         )}
      </Box>
   )
}

export default MedicationAdministrationTab
