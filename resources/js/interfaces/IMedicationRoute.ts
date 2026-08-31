export interface IMedicationRoute {
  id: number;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMedicationRouteFormData {
  code: string;
  name: string;
  description: string | null;
}
