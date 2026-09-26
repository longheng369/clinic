<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVaccineRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('vaccines')->ignore($this->vaccine)],
            'description' => ['nullable', 'string'],
            'age_rules' => ['required', 'array', 'min:1'],
            'age_rules.*.id' => ['nullable', 'integer', 'exists:vaccine_age_rules,id'],
            'age_rules.*.min_age' => ['required', 'integer', 'min:0'],
            'age_rules.*.min_age_unit' => ['required', 'string', 'in:day,month,year'],
            'age_rules.*.max_age' => ['nullable', 'integer', 'min:0'],
            'age_rules.*.max_age_unit' => ['required', 'string', 'in:day,month,year'],
            'age_rules.*.dose_rules' => ['required', 'array', 'min:1'],
            'age_rules.*.dose_rules.*.amount' => ['required', 'numeric', 'min:1'],
            'age_rules.*.dose_rules.*.amount_unit_id' => ['required', 'exists:units,id'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose' => ['sometimes', 'integer', 'min:0'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose_unit' => ['sometimes', 'string', 'in:day,month,year'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            foreach ($this->input('age_rules', []) as $ageRuleIndex => $ageRule) {
                foreach ($ageRule['dose_rules'] ?? [] as $doseIndex => $doseRule) {
                    if ($doseIndex === 0) {
                        continue;
                    }

                    if (
                        !array_key_exists('interval_from_previous_dose', $doseRule) ||
                        $doseRule['interval_from_previous_dose'] === null ||
                        $doseRule['interval_from_previous_dose'] === ''
                    ) {
                        $validator->errors()->add(
                            "age_rules.$ageRuleIndex.dose_rules.$doseIndex.interval_from_previous_dose",
                            'The interval from previous dose is required.'
                        );
                    }

                    if (
                        !array_key_exists('interval_from_previous_dose_unit', $doseRule) ||
                        $doseRule['interval_from_previous_dose_unit'] === null ||
                        $doseRule['interval_from_previous_dose_unit'] === ''
                    ) {
                        $validator->errors()->add(
                            "age_rules.$ageRuleIndex.dose_rules.$doseIndex.interval_from_previous_dose_unit",
                            'The interval unit from previous dose is required.'
                        );
                    }
                }
            }
        });
    }
}
