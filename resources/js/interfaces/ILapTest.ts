export interface ILapTest {
  id: number;
  name: string;
  price: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ILapTestFormData {
  name: string;
  price: number | null;
  description: string | null;
}
