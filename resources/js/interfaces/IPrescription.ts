import { IOption } from "./IOption";

export interface IPrescriptionItem {
   id: number;
   medicine: { id: number; name: string } | null;
   route: string;
   dosage: number;
   unit: string;
   frequency: string;
   number_of_day: number | null;
   quantity: number | null;
   notes: string | null;
   instruction: string;
}

export interface IPrescription {
   id: number;
   visit_id: number;
   visit_type?: string;
   notes: string | null;
   created_by?: string | null;
   created_at: string;
   items: IPrescriptionItem[];
}

export interface IPrescriptionItemFormData {
   medicine: {
      id: number;
      name: string;
   };
   quantity: number | null;
   unit: {
      id: number;
      name: string;
   };
   route: string;
   morning: number | null;
   afternoon: number | null;
   evening: number | null;
   night: number | null;
   numberOfDay: number | null;
   frequency?: string;
   instruction: IOption<string> | null;
   notes: string | null;
}

export interface IPrescriptionFormData {
   visit_id: number;
   notes: string | null;
   items: IPrescriptionItemFormData[];
}
