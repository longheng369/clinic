import { usePage, router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Plus, Search, Pencil, Trash2, ChevronDown } from 'lucide-react'
import PrescriptionForm from './prescriptionForm'
import { IPrescription } from '@/interfaces/IPrescription'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/table/DataTable'
import { useState, useMemo } from 'react'
import IconButton from '@/components/button/iconButton'
import { cn } from '@/utils/cn'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

interface SelectedVisit {
    id: number
    type: string
    visit_date: string
    status: string
    recorded_by?: string
}

const PrescriptionTab = ({ patientId, selectedVisit }: { patientId: number; selectedVisit: SelectedVisit | null }) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { prescriptions, activeVisits, medicines } = usePage<{
        prescriptions: PaginatedData<IPrescription>
        activeVisits: { id: number; type: string; visit_date: string; recorded_by?: string }[]
        medicines: { id: number; name: string }[]
    }>().props

    const [searchTerm, setSearchTerm] = useState('')
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return prescriptions.data
        const q = searchTerm.toLowerCase()
        return prescriptions.data.filter((p) =>
            p.items.some((i) => i.medicine?.name.toLowerCase().includes(q) ?? false)
        )
    }, [prescriptions.data, searchTerm])

    if (!selectedVisit) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Prescriptions</h3>
                <p className="text-sm text-gray-500">Select a visit to view prescriptions.</p>
            </div>
        )
    }

    const handleCreate = () => {
        openModal({
            title: 'New Prescription',
            content: (
                <PrescriptionForm
                    patientId={patientId}
                    activeVisits={activeVisits}
                    medicines={medicines}
                    selectedVisitId={selectedVisit.id}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '5xl' },
        })
    }

    const handleEdit = (prescription: IPrescription) => {
        openModal({
            title: 'Edit Prescription',
            content: (
                <PrescriptionForm
                    patientId={patientId}
                    activeVisits={activeVisits}
                    medicines={medicines}
                    prescription={prescription}
                    selectedVisitId={selectedVisit.id}
                    onClose={() => closeModal()}
                />
            ),
            config: { preventClickAway: true, maxWidth: '5xl' },
        })
    }

    const handleDelete = (prescription: IPrescription) => {
        openAlert({
            message: 'Delete this prescription?',
            description: `${prescription.items.length} medicine(s) will be removed. This action cannot be undone.`,
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patientId}/prescriptions/${prescription.id}`),
        })
    }

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const { data, ...pagination } = prescriptions

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
                    <Plus size={18} /> New Prescription
                </Button>
            </div>

            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm font-medium text-gray-900">No prescriptions found</p>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try a different search term.' : 'Add a prescription for this patient.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((prescription) => (
                        <div key={prescription.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                            <button
                                onClick={() => toggleExpand(prescription.id)}
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                Prescription #{prescription.id}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {prescription.items.length} medicine{prescription.items.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {new Date(prescription.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            {prescription.recorded_by && (
                                                <>
                                                    <span className="text-gray-300">&middot;</span>
                                                    <span className="text-xs text-gray-500">by {prescription.recorded_by}</span>
                                                </>
                                            )}
                                        </div>
                                        {prescription.notes && (
                                            <p className="mt-1 text-xs text-gray-400 truncate max-w-md">{prescription.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(prescription) }} aria-label="Edit prescription">
                                        <Pencil size={14} />
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(prescription) }} color="error" aria-label="Delete prescription">
                                        <Trash2 size={14} />
                                    </IconButton>
                                    <ChevronDown
                                        size={18}
                                        className={cn('text-gray-400 transition-transform duration-200', expandedId === prescription.id && 'rotate-180')}
                                    />
                                </div>
                            </button>

                            {expandedId === prescription.id && (
                                <div className="border-t border-gray-100">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-gray-50">
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Medicine</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Dosage</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Frequency</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Qty</th>
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {prescription.items.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                                                            {item.medicine?.name ?? <span className="text-gray-300">&mdash;</span>}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-600">{item.route}</td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-600">
                                                            {item.dosage} {item.unit}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-600">{item.frequency}</td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-600">
                                                            {item.duration_days ? `${item.duration_days} days` : <span className="text-gray-300">&mdash;</span>}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-600">
                                                            {item.quantity ?? <span className="text-gray-300">&mdash;</span>}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[200px] truncate">
                                                            {item.notes ?? <span className="text-gray-300">&mdash;</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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

export default PrescriptionTab