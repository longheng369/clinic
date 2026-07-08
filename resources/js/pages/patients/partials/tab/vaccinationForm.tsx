import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import Select from '@/components/form/select'
import { IPatientVaccinationFormData } from '@/interfaces/IPatientVaccination'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import Button from '@/components/button/button'
import { useToast } from '@/components/toast'

interface VaccinationFormProps {
    patientId: number
    vaccines: { id: number; name: string }[]
    onClose: () => void
}

const VaccinationForm = ({ patientId, vaccines, onClose }: VaccinationFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<IPatientVaccinationFormData>({
        defaultValues: {
            vaccine_id: null,
            dose_number: null,
            administered_date: new Date().toISOString().split('T')[0],
            notes: '',
        },
    })

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        router.post(`/patients/${patientId}/vaccinations`, { ...data }, {
            onSuccess: () => {
                onClose()
                toast('Vaccination recorded!', { variant: 'success', description: 'The vaccination has been recorded.' })
            },
            onError: (errors) => {
                if (errors.vaccine_id) {
                    toast('Unable to record vaccination', {
                        variant: 'error',
                        description: errors.vaccine_id,
                    })
                }
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                <Select
                    label="Vaccine"
                    control={control}
                    name="vaccine_id"
                    options={vaccines.map((v) => ({ value: v.id, label: v.name }))}
                    rules={{ required: 'This field is required' }}
                />

                <Input
                    label="Dose Number"
                    control={control}
                    name="dose_number"
                    type="number"
                    min={1}
                    placeholder="e.g. 1"
                    rules={{ required: 'This field is required' }}
                />

                <Input
                    label="Date Administered"
                    control={control}
                    name="administered_date"
                    type="date"
                    rules={{ required: 'This field is required' }}
                />

                <Textarea
                    label="Notes"
                    control={control}
                    name="notes"
                />
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                    Record
                </Button>
            </div>
        </form>
    )
}

export default VaccinationForm
