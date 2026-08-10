export interface IPatient {
   id: number;
   khmer_first_name: string;
   khmer_last_name: string;
   first_name: string | null;
   last_name: string | null;
   date_of_birth: string;
   address: number | null;
   blood_group: string | null;
   phone_number: string;
   gender: string;
   allergy: string | null;
   created_by: number | null;
   last_modifier: number | null;
   national_id: string | null;
   created_at: string;
   updated_at: string;
}

export interface IPatientFormData {
   khmer_first_name: string;
   khmer_last_name: string;
   first_name: string | null;
   last_name: string | null;
   date_of_birth: string;
   address: number | null;
   blood_group: string | null;
   phone_number: string;
   gender: string;
   allergy: string | null;
   national_id: string | null;
}
