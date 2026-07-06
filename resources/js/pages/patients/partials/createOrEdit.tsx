import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Select from '@/components/form/select'
import Textarea from '@/components/form/textarea'
import { IPatient, IPatientFormData } from '@/interfaces/IPatient';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '@/components/button/button';
import { useToast } from '@/components/toast'

interface PatientFormProps {
    patient?: IPatient;
    onClose: () => void;
}

const BLOOD_GROUPS = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
]

const PatientForm = ({ patient, onClose }: PatientFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<IPatientFormData>({
        defaultValues: patient ?? {
            gender: 'male',
        }
    });

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true);
        if (patient) {
            router.put(`/patients/${patient.id}`, { ...data }, {
                onSuccess: () => {
                    onClose();
                    toast('Patient updated successfully!', { variant: 'success', description: 'The patient has been updated.' });
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });

            return;
        }

        router.post('/patients', { ...data }, {
            onSuccess: () => {
                onClose();
                toast('Patient created successfully!', { variant: 'success', description: 'The patient has been created.' })
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300 overflow-y-auto" noValidate>
            <div className="space-y-4 p-6 max-h-[70vh]">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Khmer First Name"
                        control={control}
                        placeholder="Enter Khmer first name"
                        name="khmer_first_name"
                        rules={{ required: 'This field is required' }}
                        style={{ fontFamily: "'Seireab', 'Serey', 'Khmer OS', 'Noto Sans Khmer', sans-serif" }}
                    />
                    <Input
                        label="Khmer Last Name"
                        control={control}
                        placeholder="Enter Khmer last name"
                        name="khmer_last_name"
                        rules={{ required: 'This field is required' }}
                        style={{ fontFamily: "'Seireab', 'Serey', 'Khmer OS', 'Noto Sans Khmer', sans-serif" }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name (English)"
                        control={control}
                        placeholder="Enter first name"
                        name="first_name"
                    />
                    <Input
                        label="Last Name (English)"
                        control={control}
                        placeholder="Enter last name"
                        name="last_name"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Date of Birth"
                        control={control}
                        placeholder="Enter date of birth"
                        name="date_of_birth"
                        rules={{ required: 'This field is required' }}
                    />
                    <Input
                        label="Phone Number"
                        control={control}
                        placeholder="Enter phone number"
                        name="phone_number"
                        rules={{ required: 'This field is required' }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Gender"
                        control={control}
                        name="gender"
                        rules={{ required: 'This field is required' }}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                        ]}
                    />
                    <Select
                        label="Blood Group"
                        control={control}
                        name="blood_group"
                        options={BLOOD_GROUPS}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="National ID"
                        control={control}
                        placeholder="Enter national ID"
                        name="national_id"
                    />
                    <Input
                        label="Address"
                        control={control}
                        placeholder="Enter address"
                        type="number"
                        name="address"
                    />
                </div>

                <Textarea
                    label="Allergy"
                    control={control}
                    name="allergy"
                    placeholder="Enter allergy information"
                />
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button
                    type="button"
                    onClick={onClose}
                    color='secondary'
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isProcessing}
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default PatientForm
