import { ICategory } from './ICategory'
import { IUnit } from './IUnit'
import { IOption } from './IOption'

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
    | 'other'

export const MEDICINE_TYPES: IOption<MedicineType>[] = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'injection', label: 'Injection' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' },
    { value: 'powder', label: 'Powder' },
    { value: 'spray', label: 'Spray' },
    { value: 'solution', label: 'Solution' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'other', label: 'Other' },
]

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
