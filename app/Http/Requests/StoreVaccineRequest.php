<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVaccineRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:vaccines,name'],
            'description' => ['nullable', 'string'],
            'age_rules' => ['required', 'array', 'min:1'],
            'age_rules.*.min_age' => ['required', 'integer', 'min:0'],
            'age_rules.*.min_age_unit' => ['required', 'string', 'in:day,month,year'],
            'age_rules.*.max_age' => ['nullable', 'integer', 'min:0'],
            'age_rules.*.max_age_unit' => ['required', 'string', 'in:day,month,year'],
            'age_rules.*.dose_rules' => ['required', 'array', 'min:1'],
            'age_rules.*.dose_rules.*.amount' => ['required', 'numeric', 'min:0'],
            'age_rules.*.dose_rules.*.amount_unit_id' => ['required', 'exists:units,id'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose' => ['nullable', 'integer', 'min:0'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose_unit' => ['nullable', 'string', 'in:day,month,year'],
        ];
    }
}
