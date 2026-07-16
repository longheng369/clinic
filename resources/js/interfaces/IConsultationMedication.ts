export interface IConsultationMedication {
    id: string
    medicationName: string
    strength: string
    dosageForm: string
    route: string
    dosage: string
    frequency: string
    duration: string
    quantity: string
    instruction: string
    startDate: string
    status: string
    notes: string
    takenDoses: number
}

export interface IConsultationMedicationFormData {
    medicationName: string
    strength: string
    dosageForm: string
    route: string
    dosage: string
    frequency: string
    duration: string
    quantity: string
    instruction: string
    startDate: string
    status: string
    notes: string
}
