export interface IUnit {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface IUnitFormData {
    name: string;
    description: string | null;
}
