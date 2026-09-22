export interface IVaccineDoseRule {
  id?: number;
  dose_number: number;
  age_unit: 'day' | 'month' | 'year';
  min_age: number;
  max_age: number | null;
  amount: number;
  unit_id: number;
}

export interface IVaccine {
  id: number;
  name: string;
  description: string | null;
  dose_rules: IVaccineDoseRule[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

type AgeUnit = 'day' | 'month' | 'year';

export interface IVaccineDoseRuleFormData {
   amount: number;
   amount_unit_id: number;
   interval_from_previous_dose?: number;
   interval_from_previous_dose_unit?: AgeUnit;
}

export interface IVaccineAgeRuleFormData {
   min_age: number | null;
   min_age_unit: AgeUnit;
   max_age: number | null;
   max_age_unit: AgeUnit;
   dose_rules: IVaccineDoseRuleFormData[];
}

export interface IVaccineFormData {
  name: string;
  description: string | null;
  age_rules: IVaccineAgeRuleFormData[];
}
