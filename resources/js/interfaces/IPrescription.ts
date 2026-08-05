export interface IPrescriptionItem {
   id: number;
   medicine: { id: number; name: string } | null;
   route: string;
   dosage: number;
   unit: string;
   frequency: string;
   duration_days: number | null;
   quantity: number | null;
   notes: string | null;
}

export interface IPrescription {
   id: number;
   visit_id: number;
   visit_type?: string;
   notes: string | null;
   recorded_by?: string | null;
   created_at: string;
   items: IPrescriptionItem[];
}

export interface IPrescriptionItemFormData {
   medicine: {
      id: number;
      name: string;
   };
   quantity: number;
   unit: {
      id: number;
      name: string;
   };
   route: string;
   morning: number | null;
   afternoon: number | null;
   evening: number | null;
   night: number | null;
   numberOfDay: number;
   notes: string | null;
}

export interface IPrescriptionFormData {
   visit_id: number;
   notes: string | null;
   items: IPrescriptionItemFormData[];
}
