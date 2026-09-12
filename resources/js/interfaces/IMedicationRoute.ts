export interface IMedicationRoute {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMedicationRouteFormData {
  name: string;
  description: string | null;
}
