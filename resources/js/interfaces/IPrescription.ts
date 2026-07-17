export interface IPrescriptionItem {
    id: number;
    medicine: { id: number; name: string } | null;
    route: string;
    dosage: number;
    unit: string;
    frequency: string;
    duration_days: number | null;
    quantity: number | null;
    notes: string | null;
}

export interface IPrescription {
    id: number;
    visit_id: number;
    visit_type?: string;
    notes: string | null;
    recorded_by?: string | null;
    created_at: string;
    items: IPrescriptionItem[];
}

export interface IPrescriptionItemFormData {
    medicine_id: number | null;
    route: string;
    dosage: number | null;
    unit: string;
    frequency: string;
    duration_days: number | null;
    quantity: number | null;
    notes: string | null;
}

export interface IPrescriptionFormData {
    visit_id: number;
    notes: string | null;
    items: IPrescriptionItemFormData[];
}
