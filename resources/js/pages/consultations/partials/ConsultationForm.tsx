import { type Control } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import ConsultationSection from './ConsultationSection'
import {
    respiratorySymptoms,
    cardiovascularSymptoms,
    neurologicalSymptoms,
    musculoskeletalSymptoms,
    digestiveSymptoms,
    renalReproductiveSymptoms,
    skinSymptoms,
    eyeSymptoms,
    earSymptoms,
    noseSymptoms,
    throatSymptoms,
    psycologySymptoms,
} from '../consultationTemplate'
import { IConsultationFormData } from '@/interfaces/IConsultation'

type Props = {
    control: Control<IConsultationFormData>
    viewOnly?: boolean
}

const ConsultationForm = ({ control, viewOnly }: Props) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                    <Input
                        control={control}
                        name="weight"
                        label="Weight (kg)"
                        type="number"
                        min={0}
                        placeholder="e.g. 65"
                        disabled={viewOnly}
                        rules={{ required: 'Required' }}
                    />
                </div>
                <div className="col-span-10">
                    <Input
                        control={control}
                        name="chief_complaint"
                        label="Chief complaint"
                        placeholder="Describe the main complaint..."
                        disabled={viewOnly}
                        rules={{ required: 'This field is required' }}
                    />
                </div>

                <ConsultationSection
                    control={control}
                    name="respiratory_system_symptoms"
                    options={respiratorySymptoms}
                    title="1. Respiratory system"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="cardiovascular_symptoms"
                    options={cardiovascularSymptoms}
                    title="2. Cardiovascular"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="neurological_symptoms"
                    options={neurologicalSymptoms}
                    title="3. Neurological"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="musculoskeletal_symptoms"
                    options={musculoskeletalSymptoms}
                    title="4. Musculoskeletal"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="digestive_symptoms"
                    options={digestiveSymptoms}
                    title="5. Digestive"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="renal_reproductive_symptoms"
                    options={renalReproductiveSymptoms}
                    title="6. Renal / Reproductive"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="skin_symptoms"
                    options={skinSymptoms}
                    title="7. Skin"
                    disabled={viewOnly}
                />

                <div className="col-span-12">
                    <h3 className="text-sm font-semibold text-gray-900">8. EYES / EARS / THROAT / MOUTH</h3>
                </div>

                <ConsultationSection
                    control={control}
                    name="eye_symptoms"
                    options={eyeSymptoms}
                    title="EYE"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="ear_symptoms"
                    options={earSymptoms}
                    title="EAR"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="nose_symptoms"
                    options={noseSymptoms}
                    title="NOSE"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="throat_symptoms"
                    options={throatSymptoms}
                    title="THROAT"
                    disabled={viewOnly}
                />

                <ConsultationSection
                    control={control}
                    name="psycology_symptoms"
                    options={psycologySymptoms}
                    title="PSYCOLOGY"
                    disabled={viewOnly}
                />

                <div className="col-span-12">
                    <Input
                        control={control}
                        name="diagnosis"
                        label="Diagnosis"
                        placeholder="Enter diagnosis"
                        disabled={viewOnly}
                    />
                </div>

                <div className="col-span-12">
                    <Textarea
                        control={control}
                        name="note"
                        label="Notes"
                        placeholder="Additional notes..."
                        rows={4}
                        disabled={viewOnly}
                    />
                </div>

                <div className="col-span-2">
                    <Input
                        control={control}
                        name="fee"
                        label="Fee ($)"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        disabled={viewOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default ConsultationForm
