type AgeUnit = 'day' | 'month' | 'year';

export interface IVaccineDoseRuleFormData {
  amount: number;
  amount_unit_id: number;
  interval_from_previous_dose?: number;
  interval_from_previous_dose_unit?: AgeUnit;
}

export interface IVaccineAgeRule {
  id?: number;
  min_age: number;
  min_age_unit: AgeUnit;
  max_age: number | null;
  max_age_unit: AgeUnit;
  dose_rules: IVaccineDoseRuleFormData[];
}

export interface IVaccine {
  id: number;
  name: string;
  description: string | null;
  age_rules: IVaccineAgeRule[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IVaccineAgeRuleFormData {
  id?: number;
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
