export interface IParaClinicRequestTest {
  id?: number;
  diagnostic_test_id: number | null;
  test_category: string;
  test_name: string;
  price: number | null;
  priority: string;
  instruction: string | null;
}

export interface IParaClinicRequestTestFormData {
  diagnostic_test_id: number | null;
  priority: string;
  instruction: string | null;
}

export interface IParaClinicRequest {
  id: number;
  request_number: string;
  patient_id: number;
  patient: {
    id: number;
    khmer_first_name: string;
    khmer_last_name: string;
    phone_number?: string;
    gender?: string;
  } | null;
  visit_id: number | null;
  external_facility_name: string | null;
  request_date: string;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status: string;
  fee: number | null;
  payment_status: string;
  payment_date: string | null;
  tests: IParaClinicRequestTest[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IParaClinicRequestFormData {
  patient_id: number | null;
  visit_id: number | null;
  external_facility_name: string;
  request_date: string;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status?: string;
  fee: number | null;
  payment_status: string;
  payment_date: string | null;
  tests: IParaClinicRequestTestFormData[];
}
