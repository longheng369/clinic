import type { IMedicationAdministration } from './IMedicationAdministration'

export interface IMedicationOrder {
   id: number;
   medicine: { id: number; name: string; unit_price: number | null } | null;
   route: string;
   dosage: number;
   unit: string;
   interval: string;
   duration: number | null;
   cycle_no: number;
   status: 'active' | 'on_hold' | 'stopped' | 'completed';
   starts_at: string | null;
   notes: string | null;
   created_by?: string | null;
   created_at: string;
   administrations: IMedicationAdministration[];
}

export interface IMedicationOrderFormData {
   visit_id: number;
   medicine_id: number | null;
   route: string;
   dosage: number | null;
   unit: string;
   interval: string;
   duration: number | null;
   starts_at: string;
   notes: string;
}
