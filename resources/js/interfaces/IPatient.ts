export interface IPatient {
  id: number;
  khmer_first_name: string;
  khmer_last_name: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string;
  address: number | null;
  province?: {
    code: number | null;
    name_in_khmer: string | null;
    name_in_latin: string | null;
  };
  district?: {
    code: number | null;
    name_in_khmer: string | null;
    name_in_latin: string | null;
  };
  commune?: {
    code: number | null;
    name_in_khmer: string | null;
    name_in_latin: string | null;
  };
  village?: {
    code: number | null;
    name_in_khmer: string | null;
    name_in_latin: string | null;
  };
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
  province_code: number | null;
  district_code: number | null;
  commune_code: number | null;
  village_code: number | null;
  blood_group: string | null;
  phone_number: string;
  gender: string;
  allergy: string | null;
  national_id: string | null;
}
