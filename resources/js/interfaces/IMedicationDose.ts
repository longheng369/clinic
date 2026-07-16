export interface IMedicationDose {
    id: number;
    scheduled_at: string;
    administered_at: string | null;
    status: 'pending' | 'administered' | 'skipped';
    administered_by: string | null;
    unit_price: number | null;
    skip_reason: string | null;
}
