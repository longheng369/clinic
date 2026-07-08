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
            'rules' => ['required', 'array', 'min:1'],
            'rules.*.min_age_months' => ['required', 'integer', 'min:0'],
            'rules.*.max_age_months' => ['nullable', 'integer', 'min:0', 'gte:rules.*.min_age_months'],
            'rules.*.doses' => ['required', 'array', 'min:1'],
            'rules.*.doses.*.dose_number' => ['required', 'integer', 'min:1'],
            'rules.*.doses.*.interval_days' => ['required', 'integer', 'min:0'],
        ];
    }
}
