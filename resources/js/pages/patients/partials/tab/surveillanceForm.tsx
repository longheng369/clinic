import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import { ISurveillance, ISurveillanceFormData } from '@/interfaces/ISurveillance'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import Button from '@/components/button/button'
import { useToast } from '@/components/toast'

const O2_OPTIONS = [
    { value: 'Room Air', label: 'Room Air' },
    { value: 'Nasal Cannula', label: 'Nasal Cannula' },
    { value: 'Face Mask', label: 'Face Mask' },
    { value: 'Non-Rebreather Mask', label: 'Non-Rebreather Mask' },
    { value: 'Ventilator', label: 'Ventilator' },
    { value: 'CPAP/BiPAP', label: 'CPAP/BiPAP' },
    { value: 'High Flow Nasal Cannula', label: 'High Flow Nasal Cannula' },
]

interface SurveillanceFormProps {
    patientId: number
    surveillance?: ISurveillance
    onClose: () => void
}

const SurveillanceForm = ({ patientId, surveillance, onClose }: SurveillanceFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<ISurveillanceFormData>({
        defaultValues: surveillance ?? {
            systolic: null,
            diastolic: null,
            pulse: null,
            temperature: null,
            rr: null,
            spo2: null,
            o2_supply: '',
        },
    })

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        if (surveillance) {
            router.put(`/patients/${patientId}/surveillances/${surveillance.id}`, { ...data }, {
                onSuccess: () => {
                    onClose()
                    toast('Surveillance record updated!', { variant: 'success' })
                },
                onFinish: () => setIsProcessing(false),
            })
            return
        }

        router.post(`/patients/${patientId}/surveillances`, { ...data }, {
            onSuccess: () => {
                onClose()
                toast('Surveillance record created!', { variant: 'success' })
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Systolic (mmHg)"
                        control={control}
                        type="number"
                        min={0}
                        max={300}
                        placeholder="e.g. 120"
                        name="systolic"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 300, message: 'Max 300' } }}
                    />
                    <Input
                        label="Diastolic (mmHg)"
                        control={control}
                        type="number"
                        min={0}
                        max={200}
                        placeholder="e.g. 80"
                        name="diastolic"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 200, message: 'Max 200' } }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Pulse (bpm)"
                        control={control}
                        type="number"
                        min={0}
                        max={300}
                        placeholder="e.g. 72"
                        name="pulse"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 300, message: 'Max 300' } }}
                    />
                    <Input
                        label="Temperature (°C)"
                        control={control}
                        type="number"
                        step="0.1"
                        min={30}
                        max={45}
                        placeholder="e.g. 36.5"
                        name="temperature"
                        rules={{ required: 'Required', min: { value: 30, message: 'Min 30' }, max: { value: 45, message: 'Max 45' } }}
                    />
                    <Input
                        label="RR (breaths/min)"
                        control={control}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 16"
                        name="rr"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="SpO₂ (%)"
                        control={control}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 98"
                        name="spo2"
                        rules={{ required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
                    />
                    <Select
                        label="O₂ Supply"
                        control={control}
                        name="o2_supply"
                        options={O2_OPTIONS}
                        rules={{ required: 'This field is required' }}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button type="submit" disabled={isProcessing}>Submit</Button>
            </div>
        </form>
    )
}

export default SurveillanceForm
