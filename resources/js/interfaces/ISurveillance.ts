export interface ISurveillance {
  id: number;
  patient_id: number;
  visit_id: number | null;
  systolic: number;
  diastolic: number;
  pulse: number;
  temperature: number;
  rr: number;
  spo2: number;
  o2_supply: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ISurveillanceFormData {
  visit_id?: number;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  temperature: number | null;
  rr: number | null;
  spo2: number | null;
  o2_supply: string;
}
