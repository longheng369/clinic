import { usePage, router } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Trash2, Plus } from 'lucide-react'
import VaccinationForm from './vaccinationForm'
import VaccineCard from './VaccineCard'
import VaccinationAlertBanner from './VaccinationAlertBanner'
import { IPatient } from '@/interfaces/IPatient'
import { IPatientVaccination, IVaccineCardItem, IVaccinationAlert } from '@/interfaces/IPatientVaccination'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

interface VaccinationTabProps {
    patient: IPatient
}

const VaccinationTab = ({ patient }: VaccinationTabProps) => {
    const { openModal, closeModal, openAlert } = useModal()
    const { vaccinations, vaccines, vaccineCard, vaccinationAlerts } = usePage<{
        vaccinations: PaginatedData<IPatientVaccination>
        vaccines: { id: number; name: string }[]
        vaccineCard: IVaccineCardItem[]
        vaccinationAlerts: IVaccinationAlert[]
    }>().props

    const handleCreate = () => {
        openModal({
            title: 'Record Vaccination',
            content: <VaccinationForm patientId={patient.id} vaccines={vaccines} onClose={() => closeModal()} />,
            config: { preventClickAway: true },
        })
    }

    const handleDelete = (v: IPatientVaccination) => {
        openAlert({
            message: 'Delete this vaccination record?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patient.id}/vaccinations/${v.id}`),
        })
    }

    const columns: Column<IPatientVaccination>[] = [
        {
            header: 'Vaccine',
            className: 'font-medium text-gray-900',
            cell: (v) => v.vaccine?.name ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Dose #',
            cell: (v) => `Dose ${v.dose_number}`,
        },
        {
            header: 'Date Administered',
            className: 'whitespace-nowrap',
            cell: (v) =>
                new Date(v.administered_date).toLocaleDateString('en-US', {
                    timeZone: 'Asia/Phnom_Penh',
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }),
        },
        {
            header: 'Administered By',
            cell: (v) => v.administered_by ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Notes',
            className: 'max-w-xs truncate',
            cell: (v) => v.notes ?? <span className="text-gray-300">&mdash;</span>,
        },
        {
            header: 'Actions',
            className: 'text-end',
            cell: (v) => (
                <div className="flex items-center justify-end">
                    <IconButton color="error" onClick={() => handleDelete(v)} aria-label="Delete vaccination">
                        <Trash2 size={16} />
                    </IconButton>
                </div>
            ),
        },
    ]

    const { data, ...pagination } = vaccinations
    const baseUrl = `/patients/${patient.id}`

    return (
        <div className="space-y-6">
            <VaccinationAlertBanner alerts={vaccinationAlerts} />

            <VaccineCard patient={patient} cardData={vaccineCard} />

            <div>
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Vaccination records for this patient</p>
                    <Button onClick={handleCreate}>
                        <Plus size={18} /> Record Vaccination
                    </Button>
                </div>

                <DataTable
                    data={data}
                    keyExtractor={(v) => v.id}
                    columns={columns}
                    emptyMessage="No vaccinations recorded"
                    emptyDescription="Record a vaccination for this patient."
                    pagination={pagination}
                    baseUrl={baseUrl}
                />
            </div>
        </div>
    )
}

export default VaccinationTab
