export interface IVaccineDose {
    dose_number: number;
    interval_days: number;
}

export interface IVaccineRule {
    min_age_months: number;
    max_age_months: number | null;
    doses: IVaccineDose[];
}

export interface IVaccine {
    id: number;
    name: string;
    description: string | null;
    rules: IVaccineRule[];
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface IVaccineFormData {
    name: string;
    description: string | null;
    rules: IVaccineRule[];
}
