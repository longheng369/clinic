import { ICategory } from './ICategory';
import { IUnit } from './IUnit';
import { IOption } from './IOption';

export type MedicineType =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'ointment'
  | 'cream'
  | 'drops'
  | 'powder'
  | 'spray'
  | 'solution'
  | 'suspension'
  | 'other';

export const MEDICINE_TYPES: IOption<MedicineType>[] = [
  { value: 'tablet', label: 'medicines.types.tablet' },
  { value: 'capsule', label: 'medicines.types.capsule' },
  { value: 'syrup', label: 'medicines.types.syrup' },
  { value: 'injection', label: 'medicines.types.injection' },
  { value: 'ointment', label: 'medicines.types.ointment' },
  { value: 'cream', label: 'medicines.types.cream' },
  { value: 'drops', label: 'medicines.types.drops' },
  { value: 'powder', label: 'medicines.types.powder' },
  { value: 'spray', label: 'medicines.types.spray' },
  { value: 'solution', label: 'medicines.types.solution' },
  { value: 'suspension', label: 'medicines.types.suspension' },
  { value: 'other', label: 'medicines.types.other' },
];

export interface IMedicine {
  id: number;
  name: string;
  type: MedicineType;
  description: string | null;
  dosage: string | null;
  category_id: number | null;
  unit_id: number | null;
  unit_price: number | null;
  category: ICategory | null;
  unit: IUnit | null;
  created_at: string;
  updated_at: string;
}

export interface IMedicineFormData {
  name: string;
  type: MedicineType;
  description: string | null;
  dosage: string | null;
  category_id: number | null;
  unit_id: number | null;
  unit_price: number | null;
}
