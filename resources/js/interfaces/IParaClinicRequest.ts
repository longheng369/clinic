export interface IParaClinicRequest {
  id: number;

}

export interface IParaClinicRequestTest {
  id?: number;
  test_category: string;
  test_name: string;
  priority: string;
  instruction: string | null;
}

export interface IParaClinicResult {
  id: number;
  result_date: string | null;
  result_summary: string | null;
  doctor_interpretation: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface IParaClinicAttachment {
  id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string | null;
  created_at: string;
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
  doctor_id: number;
  doctor: { id: number; name: string } | null;
  visit_id: number | null;
  external_facility_name: string | null;
  request_date: string;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status: string;
  subtotal: number;
  total_amount: number;
  payment_status: string;
  payment_date: string | null;
  tests: IParaClinicRequestTest[];
  results: IParaClinicResult[];
  attachments: IParaClinicAttachment[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IParaClinicRequestFormData {
  patient_id: number | null;
  doctor_id: number | null;
  visit_id: number | null;
  request_date: string;
  clinical_reason: string | null;
  provisional_diagnosis: string | null;
  notes: string | null;
  status?: string;
  subtotal: number;
  total_amount: number;
  payment_status: string;
  payment_date: string | null;
  tests: IParaClinicRequestTest[];
}
