export interface IMedicineInstruction {
  id: number;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMedicineInstructionFormData {
  code: string;
  name: string;
  description: string | null;
}
