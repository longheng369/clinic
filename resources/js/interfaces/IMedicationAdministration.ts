export interface IMedicationAdministration {
    id: number;
    medicine: { id: number; name: string } | null;
    route: string;
    dosage: number;
    unit: string;
    interval: string;
    status: 'prescribed' | 'provided' | 'continued' | 'stopped';
    notes: string | null;
    recorded_by?: string | null;
    created_at: string;
}

export interface IMedicationFormData {
    visit_id: number;
    medicine_id: number | null;
    route: string;
    dosage: number | null;
    unit: string;
    interval: string;
    notes: string;
}
