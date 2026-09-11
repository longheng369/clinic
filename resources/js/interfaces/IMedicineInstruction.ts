export interface IMedicineInstruction {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMedicineInstructionFormData {
  name: string;
  description: string | null;
}
