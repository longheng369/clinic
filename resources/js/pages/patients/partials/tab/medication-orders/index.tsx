import { Box, Button } from '@mui/material'
import { usePage } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Search } from 'lucide-react'
import MarForm from '../medication/partials/MarForm'
import MedicationOrderGroup from '../MedicationOrderGroup'
import { IMedicationOrder } from '@/interfaces/IMedicationOrder'
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
   patientId: number
   visitId: number
}

const MedicationOrdersTab = ({ patientId, visitId }: Props) => {
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

  const { data, ...pagination } = medicationOrders

  const handleCreate = () => {
    openModal({
      title: 'Add to Drug Chart',
      content: (
        <MarForm
          patientId={patientId}
          activeVisits={activeVisits}
          medicines={medicines}
          selectedVisitId={visitId}
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
          selectedVisitId={visitId}
          onClose={() => closeModal()}
        />
      ),
      config: { preventClickAway: true, maxWidth: '2xl' },
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
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
        <Button onClick={handleCreate} startIcon={<Plus size={16} />} variant="contained">
               Add Medicine
        </Button>
      </Box>

      {filteredData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Box sx={{ fontSize: 18, fontWeight: 600, color: '#475569', mb: 1 }}>No medication orders found</Box>
          <Box sx={{ color: '#94a3b8', fontSize: 14 }}>
            {searchTerm ? 'Try a different search term.' : 'Add medication to the drug chart for this patient.'}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredData.map((order) => (
            <MedicationOrderGroup
              key={order.id}
              order={order}
              visitId={visitId}
              onEdit={handleEdit}
            />
          ))}
        </Box>
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

export default MedicationOrdersTab
