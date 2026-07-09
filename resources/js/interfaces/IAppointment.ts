export interface IAppointment {
    id: number;
    patient: { id: number; khmer_first_name: string; khmer_last_name: string } | null;
    appointment_date: string;
    appointment_time: string | null;
    type: string;
    status: string;
    notes: string | null;
    has_vaccine_alerts: boolean;
    created_by: string | null;
    created_at: string;
}

export interface IAppointmentFormData {
    patient_id: number | null;
    appointment_date: string;
    appointment_time: string;
    type: string;
    notes: string;
}

export interface IAppointmentAlert {
    vaccine_name: string;
    dose_number: number;
    doses_completed: number;
    total_doses: number;
    due_date: string;
    is_overdue: boolean;
}
