import { ICategory } from './ICategory'
import { IUnit } from './IUnit'

export interface IMedicine {
    id: number;
    name: string;
    type: string;
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
    type: string;
    description: string | null;
    dosage: string | null;
    category_id: number | null;
    unit_id: number | null;
    unit_price: number | null;
}
