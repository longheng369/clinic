export interface IPatientVaccination {
    id: number;
    vaccine: { id: number; name: string } | null;
    dose_number: number;
    administered_date: string;
    notes: string | null;
    administered_by: string | null;
    created_at: string;
}

export interface IPatientVaccinationFormData {
    vaccine_id: number | null;
    dose_number: number | null;
    administered_date: string;
    notes: string;
}

export interface IVaccineCardItem {
    vaccine: { id: number; name: string };
    eligible: boolean;
    doses_completed: number;
    total_doses: number;
    next_dose_number: number | null;
    next_dose_due_date: string | null;
}

export interface IVaccinationAlert {
    vaccine: { id: number; name: string };
    doses_completed: number;
    total_doses: number;
    next_dose_number: number;
    next_dose_due_date: string;
}

export interface IDashboardVaccinationAlert {
    patient: {
        id: number;
        khmer_first_name: string;
        khmer_last_name: string;
        first_name: string | null;
        last_name: string | null;
    };
    vaccine_name: string;
    dose_number: number;
    doses_completed: number;
    total_doses: number;
    due_date: string;
    is_overdue: boolean;
}
