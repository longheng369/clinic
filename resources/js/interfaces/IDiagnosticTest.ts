export interface IDiagnosticTest {
  id: number;
  name: string;
  price: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IDiagnosticTestFormData {
  name: string;
  price: number | null;
  description: string | null;
}

export interface IDiagnosticTestAutocomplete {
  label: string;
  value: number;
  price: number;
}
