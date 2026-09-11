export interface IMedicationAdministration {
  id: number;
  cycle_no: number;
  administration_no: number | null;
  total_administrations: number | null;
  scheduled_at: string;
  administered_at: string | null;
  status: 'pending' | 'provided' | 'missed' | 'refused' | 'cancelled';
  administered_by: string | null;
  unit_price: number | null;
  reason: string | null;
  note: string | null;
}
